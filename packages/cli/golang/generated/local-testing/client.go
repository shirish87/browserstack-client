package localtesting

import (
	"context"
	browserstackhttp "github.com/browserstack/browserstack-client/internal/http"
)

type LocalTestingClient struct {
	http *browserstackhttp.Client
}

func New(c *browserstackhttp.Client) *LocalTestingClient {
	return &LocalTestingClient{http: c}
}

func (c *LocalTestingClient) GetInstances(ctx context.Context, auth_token string, last string, state string) (*GetLocalBinaryInstancesResponse, error) {
	var out GetLocalBinaryInstancesResponse
	if err := c.http.Get(ctx, "/local/v1/list", map[string]string{"auth_token": auth_token, "last": last, "state": state}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *LocalTestingClient) GetInstance(ctx context.Context, localInstanceId string, auth_token string) (*GetLocalBinaryInstanceResponse, error) {
	var out GetLocalBinaryInstanceResponse
	if err := c.http.Get(ctx, "/local/v1/" + localInstanceId, map[string]string{"auth_token": auth_token}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *LocalTestingClient) DisconnectInstance(ctx context.Context, localInstanceId string, auth_token string) (*DisconnectLocalBinaryInstanceResponse, error) {
	var out DisconnectLocalBinaryInstanceResponse
	if err := c.http.Delete(ctx, "/local/v1/" + localInstanceId, map[string]string{"auth_token": auth_token}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}
