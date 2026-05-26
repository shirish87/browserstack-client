package main

import (
	"context"
	"fmt"

	websitescanner "github.com/browserstack/browserstack-client/generated/website-scanner"
	browserstackhttp "github.com/browserstack/browserstack-client/internal/http"
	"github.com/browserstack/browserstack-client/internal/output"
	"github.com/browserstack/browserstack-client/internal/tui"
)

func runWebsiteScanner(c *browserstackhttp.Client, action string, args []string) error {
	client := websitescanner.New(c)
	ctx := context.Background()

	const usage = `Usage: website-scanner <action> [args...]

Actions:
  list-website-scanner-scans
  create-website-scanner-scan
  get-website-scanner-scan              <scanId>
  trigger-website-scanner-scan-run      <scanId>
  list-website-scanner-scan-runs        <scanId> [page [pageSize]]
  get-website-scanner-scan-run-summary  <scanId> <reportId> [product]
  list-website-scanner-scan-run-status  <scanId> <reportId>
  list-website-scanner-auth-configs
  create-website-scanner-auth-config`

	if action == "help" {
		fmt.Println(usage)
		return nil
	}

	if len(args) > 0 && args[len(args)-1] == "help" {
		if h := tui.ActionHelp(websitescanner.ProductWebsiteScanner, action); h != "" {
			fmt.Println(h)
			return nil
		}
	}

	res, err := websitescanner.Dispatch(client, ctx, action, args)
	if err != nil {
		return err
	}

	return output.PrintWithColumns(res, websitescanner.DisplayColumns(action))
}
