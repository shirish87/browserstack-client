package screenshots

import (
	"context"
	browserstackhttp "github.com/browserstack/browserstack-client/internal/http"
)

type ScreenshotsClient struct {
	http *browserstackhttp.Client
}

func New(c *browserstackhttp.Client) *ScreenshotsClient {
	return &ScreenshotsClient{http: c}
}

func (c *ScreenshotsClient) GetJob(ctx context.Context, jobId string) (*ScreenshotsJob, error) {
	var out ScreenshotsJob
	if err := c.http.Get(ctx, "/screenshots/" + jobId + ".json", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *ScreenshotsClient) CreateJob(ctx context.Context, body *NewScreenshot) (*NewScreenshotsJob, error) {
	var out NewScreenshotsJob
	if err := c.http.Post(ctx, "/screenshots", body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *ScreenshotsClient) GetBrowsers(ctx context.Context) (*BrowserList, error) {
	var out BrowserList
	if err := c.http.Get(ctx, "/screenshots/browsers.json", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}
