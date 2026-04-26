package automate

// Generated CLI dispatcher. Do not modify.

import (
	"context"
	"fmt"
)

func argAt(args []string, i int) string {
	if i < len(args) { return args[i] }
	return ""
}

func Dispatch(client *AutomateClient, ctx context.Context, action string, args []string) (interface{}, error) {
	switch action {
	case ActionListBrowsers:
		return client.GetBrowsers(ctx)
	case ActionGetPlan:
		return client.GetPlan(ctx)
	case ActionListSessionAppiumLogs:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: automate list-session-appium-logs <sessionId>")
		}
		return client.GetSessionAppiumLogs(ctx, args[0])
	case ActionGetProjectBadgeKey:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: automate get-project-badge-key <projectId>")
		}
		return client.GetProjectBadgeKey(ctx, args[0])
	case ActionUploadSessionTerminalLogs:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: automate upload-session-terminal-logs <sessionId>")
		}
		return client.UploadSessionTerminalLogs(ctx, args[0], nil, "", nil)
	case ActionDeleteBuilds:
		return client.DeleteBuilds(ctx, argAt(args, 0))
	case ActionGetSession:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: automate get-session <sessionId>")
		}
		return client.GetSession(ctx, args[0])
	case ActionUpdateSession:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: automate update-session <sessionId>")
		}
		return client.UpdateSession(ctx, args[0], nil)
	case ActionDeleteSession:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: automate delete-session <sessionId>")
		}
		return client.DeleteSession(ctx, args[0])
	case ActionDeleteSessions:
		return client.DeleteSessions(ctx, argAt(args, 0))
	case ActionDeleteMediaFile:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: automate delete-media-file <mediaId>")
		}
		return client.DeleteMediaFile(ctx, args[0])
	case ActionGetBuild:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: automate get-build <buildId>")
		}
		return client.GetBuild(ctx, args[0])
	case ActionUpdateBuild:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: automate update-build <buildId>")
		}
		return client.UpdateBuild(ctx, args[0], nil)
	case ActionDeleteBuild:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: automate delete-build <buildId>")
		}
		return client.DeleteBuild(ctx, args[0])
	case ActionListSessionLogs:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: automate list-session-logs <sessionId>")
		}
		return client.GetSessionLogs(ctx, args[0])
	case ActionUploadMediaFile:
		return client.UploadMediaFile(ctx, nil, "", nil)
	case ActionRecycleKey:
		return client.RecycleKey(ctx, nil)
	case ActionListSessions:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: automate list-sessions <buildId> <limit> <offset> <status>")
		}
		return client.GetSessions(ctx, args[0], argAt(args, 1), argAt(args, 2), argAt(args, 3))
	case ActionGetProject:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: automate get-project <projectId>")
		}
		return client.GetProject(ctx, args[0])
	case ActionUpdateProject:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: automate update-project <projectId>")
		}
		return client.UpdateProject(ctx, args[0], nil)
	case ActionDeleteProject:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: automate delete-project <projectId>")
		}
		return client.DeleteProject(ctx, args[0])
	case ActionListSessionSeleniumLogs:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: automate list-session-selenium-logs <sessionId>")
		}
		return client.GetSessionSeleniumLogs(ctx, args[0])
	case ActionUploadBuildTerminalLogs:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: automate upload-build-terminal-logs <buildId>")
		}
		return client.UploadBuildTerminalLogs(ctx, args[0], nil, "", nil)
	case ActionListMediaFiles:
		return client.GetMediaFiles(ctx)
	case ActionListProjects:
		return client.GetProjects(ctx)
	case ActionListSessionConsoleLogs:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: automate list-session-console-logs <sessionId>")
		}
		return client.GetSessionConsoleLogs(ctx, args[0])
	case ActionListSessionTelemetryLogs:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: automate list-session-telemetry-logs <sessionId>")
		}
		return client.GetSessionTelemetryLogs(ctx, args[0])
	case ActionListBuilds:
		return client.GetBuilds(ctx, argAt(args, 0), argAt(args, 1), argAt(args, 2), argAt(args, 3))
	case ActionListSessionNetworkLogs:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: automate list-session-network-logs <sessionId>")
		}
		return client.GetSessionNetworkLogs(ctx, args[0])
	default:
		return nil, fmt.Errorf("unknown action: %s", action)
	}
}
