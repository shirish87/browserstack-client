package main

import (
	"context"

	"github.com/browserstack/browserstack-client/generated/accessibility"
	browserstackhttp "github.com/browserstack/browserstack-client/internal/http"
	"github.com/browserstack/browserstack-client/internal/output"
)

func runAccessibility(c *browserstackhttp.Client, action string, args []string) error {
	client := accessibility.New(c)
	ctx := context.Background()

	res, err := accessibility.Dispatch(client, ctx, action, args)
	if err != nil {
		return err
	}

	return output.PrintWithColumns(res, accessibility.DisplayColumns(action))
}
