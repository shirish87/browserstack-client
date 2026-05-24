package output

import (
	"bytes"
	"encoding/json"
	"fmt"
	"strings"
	"text/tabwriter"
)

// priorityKeys are shown first (left-to-right) when building table columns.
// Any key not in this list appears after, in alphabetical order, up to maxCols.
var priorityKeys = []string{
	"id", "hashed_id", "uuid", "identifier",
	"name", "title", "label",
	"status", "state",
	"framework", "environment",
	"created_at", "updated_at", "started_at", "finished_at",
	"url", "observability_url",
}

const maxCols = 5

// Format returns a human-readable string for v.
// If v serialises to a dispatch-result shape ({"action":..., "<key>": <list-or-object-with-list>}),
// it renders a table. Otherwise it returns indented JSON.
// cols overrides the columns shown; nil means auto-detect.
func Format(v any, cols []string) string {
	b, err := json.Marshal(v)
	if err != nil {
		return fmt.Sprintf("%v", v)
	}

	var top map[string]json.RawMessage
	if err := json.Unmarshal(b, &top); err != nil {
		// Not an object — just pretty-print.
		return prettyJSON(b)
	}

	// Strip the "action" envelope key produced by DispatchResult.
	delete(top, "action")

	// Find the single payload key.
	if len(top) == 1 {
		for _, raw := range top {
			if rows := extractRows(raw); rows != nil {
				return renderTable(rows, cols)
			}
		}
	}

	return prettyJSON(b)
}

// extractRows returns a slice of row-maps if raw is either a JSON array of objects
// or a JSON object with exactly one array-of-objects field.
func extractRows(raw json.RawMessage) []map[string]any {
	// Try direct array.
	var arr []json.RawMessage
	if json.Unmarshal(raw, &arr) == nil && len(arr) > 0 {
		return parseObjectArray(arr)
	}

	// Try object with one array field.
	var obj map[string]json.RawMessage
	if json.Unmarshal(raw, &obj) != nil {
		return nil
	}
	var best []map[string]any
	for _, v := range obj {
		var inner []json.RawMessage
		if json.Unmarshal(v, &inner) == nil && len(inner) > 0 {
			rows := parseObjectArray(inner)
			if rows != nil && len(rows) > len(best) {
				best = rows
			}
		}
	}
	return best
}

func parseObjectArray(arr []json.RawMessage) []map[string]any {
	out := make([]map[string]any, 0, len(arr))
	for _, item := range arr {
		var m map[string]any
		if json.Unmarshal(item, &m) != nil {
			return nil // mixed types — bail
		}
		out = append(out, m)
	}
	return out
}

func renderTable(rows []map[string]any, cols []string) string {
	if len(rows) == 0 {
		return "(no results)"
	}

	if len(cols) == 0 {
		cols = chooseCols(rows)
	}
	if len(cols) == 0 {
		b, _ := json.MarshalIndent(rows, "", "  ")
		return string(b)
	}

	var buf bytes.Buffer
	w := tabwriter.NewWriter(&buf, 0, 0, 2, ' ', 0)

	// Header
	fmt.Fprintln(w, strings.ToUpper(strings.Join(cols, "\t")))
	// Separator
	seps := make([]string, len(cols))
	for i, c := range cols {
		seps[i] = strings.Repeat("-", len(c))
	}
	fmt.Fprintln(w, strings.Join(seps, "\t"))

	for _, row := range rows {
		vals := make([]string, len(cols))
		for i, c := range cols {
			vals[i] = cellString(row[c])
		}
		fmt.Fprintln(w, strings.Join(vals, "\t"))
	}
	w.Flush()
	return strings.TrimRight(buf.String(), "\n")
}

// chooseCols picks up to maxCols columns: priority keys first, then others.
func chooseCols(rows []map[string]any) []string {
	// Collect all keys present across rows.
	all := map[string]bool{}
	for _, r := range rows {
		for k := range r {
			all[k] = true
		}
	}

	var chosen []string
	seen := map[string]bool{}
	for _, k := range priorityKeys {
		if all[k] && !seen[k] {
			chosen = append(chosen, k)
			seen[k] = true
			if len(chosen) == maxCols {
				break
			}
		}
	}
	return chosen
}

func cellString(v any) string {
	if v == nil {
		return ""
	}
	switch t := v.(type) {
	case string:
		return t
	case float64:
		if t == float64(int64(t)) {
			return fmt.Sprintf("%d", int64(t))
		}
		return fmt.Sprintf("%g", t)
	case bool:
		if t {
			return "true"
		}
		return "false"
	default:
		b, _ := json.Marshal(v)
		return string(b)
	}
}

func prettyJSON(b []byte) string {
	var buf bytes.Buffer
	if err := json.Indent(&buf, b, "", "  "); err != nil {
		return string(b)
	}
	return buf.String()
}
