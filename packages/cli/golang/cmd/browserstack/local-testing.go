package main

import (
	"context"
	"fmt"

	localtesting "github.com/browserstack/browserstack-client/generated/local-testing"
	browserstackhttp "github.com/browserstack/browserstack-client/internal/http"
	"github.com/browserstack/browserstack-client/internal/output"
)

func runLocalTesting(c *browserstackhttp.Client, action string, args []string) error {
	client := localtesting.New(c)
	ctx := context.Background()

	const usage = "Usage: local <action> [args...]"

	if action == "help" {
		fmt.Println(usage)
		return nil
	}

	res, err := localtesting.Dispatch(client, ctx, action, args)
	if err != nil {
		return err
	}

	switch action {
	case "list-instances":
		if res.ListInstances != nil {
			for _, inst := range res.ListInstances.Instances {
				fmt.Printf("%s %s %s\n", inst.Id, inst.LocalIdentifier, inst.StartTime)
			}
			return nil
		}
	}

	return output.Print(res)
}
