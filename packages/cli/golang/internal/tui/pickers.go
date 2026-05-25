package tui

import (
	"encoding/json"
	"fmt"
	"strings"
	"sync"
)

// PickerItem represents one row in a picker source.
type PickerItem struct {
	Value string
	Label string
	Raw   map[string]any
}

// PickerFetcher invokes a source action and returns its raw JSON output (and error).
// The runtime (cmd/browserstack) provides the implementation that calls executeAction.
type PickerFetcher func(productID, actionID string, args map[string]string) (string, error)

var (
	pickerCache   = map[string][]PickerItem{}
	pickerCacheMu sync.Mutex
)

func findActionByID(sourceID string) (*Product, *Action, bool) {
	dot := strings.Index(sourceID, ".")
	if dot < 0 {
		return nil, nil, false
	}
	productID := sourceID[:dot]
	actionID := sourceID[dot+1:]
	for i := range Manifest {
		if Manifest[i].ID != productID {
			continue
		}
		for j := range Manifest[i].Resources {
			for k := range Manifest[i].Resources[j].Actions {
				if Manifest[i].Resources[j].Actions[k].ID == actionID {
					return &Manifest[i], &Manifest[i].Resources[j].Actions[k], true
				}
			}
		}
	}
	return nil, nil, false
}

func pickValue(raw map[string]any, path string) string {
	var cur any = raw
	for _, seg := range strings.Split(path, ".") {
		m, ok := cur.(map[string]any)
		if !ok {
			return ""
		}
		v, ok := m[seg]
		if !ok {
			return ""
		}
		cur = v
	}
	if cur == nil {
		return ""
	}
	switch v := cur.(type) {
	case string:
		return v
	case float64:
		// JSON numbers come back as float64
		if v == float64(int64(v)) {
			return fmt.Sprintf("%d", int64(v))
		}
		return fmt.Sprintf("%v", v)
	default:
		b, _ := json.Marshal(cur)
		return string(b)
	}
}

// flattenJSON walks parsed JSON and produces a list of object items.
// Recognises common wrapper keys like data/items/results/projects/builds/sessions.
// itemPath is the per-item envelope key from PickerConfig (e.g. "automation_build").
var listWrapKeys = []string{
	"data", "items", "results",
	"automation_builds", "automation_sessions", "automate_builds",
	"projects", "builds", "sessions",
	"reports", "scans", "scan_runs", "testCases",
}

func flattenJSON(v any, itemPath string) []map[string]any {
	switch t := v.(type) {
	case []any:
		var out []map[string]any
		for _, el := range t {
			out = append(out, flattenJSON(el, itemPath)...)
		}
		return out
	case map[string]any:
		// List-level unwrap: {projects:[...]} → [...]
		// Also recurse into object values of wrap keys (e.g. {data:{projects:[...]}})
		for _, key := range listWrapKeys {
			if inner, ok := t[key]; ok {
				switch inner.(type) {
				case []any:
					return flattenJSON(inner, itemPath)
				case map[string]any:
					return flattenJSON(inner, itemPath)
				}
			}
		}
		// Per-item envelope unwrap using itemPath hint from PickerConfig
		if itemPath != "" {
			if inner, ok := t[itemPath]; ok {
				if m, ok := inner.(map[string]any); ok {
					return []map[string]any{m}
				}
			}
		}
		return []map[string]any{t}
	}
	return nil
}

// FetchPickerItems fetches and caches picker items, given a fetcher (which invokes the source action).
// filterValues populates the source action's path/query params (e.g. projectId for list-builds).
func FetchPickerItems(picker *PickerConfig, fetcher PickerFetcher, filterValues map[string]string) ([]PickerItem, error) {
	if picker == nil || fetcher == nil {
		return nil, nil
	}
	product, action, ok := findActionByID(picker.Source)
	if !ok {
		return nil, fmt.Errorf("picker source not found: %s", picker.Source)
	}

	// Build a stable cache key
	cacheKey := picker.Source
	keys := make([]string, 0, len(filterValues))
	for k := range filterValues {
		keys = append(keys, k)
	}
	// Sort for stable key
	for i := 0; i < len(keys); i++ {
		for j := i + 1; j < len(keys); j++ {
			if keys[j] < keys[i] {
				keys[i], keys[j] = keys[j], keys[i]
			}
		}
	}
	for _, k := range keys {
		cacheKey += ":" + k + "=" + filterValues[k]
	}

	pickerCacheMu.Lock()
	if v, ok := pickerCache[cacheKey]; ok {
		pickerCacheMu.Unlock()
		return v, nil
	}
	pickerCacheMu.Unlock()

	output, err := fetcher(product.ID, action.ID, filterValues)
	if err != nil {
		return nil, err
	}

	var parsed any
	if e := json.Unmarshal([]byte(output), &parsed); e != nil {
		return nil, fmt.Errorf("parse picker source response: %w", e)
	}
	rows := flattenJSON(parsed, picker.ItemPath)

	labelFields := picker.LabelFields
	if len(labelFields) == 0 {
		labelFields = []string{picker.ValueField}
	}

	out := make([]PickerItem, 0, len(rows))
	for _, r := range rows {
		val := pickValue(r, picker.ValueField)
		if val == "" {
			continue
		}
		labels := make([]string, 0, len(labelFields))
		for _, lf := range labelFields {
			if lv := pickValue(r, lf); lv != "" {
				labels = append(labels, lv)
			}
		}
		out = append(out, PickerItem{
			Value: val,
			Label: strings.Join(labels, " · "),
			Raw:   r,
		})
	}

	pickerCacheMu.Lock()
	pickerCache[cacheKey] = out
	pickerCacheMu.Unlock()
	return out, nil
}
