package tui

import (
	"fmt"
	"strings"

	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/lipgloss"
)

type formAction int

const (
	formNone formAction = iota
	formSubmit
	formBack
)

type formView struct {
	title      string
	fields     []Field
	vals       []string
	focus      int
	err        string
	termHeight int
	termWidth  int
	picker     *pickerView
	fetcher    PickerFetcher
}

func newFormView(fields []Field, title string, prefills map[string]string) *formView {
	vals := make([]string, len(fields))
	for i, fld := range fields {
		if fld.Secret {
			if v, ok := prefills[fld.Name]; ok && v != "" {
				vals[i] = v
			}
		}
	}
	return &formView{
		title:      title,
		fields:     fields,
		vals:       vals,
		focus:      0,
		termHeight: 30,
		termWidth:  80,
	}
}

func (f *formView) setFetcher(fn PickerFetcher) {
	f.fetcher = fn
}

func (f *formView) setWidth(w int) {
	if w > 0 {
		f.termWidth = w
	}
	if f.picker != nil {
		f.picker.setSize(f.termWidth, f.termHeight)
	}
}

func (f *formView) setHeight(h int) {
	if h > 0 {
		f.termHeight = h
	}
	if f.picker != nil {
		f.picker.setSize(f.termWidth, f.termHeight)
	}
}

func fieldRowHeight(fld Field) int {
	// label (1) + description (0 or 1) + bordered input (3) + blank (1)
	h := 1 + 3 + 1
	if fld.Description != "" {
		h++
	}
	return h
}

func (f *formView) values() map[string]string {
	out := make(map[string]string, len(f.fields))
	for i, fld := range f.fields {
		out[fld.Name] = f.vals[i]
	}
	return out
}

func (f *formView) lastIndex() int {
	if len(f.fields) == 0 {
		return 0
	}
	return len(f.fields) - 1
}

func (f *formView) trySubmit() formAction {
	var missing []string
	for i, fld := range f.fields {
		if fld.Required && strings.TrimSpace(f.vals[i]) == "" {
			missing = append(missing, fld.Name)
		}
	}
	if len(missing) > 0 {
		f.err = "Missing required: " + strings.Join(missing, ", ")
		return formNone
	}
	return formSubmit
}

// nextUnfilledRequired returns the index of the next required field (after `from`,
// wrapping) whose value is empty, or -1 if no required field is unfilled.
func (f *formView) nextUnfilledRequired() int {
	n := len(f.fields)
	for step := 1; step <= n; step++ {
		i := (f.focus + step) % n
		if f.fields[i].Required && strings.TrimSpace(f.vals[i]) == "" {
			return i
		}
	}
	return -1
}

// handleEnter advances focus to the next unfilled required field, or submits if
// all required fields are filled.
func (f *formView) handleEnter() formAction {
	next := f.nextUnfilledRequired()
	if next == -1 {
		return f.trySubmit()
	}
	f.focus = next
	return formNone
}

func (f *formView) update(msg tea.Msg) (formAction, tea.Cmd) {
	// If picker is open, route msg to picker first
	if f.picker != nil {
		action, cmd := f.picker.update(msg)
		switch action {
		case pickerSelect:
			val := f.picker.selectedValue()
			f.vals[f.focus] = val
			f.picker = nil
			if f.focus < len(f.fields)-1 {
				f.focus++
			}
		case pickerCancel:
			f.picker = nil
		}
		return formNone, cmd
	}

	key, ok := msg.(tea.KeyMsg)
	if !ok {
		return formNone, nil
	}
	s := key.String()

	if s == "esc" {
		return formBack, nil
	}

	// Ctrl+S submits from anywhere
	if s == "ctrl+s" {
		return f.trySubmit(), nil
	}

	switch s {
	case "tab", "down":
		f.focus++
		if f.focus >= len(f.fields) {
			f.focus = 0
		}
		return formNone, nil
	case "shift+tab", "up":
		f.focus--
		if f.focus < 0 {
			f.focus = len(f.fields) - 1
		}
		return formNone, nil
	}

	fld := f.fields[f.focus]

	// Picker: Enter or space opens the overlay
	if fld.Picker != nil && (s == "enter" || s == " ") && f.fetcher != nil {
		filters := map[string]string{}
		for _, k := range fld.Picker.FilterBy {
			for i, sib := range f.fields {
				if sib.Name == k && f.vals[i] != "" {
					filters[k] = f.vals[i]
				}
			}
		}
		pv := newPickerView(fld.Picker, fld.Label, filters)
		pv.setSize(f.termWidth, f.termHeight)
		f.picker = pv
		// Dispatch async fetch
		fetcher := f.fetcher
		picker := fld.Picker
		return formNone, func() tea.Msg {
			items, err := FetchPickerItems(picker, fetcher, filters)
			return pickerLoadedMsg{items: items, err: err}
		}
	}

	if len(fld.Enum) > 0 {
		switch s {
		case "left", "right":
			cur := f.vals[f.focus]
			idx := -1
			for i, e := range fld.Enum {
				if e == cur {
					idx = i
					break
				}
			}
			if s == "right" {
				idx = (idx + 1 + len(fld.Enum)) % len(fld.Enum)
			} else {
				idx = (idx - 1 + len(fld.Enum)) % len(fld.Enum)
			}
			f.vals[f.focus] = fld.Enum[idx]
		case "enter":
			return f.handleEnter(), nil
		}
		return formNone, nil
	}

	if fld.Type == FieldTypeBoolean {
		switch s {
		case "left", "right", " ":
			if f.vals[f.focus] == "true" {
				f.vals[f.focus] = "false"
			} else {
				f.vals[f.focus] = "true"
			}
		case "enter":
			return f.handleEnter(), nil
		}
		return formNone, nil
	}

	switch s {
	case "backspace":
		if len(f.vals[f.focus]) > 0 {
			f.vals[f.focus] = f.vals[f.focus][:len(f.vals[f.focus])-1]
		}
	case "enter":
		return f.handleEnter(), nil
	default:
		if !key.Alt && len(key.Runes) > 0 {
			f.vals[f.focus] += string(key.Runes)
		}
	}
	return formNone, nil
}

func (f *formView) view() string {
	// If picker is open, render the overlay alone
	if f.picker != nil {
		var sb strings.Builder
		sb.WriteString(StyleSection.Render(f.title))
		sb.WriteString("\n\n")
		sb.WriteString(f.picker.view())
		return sb.String()
	}

	var sb strings.Builder

	// Compute visible window of fields around `f.focus`, fitting `available` rows.
	// Reserve rows for: logo (~5), title (2), hint bar (3), error (1), margin.
	reserved := 12
	available := f.termHeight - reserved
	if available < 8 {
		available = 8
	}
	heights := make([]int, len(f.fields))
	for i, fld := range f.fields {
		heights[i] = fieldRowHeight(fld)
	}
	start, end := f.focus, f.focus+1
	used := 0
	if f.focus >= 0 && f.focus < len(heights) {
		used = heights[f.focus]
	}
	for start > 0 || end < len(f.fields) {
		canUp := start > 0 && used+heights[start-1] <= available
		canDown := end < len(f.fields) && used+heights[end] <= available
		if !canUp && !canDown {
			break
		}
		if canDown {
			used += heights[end]
			end++
		} else if canUp {
			start--
			used += heights[start]
		}
	}
	hiddenAbove := start
	hiddenBelow := len(f.fields) - end

	sb.WriteString(StyleSection.Render(f.title))
	if hiddenAbove > 0 || hiddenBelow > 0 {
		sb.WriteString(StyleDim.Render(fmt.Sprintf("  (fields %d-%d of %d)", start+1, end, len(f.fields))))
	}
	sb.WriteString("\n\n")
	if hiddenAbove > 0 {
		sb.WriteString(StyleDim.Render(fmt.Sprintf("  ↑ %d more above", hiddenAbove)))
		sb.WriteString("\n")
	}
	for i := start; i < end; i++ {
		fld := f.fields[i]
		marker := "  "
		label := fld.Label
		if i == f.focus {
			marker = "› "
			label = StyleSelected.Render(label)
		}
		req := ""
		if fld.Required {
			req = StyleRequired.Render("*")
		}
		typeTag := fmt.Sprintf(" [%s/%s]", fld.Type, fld.Location)
		sb.WriteString(marker)
		sb.WriteString(label)
		sb.WriteString(req)
		sb.WriteString(StyleDim.Render(typeTag))
		sb.WriteString("\n")
		if fld.Description != "" {
			sb.WriteString("    ")
			sb.WriteString(StyleDim.Render(fld.Description))
			sb.WriteString("\n")
		}

		v := f.vals[i]
		focused := i == f.focus

		displayV := v
		if f.fields[i].Secret && v != "" {
			displayV = strings.Repeat("•", len([]rune(v)))
		}

		var placeholder string
		switch {
		case fld.Picker != nil:
			placeholder = "<" + strings.ToLower(fld.Name) + ">  (Enter to pick)"
		case len(fld.Enum) > 0:
			placeholder = strings.Join(fld.Enum, " / ") + "  (← →)"
		case fld.Type == FieldTypeBoolean:
			placeholder = "false  (← → / space)"
		case fld.Type == FieldTypeNumber:
			placeholder = "<" + strings.ToLower(fld.Name) + ">  (number)"
		case fld.Type == FieldTypeFile:
			placeholder = "<path/to/file>"
		default:
			placeholder = "<" + strings.ToLower(fld.Name) + ">"
		}

		var inner string
		if displayV == "" {
			inner = StyleDim.Render(placeholder)
		} else {
			inner = displayV
		}
		if focused {
			inner += lipgloss.NewStyle().Foreground(lipgloss.Color("14")).Render("▎")
		}

		boxBorder := lipgloss.Color("240")
		if focused {
			boxBorder = lipgloss.Color("14")
		}
		box := lipgloss.NewStyle().
			Border(lipgloss.RoundedBorder()).
			BorderForeground(boxBorder).
			Padding(0, 1).
			Width(40).
			Render(inner)
		// Indent the box by 4 spaces
		for _, line := range strings.Split(box, "\n") {
			sb.WriteString("    ")
			sb.WriteString(line)
			sb.WriteString("\n")
		}
		sb.WriteString("\n")
	}
	if hiddenBelow > 0 {
		sb.WriteString(StyleDim.Render(fmt.Sprintf("  ↓ %d more below", hiddenBelow)))
		sb.WriteString("\n")
	}

	if f.err != "" {
		sb.WriteString("\n")
		sb.WriteString(StyleError.Render(f.err))
		sb.WriteString("\n")
	}
	sb.WriteString("\n")
	sb.WriteString(StyleDim.Render("Tab/↓ next · Shift-Tab/↑ prev · ←/→ toggle enum/bool · Enter next-required/run · Ctrl-S run from anywhere · Esc back"))
	return sb.String()
}
