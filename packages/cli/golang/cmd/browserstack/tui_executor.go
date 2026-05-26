package main

import (
	"context"
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

// makePickerFetcher returns a PickerFetcher that calls product Dispatch functions directly
// and returns the raw JSON-marshalled DispatchResult, bypassing human-formatted output.
func makePickerFetcher(username, accessKey string) tui.PickerFetcher {
	apiClient := browserstackhttp.New(baseURLAPI, username, accessKey)
	accessibilityClient := browserstackhttp.New(baseURLAccessibility, username, accessKey)
	testManagementClient := browserstackhttp.New(baseURLTestManagement, username, accessKey)
	websiteScannerClient := browserstackhttp.New(baseURLWebsiteScanner, username, accessKey)

	return func(productID, actionID string, filterValues map[string]string) (string, error) {
		// Find the action in the manifest to build args correctly.
		var prod *tui.Product
		var act *tui.Action
		for i := range tui.Manifest {
			if tui.Manifest[i].ID != productID {
				continue
			}
			prod = &tui.Manifest[i]
			for j := range prod.Resources {
				for k := range prod.Resources[j].Actions {
					if prod.Resources[j].Actions[k].ID == actionID {
						act = &prod.Resources[j].Actions[k]
					}
				}
			}
		}
		if prod == nil || act == nil {
			return "", fmt.Errorf("picker source not found: %s.%s", productID, actionID)
		}

		args := buildArgs(act, filterValues)
		if len(args) == 0 {
			return "", fmt.Errorf("no action")
		}
		rest := args[1:]
		ctx := context.Background()

		var result any
		var err error

		switch productID {
		case automate.ProductAutomate:
			result, err = automate.Dispatch(automate.New(apiClient), ctx, actionID, rest)
		case appautomate.ProductAppAutomate:
			result, err = appautomate.Dispatch(appautomate.New(apiClient), ctx, actionID, rest)
		case accessibility.ProductAccessibility:
			result, err = accessibility.Dispatch(accessibility.New(accessibilityClient), ctx, actionID, rest)
		case testmanagement.ProductTestManagement:
			result, err = testmanagement.Dispatch(testmanagement.New(testManagementClient), ctx, actionID, rest)
		case testreporting.ProductTestReporting:
			c := browserstackhttp.New(testReportingBaseURL, username, accessKey)
			result, err = testreporting.Dispatch(testreporting.New(c), ctx, actionID, rest)
		case websitescanner.ProductWebsiteScanner:
			result, err = websitescanner.Dispatch(websitescanner.New(websiteScannerClient), ctx, actionID, rest)
		default:
			return "", fmt.Errorf("picker not supported for product: %s", productID)
		}
		if err != nil {
			return "", err
		}

		// Marshal the DispatchResult then extract just the payload field (strip the "action" envelope).
		// The DispatchResult is {"action":"...","<field_name>":<data>} — flattenJSON needs the raw data.
		b, merr := json.Marshal(result)
		if merr != nil {
			return "", merr
		}
		var envelope map[string]json.RawMessage
		if jerr := json.Unmarshal(b, &envelope); jerr != nil {
			return string(b), nil
		}
		delete(envelope, "action")
		for _, raw := range envelope {
			return string(raw), nil
		}
		return "[]", nil
	}
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
