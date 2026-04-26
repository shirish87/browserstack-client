package bshttp_test

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	bshttp "github.com/browserstack/browserstack-client/internal/http"
)

func newTestClient(srv *httptest.Server) *bshttp.Client {
	return bshttp.NewWithHTTPClient(srv.URL, "user", "key", srv.Client())
}

func TestGet(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != "GET" {
			t.Errorf("expected GET, got %s", r.Method)
		}
		u, p, ok := r.BasicAuth()
		if !ok || u != "user" || p != "key" {
			t.Error("missing or wrong basic auth")
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"name": "build-1"})
	}))
	defer srv.Close()

	type Resp struct {
		Name string `json:"name"`
	}
	var out Resp
	err := newTestClient(srv).Get(context.Background(), "/automate/builds.json", nil, &out)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if out.Name != "build-1" {
		t.Errorf("expected name 'build-1', got '%s'", out.Name)
	}
}

func TestGet_WithQuery(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Query().Get("limit") != "10" {
			t.Errorf("expected query param limit=10, got %s", r.URL.RawQuery)
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{})
	}))
	defer srv.Close()

	var out map[string]string
	err := newTestClient(srv).Get(context.Background(), "/builds", map[string]string{"limit": "10"}, &out)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
}

func TestGet_NonOK(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(404)
		w.Write([]byte("not found body"))
	}))
	defer srv.Close()

	var out map[string]string
	err := newTestClient(srv).Get(context.Background(), "/missing", nil, &out)
	if err == nil {
		t.Fatal("expected error for 404, got nil")
	}
	apiErr, ok := err.(*bshttp.APIError)
	if !ok {
		t.Fatalf("expected *APIError, got %T: %v", err, err)
	}
	if apiErr.StatusCode != 404 {
		t.Errorf("expected status 404, got %d", apiErr.StatusCode)
	}
	if !strings.Contains(apiErr.Body, "not found body") {
		t.Errorf("expected body in error, got %q", apiErr.Body)
	}
}

func TestPost(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != "POST" {
			t.Errorf("expected POST, got %s", r.Method)
		}
		var body map[string]string
		json.NewDecoder(r.Body).Decode(&body)
		if body["name"] != "my-build" {
			t.Errorf("unexpected body: %v", body)
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"id": "123"})
	}))
	defer srv.Close()

	type Resp struct{ Id string `json:"id"` }
	var out Resp
	err := newTestClient(srv).Post(context.Background(), "/builds", map[string]string{"name": "my-build"}, &out)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if out.Id != "123" {
		t.Errorf("expected id '123', got '%s'", out.Id)
	}
}

func TestGetText(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/plain")
		w.Write([]byte("log line 1\nlog line 2"))
	}))
	defer srv.Close()

	text, err := newTestClient(srv).GetText(context.Background(), "/logs", nil)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !strings.Contains(text, "log line 1") {
		t.Errorf("unexpected text: %q", text)
	}
}
