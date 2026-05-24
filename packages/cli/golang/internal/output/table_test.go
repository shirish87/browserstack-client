package output_test

import (
	"strings"
	"testing"

	"github.com/browserstack/browserstack-client/internal/output"
)

func TestFormatTable_listProjects(t *testing.T) {
	type project struct {
		Id   int    `json:"id"`
		Name string `json:"name"`
	}
	type response struct {
		Projects []project `json:"projects"`
	}
	type result struct {
		Action       string   `json:"action"`
		ListProjects response `json:"list_projects"`
	}

	v := result{
		Action: "list-projects",
		ListProjects: response{
			Projects: []project{
				{Id: 1, Name: "Alpha"},
				{Id: 2, Name: "Beta"},
			},
		},
	}

	got := output.Format(v, nil)

	if !strings.Contains(got, "1") || !strings.Contains(got, "Alpha") {
		t.Errorf("expected project rows in output, got:\n%s", got)
	}
	if !strings.Contains(got, "2") || !strings.Contains(got, "Beta") {
		t.Errorf("expected project rows in output, got:\n%s", got)
	}
	// Should NOT be raw JSON
	if strings.Contains(got, `"list_projects"`) {
		t.Errorf("expected table format, got raw JSON:\n%s", got)
	}
}

func TestFormatTable_fallbackToJSON(t *testing.T) {
	type scalar struct {
		Status string `json:"status"`
	}
	got := output.Format(scalar{Status: "passed"}, nil)
	if !strings.Contains(got, `"status"`) {
		t.Errorf("expected JSON fallback for scalar, got:\n%s", got)
	}
}

func TestFormatTable_emptyList(t *testing.T) {
	type response struct {
		Projects []struct{} `json:"projects"`
	}
	type result struct {
		Action       string   `json:"action"`
		ListProjects response `json:"list_projects"`
	}
	got := output.Format(result{Action: "list-projects", ListProjects: response{}}, nil)
	// Empty array has no rows — falls through to JSON
	if got == "" {
		t.Error("expected non-empty output for empty list")
	}
}
