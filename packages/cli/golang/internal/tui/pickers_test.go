package tui

import (
	"encoding/json"
	"reflect"
	"testing"
)

func mustParse(t *testing.T, s string) any {
	t.Helper()
	var v any
	if err := json.Unmarshal([]byte(s), &v); err != nil {
		t.Fatalf("json.Unmarshal: %v", err)
	}
	return v
}

func TestFlattenJSON_FlatArray(t *testing.T) {
	input := mustParse(t, `[{"id":1,"name":"A"},{"id":2,"name":"B"}]`)
	got := flattenJSON(input, "")
	if len(got) != 2 {
		t.Fatalf("expected 2 items, got %d", len(got))
	}
	if got[0]["id"].(float64) != 1 || got[1]["id"].(float64) != 2 {
		t.Errorf("unexpected items: %v", got)
	}
}

func TestFlattenJSON_ListWrapKey_Projects(t *testing.T) {
	input := mustParse(t, `{"projects":[{"id":10},{"id":20}]}`)
	got := flattenJSON(input, "")
	if len(got) != 2 {
		t.Fatalf("expected 2 items, got %d", len(got))
	}
}

func TestFlattenJSON_ListWrapKey_Builds(t *testing.T) {
	input := mustParse(t, `{"builds":[{"id":"abc"},{"id":"def"}]}`)
	got := flattenJSON(input, "")
	if len(got) != 2 {
		t.Fatalf("expected 2 items, got %d: %v", len(got), got)
	}
}

func TestFlattenJSON_ListWrapKey_Reports(t *testing.T) {
	input := mustParse(t, `{"reports":[{"id":1},{"id":2},{"id":3}]}`)
	got := flattenJSON(input, "")
	if len(got) != 3 {
		t.Fatalf("expected 3 items, got %d", len(got))
	}
}

func TestFlattenJSON_ListWrapKey_Scans(t *testing.T) {
	input := mustParse(t, `{"scans":[{"id":5}]}`)
	got := flattenJSON(input, "")
	if len(got) != 1 {
		t.Fatalf("expected 1 item, got %d", len(got))
	}
}

func TestFlattenJSON_ListWrapKey_ScanRuns(t *testing.T) {
	input := mustParse(t, `{"scan_runs":[{"id":7},{"id":8}]}`)
	got := flattenJSON(input, "")
	if len(got) != 2 {
		t.Fatalf("expected 2 items, got %d", len(got))
	}
}

func TestFlattenJSON_ListWrapKey_TestCases(t *testing.T) {
	input := mustParse(t, `{"testCases":[{"id":100}]}`)
	got := flattenJSON(input, "")
	if len(got) != 1 {
		t.Fatalf("expected 1 item, got %d", len(got))
	}
}

func TestFlattenJSON_ItemPath_AutomationBuild(t *testing.T) {
	// API returns [{automation_build:{hashed_id:"abc",...}}, ...]
	input := mustParse(t, `[
		{"automation_build":{"hashed_id":"abc","name":"Build 1"}},
		{"automation_build":{"hashed_id":"def","name":"Build 2"}}
	]`)
	got := flattenJSON(input, "automation_build")
	if len(got) != 2 {
		t.Fatalf("expected 2 items, got %d", len(got))
	}
	if got[0]["hashed_id"] != "abc" {
		t.Errorf("expected hashed_id=abc, got %v", got[0]["hashed_id"])
	}
	if got[1]["hashed_id"] != "def" {
		t.Errorf("expected hashed_id=def, got %v", got[1]["hashed_id"])
	}
}

func TestFlattenJSON_ItemPath_AutomationSession(t *testing.T) {
	input := mustParse(t, `[
		{"automation_session":{"hashed_id":"s1","status":"done"}},
		{"automation_session":{"hashed_id":"s2","status":"running"}}
	]`)
	got := flattenJSON(input, "automation_session")
	if len(got) != 2 {
		t.Fatalf("expected 2 items, got %d", len(got))
	}
	if got[0]["hashed_id"] != "s1" {
		t.Errorf("expected s1, got %v", got[0]["hashed_id"])
	}
}

func TestFlattenJSON_ItemPath_EmptyString_NoUnwrap(t *testing.T) {
	// When itemPath is empty, per-item envelopes are not unwrapped
	input := mustParse(t, `[{"automation_build":{"hashed_id":"abc"}}]`)
	got := flattenJSON(input, "")
	if len(got) != 1 {
		t.Fatalf("expected 1 item, got %d", len(got))
	}
	// The whole wrapper object should be returned
	if _, ok := got[0]["automation_build"]; !ok {
		t.Errorf("expected automation_build key to be present when itemPath is empty")
	}
}

func TestFlattenJSON_NestedListWrap_DataProjects(t *testing.T) {
	// website-scanner: {data:{projects:[...]}} — data is a listWrapKey but value is object,
	// so flattenJSON falls through to the map branch, then projects is found
	input := mustParse(t, `{"data":{"projects":[{"id":1},{"id":2}]}}`)
	got := flattenJSON(input, "")
	if len(got) != 2 {
		t.Fatalf("expected 2 items, got %d: %v", len(got), got)
	}
}

func TestFlattenJSON_SingleObject(t *testing.T) {
	input := mustParse(t, `{"id":42,"name":"Thing"}`)
	got := flattenJSON(input, "")
	if len(got) != 1 {
		t.Fatalf("expected 1 item, got %d", len(got))
	}
	if !reflect.DeepEqual(got[0], map[string]any{"id": float64(42), "name": "Thing"}) {
		t.Errorf("unexpected item: %v", got[0])
	}
}

func TestFlattenJSON_NilInput(t *testing.T) {
	got := flattenJSON(nil, "")
	if got != nil {
		t.Errorf("expected nil, got %v", got)
	}
}

func TestPickValue_SimpleField(t *testing.T) {
	row := map[string]any{"hashed_id": "abc123", "name": "My Build"}
	if got := pickValue(row, "hashed_id"); got != "abc123" {
		t.Errorf("expected abc123, got %q", got)
	}
}

func TestPickValue_NumericField(t *testing.T) {
	row := map[string]any{"id": float64(42)}
	if got := pickValue(row, "id"); got != "42" {
		t.Errorf("expected 42, got %q", got)
	}
}

func TestPickValue_DottedPath(t *testing.T) {
	row := map[string]any{"build": map[string]any{"id": "xyz"}}
	if got := pickValue(row, "build.id"); got != "xyz" {
		t.Errorf("expected xyz, got %q", got)
	}
}

func TestPickValue_MissingField(t *testing.T) {
	row := map[string]any{"name": "A"}
	if got := pickValue(row, "missing"); got != "" {
		t.Errorf("expected empty string, got %q", got)
	}
}
