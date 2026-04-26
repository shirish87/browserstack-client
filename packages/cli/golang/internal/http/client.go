package browserstackhttp

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
)

type Client struct {
	baseURL    string
	username   string
	accessKey  string
	httpClient *http.Client
}

type APIError struct {
	StatusCode int
	Status     string
	Body       string
}

func (e *APIError) Error() string {
	status := e.Status
	if status == "" {
		status = http.StatusText(e.StatusCode)
	}

	prefix := fmt.Sprintf("Error: %d %s", e.StatusCode, strings.TrimPrefix(status, fmt.Sprintf("%d ", e.StatusCode)))

	if len(e.Body) > 0 {
		trimmed := bytes.TrimSpace([]byte(e.Body))
		lowerBody := bytes.ToLower(trimmed)
		if bytes.HasPrefix(lowerBody, []byte("<html")) ||
			bytes.HasPrefix(lowerBody, []byte("<!doctype")) ||
			bytes.Contains(lowerBody, []byte("<head")) ||
			bytes.Contains(lowerBody, []byte("<body")) {
			return prefix
		}

		// If it's JSON, try to extract error or message field
		var parsed map[string]any
		if err := json.Unmarshal(trimmed, &parsed); err == nil {
			for _, key := range []string{"error", "message", "detail", "description"} {
				if val, ok := parsed[key].(string); ok && val != "" {
					return fmt.Sprintf("%s: %s", prefix, val)
				}
			}
		}

		// Limit the raw body length if we still decide to show it
		bodyStr := e.Body
		if len(bodyStr) > 512 {
			bodyStr = bodyStr[:512] + "..."
		}
		return fmt.Sprintf("%s: %s", prefix, bodyStr)
	}
	return prefix
}

func New(baseURL, username, accessKey string) *Client {
	return &Client{
		baseURL:    baseURL,
		username:   username,
		accessKey:  accessKey,
		httpClient: &http.Client{},
	}
}

func NewWithHTTPClient(baseURL, username, accessKey string, hc *http.Client) *Client {
	return &Client{baseURL: baseURL, username: username, accessKey: accessKey, httpClient: hc}
}

func (c *Client) buildURL(path string, query map[string]string) string {
	u := c.baseURL + path
	if len(query) == 0 {
		return u
	}
	params := url.Values{}
	for k, v := range query {
		params.Set(k, v)
	}
	return u + "?" + params.Encode()
}

func (c *Client) do(req *http.Request) ([]byte, error) {
	req.SetBasicAuth(c.username, c.accessKey)
	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("request failed: %w", err)
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("reading response body: %w", err)
	}
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return nil, &APIError{
			StatusCode: resp.StatusCode,
			Status:     resp.Status,
			Body:       string(body),
		}
	}
	return body, nil
}

func (c *Client) Get(ctx context.Context, path string, query map[string]string, out any) error {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, c.buildURL(path, query), nil)
	if err != nil {
		return err
	}
	body, err := c.do(req)
	if err != nil {
		return err
	}
	return json.Unmarshal(body, out)
}

func (c *Client) GetText(ctx context.Context, path string, query map[string]string) (string, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, c.buildURL(path, query), nil)
	if err != nil {
		return "", err
	}
	body, err := c.do(req)
	if err != nil {
		return "", err
	}
	return string(body), nil
}

func (c *Client) Post(ctx context.Context, path string, bodyIn any, out any) error {
	return c.doJSON(ctx, http.MethodPost, path, bodyIn, out)
}

func (c *Client) Put(ctx context.Context, path string, bodyIn any, out any) error {
	return c.doJSON(ctx, http.MethodPut, path, bodyIn, out)
}

func (c *Client) Patch(ctx context.Context, path string, bodyIn any, out any) error {
	return c.doJSON(ctx, http.MethodPatch, path, bodyIn, out)
}

func (c *Client) Delete(ctx context.Context, path string, query map[string]string, out any) error {
	req, err := http.NewRequestWithContext(ctx, http.MethodDelete, c.buildURL(path, query), nil)
	if err != nil {
		return err
	}
	body, err := c.do(req)
	if err != nil {
		return err
	}
	if out != nil && len(body) > 0 {
		return json.Unmarshal(body, out)
	}
	return nil
}

func (c *Client) doJSON(ctx context.Context, method, path string, bodyIn any, out any) error {
	b, err := json.Marshal(bodyIn)
	if err != nil {
		return fmt.Errorf("marshaling request body: %w", err)
	}
	req, err := http.NewRequestWithContext(ctx, method, c.baseURL+path, bytes.NewReader(b))
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", "application/json")
	body, err := c.do(req)
	if err != nil {
		return err
	}
	if out != nil && len(body) > 0 {
		return json.Unmarshal(body, out)
	}
	return nil
}

func (c *Client) PostMultipart(ctx context.Context, path string, file []byte, fileName string, fields map[string]string, out any) error {
	body, contentType, err := buildMultipart(file, fileName, fields)
	if err != nil {
		return err
	}
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, c.baseURL+path, body)
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", contentType)
	respBody, err := c.do(req)
	if err != nil {
		return err
	}
	if out != nil && len(respBody) > 0 {
		return json.Unmarshal(respBody, out)
	}
	return nil
}
