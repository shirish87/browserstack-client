package screenshots

import (
	"context"
	bshttp "github.com/browserstack/browserstack-client/internal/http"
)

type ScreenshotsClient struct {
	http *bshttp.Client
}

func New(c *bshttp.Client) *ScreenshotsClient {
	return &ScreenshotsClient{http: c}
}

func (c *ScreenshotsClient) GetScreenshotsJob(ctx context.Context, jobId string) (*ScreenshotsJob, error) {
	var out ScreenshotsJob
	if err := c.http.Get(ctx, "/screenshots/" + jobId + ".json", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *ScreenshotsClient) CreateScreenshotsJob(ctx context.Context, body *NewScreenshot) (*NewScreenshotsJob, error) {
	var out NewScreenshotsJob
	if err := c.http.Post(ctx, "/screenshots", body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *ScreenshotsClient) GetScreenshotsBrowsers(ctx context.Context) (*BrowserList, error) {
	var out BrowserList
	if err := c.http.Get(ctx, "/screenshots/browsers.json", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}
