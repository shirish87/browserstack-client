package localtesting

// Generated CLI dispatcher. Do not modify.

import (
	"context"
	"fmt"
)

func argAt(args []string, i int) string {
	if i < len(args) { return args[i] }
	return ""
}

func Dispatch(client *LocalTestingClient, ctx context.Context, action string, args []string) (interface{}, error) {
	switch action {
	case ActionListInstances:
		return client.GetInstances(ctx, argAt(args, 0), argAt(args, 1), argAt(args, 2))
	case ActionGetInstance:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: local-testing get-instance <localInstanceId> <auth_token>")
		}
		return client.GetInstance(ctx, args[0], argAt(args, 1))
	case ActionDisconnectInstance:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: local-testing disconnect-instance <localInstanceId> <auth_token>")
		}
		return client.DisconnectInstance(ctx, args[0], argAt(args, 1))
	default:
		return nil, fmt.Errorf("unknown action: %s", action)
	}
}
