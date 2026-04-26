package testreporting

// Generated CLI dispatcher. Do not modify.

import (
	"context"
	"fmt"
)

func argAt(args []string, i int) string {
	if i < len(args) { return args[i] }
	return ""
}

func Dispatch(client *TestReportingClient, ctx context.Context, action string, args []string) (interface{}, error) {
	switch action {
	case ActionListProjects:
		return client.GetProjects(ctx, argAt(args, 0))
	case ActionListProjectBuilds:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: test-reporting list-project-builds <projectId> <unique_build_names> <build_tags> <build_status> <users> <frameworks> <is_archived> <date_range> <next_page>")
		}
		return client.GetProjectBuilds(ctx, args[0], argAt(args, 1), argAt(args, 2), argAt(args, 3), argAt(args, 4), argAt(args, 5), argAt(args, 6), argAt(args, 7), argAt(args, 8))
	case ActionStartBuild:
		return client.StartBuild(ctx, nil)
	case ActionGetLatestBuild:
		return client.GetLatestBuild(ctx, argAt(args, 0), argAt(args, 1), argAt(args, 2), argAt(args, 3), argAt(args, 4))
	case ActionGetBuild:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: test-reporting get-build <buildId>")
		}
		return client.GetBuild(ctx, args[0])
	case ActionUpdateBuild:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: test-reporting update-build <buildId>")
		}
		return client.UpdateBuild(ctx, args[0], nil)
	case ActionFinishBuild:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: test-reporting finish-build <buildHashedId>")
		}
		return client.FinishBuild(ctx, args[0], nil)
	case ActionStartTestRun:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: test-reporting start-test-run <buildHashedId>")
		}
		return client.StartTestRun(ctx, args[0], nil)
	case ActionFinishTestRun:
		if len(args) < 2 {
			return nil, fmt.Errorf("usage: test-reporting finish-test-run <buildHashedId> <testRunUuid>")
		}
		return client.FinishTestRun(ctx, args[0], args[1], nil)
	case ActionStartHookRun:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: test-reporting start-hook-run <buildHashedId>")
		}
		return client.StartHookRun(ctx, args[0], nil)
	case ActionFinishHookRun:
		if len(args) < 2 {
			return nil, fmt.Errorf("usage: test-reporting finish-hook-run <buildHashedId> <hookRunUuid>")
		}
		return client.FinishHookRun(ctx, args[0], args[1], nil)
	case ActionAddBuildLogs:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: test-reporting add-build-logs <buildHashedId>")
		}
		return client.AddBuildLogs(ctx, args[0], nil)
	case ActionListTestRuns:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: test-reporting list-test-runs <buildId> <re_runs> <test_statuses> <is_flaky> <is_new_failure> <sort> <order> <next_page>")
		}
		return client.GetTestRuns(ctx, args[0], argAt(args, 1), argAt(args, 2), argAt(args, 3), argAt(args, 4), argAt(args, 5), argAt(args, 6), argAt(args, 7))
	case ActionGetSelfHealingReport:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: test-reporting get-self-healing-report <buildUuid>")
		}
		return client.GetSelfHealingReport(ctx, args[0])
	case ActionListQualityGateStatus:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: test-reporting list-quality-gate-status <buildUuid>")
		}
		return client.GetQualityGateStatus(ctx, args[0])
	case ActionListQualityGateSettings:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: test-reporting list-quality-gate-settings <projectName>")
		}
		return client.GetQualityGateSettings(ctx, args[0])
	case ActionUpdateQualityGateSettings:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: test-reporting update-quality-gate-settings <projectName>")
		}
		return client.UpdateQualityGateSettings(ctx, args[0], nil)
	case ActionCreateQualityGateProfile:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: test-reporting create-quality-gate-profile <projectName>")
		}
		return client.CreateQualityGateProfile(ctx, args[0], nil)
	case ActionGetQualityGateProfile:
		if len(args) < 2 {
			return nil, fmt.Errorf("usage: test-reporting get-quality-gate-profile <projectName> <profileUuid>")
		}
		return client.GetQualityGateProfile(ctx, args[0], args[1])
	case ActionUpdateQualityGateProfile:
		if len(args) < 2 {
			return nil, fmt.Errorf("usage: test-reporting update-quality-gate-profile <projectName> <profileUuid>")
		}
		return client.UpdateQualityGateProfile(ctx, args[0], args[1], nil)
	case ActionDeleteQualityGateProfile:
		if len(args) < 2 {
			return nil, fmt.Errorf("usage: test-reporting delete-quality-gate-profile <projectName> <profileUuid>")
		}
		return client.DeleteQualityGateProfile(ctx, args[0], args[1])
	case ActionToggleQualityGateProfile:
		if len(args) < 2 {
			return nil, fmt.Errorf("usage: test-reporting toggle-quality-gate-profile <projectName> <profileUuid>")
		}
		return client.ToggleQualityGateProfile(ctx, args[0], args[1], nil)
	case ActionUploadReport:
		return client.UploadReport(ctx, nil, "", nil)
	default:
		return nil, fmt.Errorf("unknown action: %s", action)
	}
}
