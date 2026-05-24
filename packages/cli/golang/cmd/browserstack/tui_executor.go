package main

import (
	"encoding/json"
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
	websitescanner "github.com/browserstack/browserstack-client/generated/website-scanner"
	browserstackhttp "github.com/browserstack/browserstack-client/internal/http"
	"github.com/browserstack/browserstack-client/internal/tui"
)

func setNested(target map[string]any, dottedKey string, value any) {
	parts := strings.Split(dottedKey, ".")
	cur := target
	for i := 0; i < len(parts)-1; i++ {
		p := parts[i]
		next, ok := cur[p].(map[string]any)
		if !ok {
			next = map[string]any{}
			cur[p] = next
		}
		cur = next
	}
	cur[parts[len(parts)-1]] = value
}

func coerceBodyValue(f tui.Field, raw string) any {
	if f.Type == tui.FieldTypeBoolean {
		return raw == "true"
	}
	if f.Type == tui.FieldTypeNumber {
		var n float64
		if _, err := fmt.Sscanf(raw, "%g", &n); err == nil {
			return n
		}
	}
	return raw
}

// buildArgs converts TUI form values into positional CLI args.
// Path and query become individual positionals; body values are collapsed into a
// single JSON object positional (matches the existing parser that JSON.parses positional[0]).
func buildArgs(action *tui.Action, values map[string]string) []string {
	args := []string{action.ID}
	for _, f := range action.Fields {
		if f.Location != tui.LocationPath {
			continue
		}
		v := values[f.Name]
		if v != "" {
			args = append(args, v)
		} else if f.Required {
			args = append(args, "")
		}
	}
	for _, f := range action.Fields {
		if f.Location != tui.LocationQuery {
			continue
		}
		v := values[f.Name]
		if v != "" {
			args = append(args, v)
		} else if f.Required {
			args = append(args, "")
		}
	}
	body := map[string]any{}
	hasBody := false
	for _, f := range action.Fields {
		if f.Location != tui.LocationBody {
			continue
		}
		v := values[f.Name]
		if v == "" {
			continue
		}
		setNested(body, f.Name, coerceBodyValue(f, v))
		hasBody = true
	}
	if hasBody {
		b, _ := json.Marshal(body)
		args = append(args, string(b))
	}
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
	apiClient := browserstackhttp.New(baseURLAPI, username, accessKey)
	accessibilityClient := browserstackhttp.New(baseURLAccessibility, username, accessKey)
	testManagementClient := browserstackhttp.New(baseURLTestManagement, username, accessKey)
	screenshotsClient := browserstackhttp.New(baseURLScreenshots, username, accessKey)
	websiteScannerClient := browserstackhttp.New(baseURLWebsiteScanner, username, accessKey)

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
			case websitescanner.ProductWebsiteScanner:
				return runWebsiteScanner(websiteScannerClient, actionName, rest)
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
