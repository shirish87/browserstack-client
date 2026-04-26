package screenshots

// Generated CLI dispatcher. Do not modify.

import (
	"context"
	"fmt"
)

func argAt(args []string, i int) string {
	if i < len(args) { return args[i] }
	return ""
}

func Dispatch(client *ScreenshotsClient, ctx context.Context, action string, args []string) (interface{}, error) {
	switch action {
	case ActionGetJob:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: screenshots get-job <jobId>")
		}
		return client.GetJob(ctx, args[0])
	case ActionCreateJob:
		return client.CreateJob(ctx, nil)
	case ActionListBrowsers:
		return client.GetBrowsers(ctx)
	default:
		return nil, fmt.Errorf("unknown action: %s", action)
	}
}
