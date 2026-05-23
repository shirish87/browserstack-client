package main

import (
	"fmt"
	"io"
	"os"
	"strings"

	"github.com/browserstack/browserstack-client/generated/accessibility"
	appautomate "github.com/browserstack/browserstack-client/generated/app-automate"
	"github.com/browserstack/browserstack-client/generated/automate"
	"github.com/browserstack/browserstack-client/generated/screenshots"
	testmanagement "github.com/browserstack/browserstack-client/generated/test-management"
	testreporting "github.com/browserstack/browserstack-client/generated/test-reporting"
	browserstackhttp "github.com/browserstack/browserstack-client/internal/http"
	"github.com/browserstack/browserstack-client/internal/tui"
)

// buildArgs converts TUI form values into positional CLI args.
// Order: path fields, then query fields, then body fields (matches CLI parser expectations).
func buildArgs(action *tui.Action, values map[string]string) []string {
	args := []string{action.ID}
	add := func(loc tui.FieldLocation) {
		for _, f := range action.Fields {
			if f.Location == loc {
				v, ok := values[f.Name]
				if !ok || v == "" {
					if f.Required {
						args = append(args, "")
					}
					continue
				}
				args = append(args, v)
			}
		}
	}
	add(tui.LocationPath)
	add(tui.LocationQuery)
	add(tui.LocationBody)
	return args
}

// withCapturedOutput runs fn with os.Stdout/os.Stderr redirected to a pipe.
// Returns the captured combined output.
func withCapturedOutput(fn func() error) (string, error) {
	rOut, wOut, err := os.Pipe()
	if err != nil {
		return "", err
	}
	rErr, wErr, err := os.Pipe()
	if err != nil {
		rOut.Close()
		wOut.Close()
		return "", err
	}

	originalStdout := os.Stdout
	originalStderr := os.Stderr
	os.Stdout = wOut
	os.Stderr = wErr

	type chunk struct {
		data string
		err  error
	}
	outCh := make(chan chunk, 1)
	errCh := make(chan chunk, 1)
	go func() {
		b, e := io.ReadAll(rOut)
		outCh <- chunk{string(b), e}
	}()
	go func() {
		b, e := io.ReadAll(rErr)
		errCh <- chunk{string(b), e}
	}()

	runErr := fn()

	os.Stdout = originalStdout
	os.Stderr = originalStderr
	wOut.Close()
	wErr.Close()

	out := <-outCh
	errOut := <-errCh

	combined := out.data
	if errOut.data != "" {
		if combined != "" {
			combined += "\n"
		}
		combined += errOut.data
	}
	return combined, runErr
}

func makeExecutor(username, accessKey string) tui.Executor {
	apiClient := browserstackhttp.New("https://api.browserstack.com", username, accessKey)
	accessibilityClient := browserstackhttp.New("https://api-accessibility.browserstack.com", username, accessKey)
	testManagementClient := browserstackhttp.New("https://test-management.browserstack.com", username, accessKey)
	screenshotsClient := browserstackhttp.New("https://www.browserstack.com", username, accessKey)

	return func(product *tui.Product, action *tui.Action, values map[string]string) (string, error) {
		args := buildArgs(action, values)
		if len(args) == 0 {
			return "", fmt.Errorf("no action")
		}
		actionName := args[0]
		rest := args[1:]

		out, runErr := withCapturedOutput(func() error {
			switch product.ID {
			case "local":
				return runLocalWrapper(apiClient, accessKey, actionName, rest)
			case "local-testing":
				return runLocalTesting(apiClient, actionName, rest)
			case automate.ProductAutomate:
				return runAutomate(apiClient, actionName, rest)
			case appautomate.ProductAppAutomate:
				return runAppAutomate(apiClient, actionName, rest)
			case screenshots.ProductScreenshots:
				return runScreenshots(screenshotsClient, actionName, rest)
			case accessibility.ProductAccessibility:
				return runAccessibility(accessibilityClient, actionName, rest)
			case testmanagement.ProductTestManagement:
				return runTestManagement(testManagementClient, actionName, rest)
			case testreporting.ProductTestReporting:
				return runTestReporting(username, accessKey, actionName, rest)
			}
			return fmt.Errorf("unknown product: %s", product.ID)
		})

		if runErr != nil {
			combined := strings.TrimRight(out, "\n")
			return combined, runErr
		}
		return out, nil
	}
}
