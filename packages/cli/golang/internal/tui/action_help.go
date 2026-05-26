package tui

import (
	"encoding/json"
	"fmt"
	"strings"
)

// ActionHelp returns a formatted help string for a specific action, or an empty
// string if the product or action is not found in the manifest.
func ActionHelp(productID, actionID string) string {
	for _, prod := range Manifest {
		if prod.ID != productID {
			continue
		}
		for _, res := range prod.Resources {
			for _, act := range res.Actions {
				if act.ID != actionID {
					continue
				}
				return formatActionHelp(productID, act)
			}
		}
	}
	return ""
}

func formatActionHelp(productID string, act Action) string {
	var b strings.Builder

	pathQuery := make([]Field, 0)
	body := make([]Field, 0)
	for _, f := range act.Fields {
		switch f.Location {
		case LocationPath, LocationQuery:
			pathQuery = append(pathQuery, f)
		case LocationBody:
			body = append(body, f)
		}
	}

	// Usage line
	b.WriteString(fmt.Sprintf("Usage: %s %s", productID, act.ID))
	for _, f := range pathQuery {
		if f.Required {
			b.WriteString(fmt.Sprintf(" <%s>", f.Name))
		} else {
			b.WriteString(fmt.Sprintf(" [%s]", f.Name))
		}
	}
	if len(body) > 0 {
		b.WriteString(" [body]")
	}
	b.WriteString("\n")

	// Description
	desc := act.Description
	if desc == "" {
		desc = act.Summary
	}
	if desc != "" {
		b.WriteString("\n")
		b.WriteString(desc)
		b.WriteString("\n")
	}

	// Path/query arguments table
	if len(pathQuery) > 0 {
		b.WriteString("\nArguments:\n")
		maxLen := 0
		for _, f := range pathQuery {
			if n := len(f.Name) + 2; n > maxLen {
				maxLen = n
			}
		}
		for _, f := range pathQuery {
			var placeholder string
			if f.Required {
				placeholder = fmt.Sprintf("<%s>", f.Name)
			} else {
				placeholder = fmt.Sprintf("[%s]", f.Name)
			}
			padding := strings.Repeat(" ", maxLen-len(placeholder)+2)
			fdesc := f.Description
			if len(f.Enum) > 0 {
				fdesc += fmt.Sprintf(" (%s)", strings.Join(f.Enum, "|"))
			}
			b.WriteString(fmt.Sprintf("  %s%s%s\n", placeholder, padding, fdesc))
		}
	}

	// Body JSON sample
	if len(body) > 0 {
		sample := buildBodySample(body)
		if sample != nil {
			var buf strings.Builder
			enc := json.NewEncoder(&buf)
			enc.SetIndent("", "  ")
			enc.SetEscapeHTML(false)
			if err := enc.Encode(sample); err == nil {
				b.WriteString("\nBody (JSON):\n")
				b.WriteString(strings.TrimRight(buf.String(), "\n"))
				b.WriteString("\n")
			}
		}
	}

	return strings.TrimRight(b.String(), "\n")
}

// buildBodySample constructs a representative JSON object from body fields.
// Dot-separated field names (e.g. "test_run.name") are nested into objects.
func buildBodySample(fields []Field) map[string]any {
	root := map[string]any{}
	for _, f := range fields {
		if f.Type == "file" {
			continue
		}
		val := fieldSampleValue(f)
		parts := strings.Split(f.Name, ".")
		cur := root
		for i, part := range parts {
			if i == len(parts)-1 {
				cur[part] = val
			} else {
				if _, ok := cur[part]; !ok {
					cur[part] = map[string]any{}
				}
				if m, ok := cur[part].(map[string]any); ok {
					cur = m
				}
			}
		}
	}
	if len(root) == 0 {
		return nil
	}
	return root
}

func fieldSampleValue(f Field) any {
	// Array-of-object fields: wrap the item sample in a one-element array.
	if f.ItemSample != "" {
		var item any
		if err := json.Unmarshal([]byte(f.ItemSample), &item); err == nil {
			return []any{item}
		}
	}
	if len(f.Enum) > 0 {
		return f.Enum[0]
	}
	switch f.Type {
	case "number":
		return 0
	case "boolean":
		return true
	default:
		parts := strings.Split(f.Name, ".")
		return "<" + parts[len(parts)-1] + ">"
	}
}
