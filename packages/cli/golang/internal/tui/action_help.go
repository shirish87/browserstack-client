package tui

import (
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

	// Usage line
	b.WriteString(fmt.Sprintf("Usage: %s %s", productID, act.ID))
	for _, f := range act.Fields {
		if f.Location == LocationNone {
			continue
		}
		if f.Required {
			b.WriteString(fmt.Sprintf(" <%s>", f.Name))
		} else {
			b.WriteString(fmt.Sprintf(" [%s]", f.Name))
		}
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

	// Arguments
	visible := make([]Field, 0, len(act.Fields))
	for _, f := range act.Fields {
		if f.Location != LocationNone {
			visible = append(visible, f)
		}
	}
	if len(visible) > 0 {
		b.WriteString("\nArguments:\n")

		// Measure column width
		maxLen := 0
		for _, f := range visible {
			n := len(f.Name) + 2 // < > or [ ]
			if n > maxLen {
				maxLen = n
			}
		}

		for _, f := range visible {
			var placeholder string
			if f.Required {
				placeholder = fmt.Sprintf("<%s>", f.Name)
			} else {
				placeholder = fmt.Sprintf("[%s]", f.Name)
			}
			padding := strings.Repeat(" ", maxLen-len(placeholder)+2)
			desc := f.Description
			if len(f.Enum) > 0 {
				desc += fmt.Sprintf(" (%s)", strings.Join(f.Enum, "|"))
			}
			b.WriteString(fmt.Sprintf("  %s%s%s\n", placeholder, padding, desc))
		}
	}

	return strings.TrimRight(b.String(), "\n")
}
