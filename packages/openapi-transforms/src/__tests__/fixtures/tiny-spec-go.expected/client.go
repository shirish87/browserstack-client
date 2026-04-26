package automate

import (
	"context"
	"strconv"

	bshttp "github.com/browserstack/browserstack-client/internal/http"
)

type AutomateClient struct {
	http *bshttp.Client
}

func New(c *bshttp.Client) *AutomateClient {
	return &AutomateClient{http: c}
}

func (c *AutomateClient) GetProject(ctx context.Context, projectId int) (*Envelope, error) {
	var out Envelope
	if err := c.http.Get(ctx, "/projects/" + strconv.Itoa(projectId), nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AutomateClient) GetLogs(ctx context.Context) (string, error) {
	return c.http.GetText(ctx, "/logs", nil)
}
