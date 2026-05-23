package tui

import (
	"fmt"
	"strings"

	tea "github.com/charmbracelet/bubbletea"
)

type formAction int

const (
	formNone formAction = iota
	formSubmit
	formBack
)

type formView struct {
	title  string
	fields []Field
	vals   []string
	focus  int
	err    string
}

func newFormView(fields []Field, title string) *formView {
	return &formView{
		title:  title,
		fields: fields,
		vals:   make([]string, len(fields)),
		focus:  0,
	}
}

func (f *formView) values() map[string]string {
	out := make(map[string]string, len(f.fields))
	for i, fld := range f.fields {
		out[fld.Name] = f.vals[i]
	}
	return out
}

func (f *formView) submitIndex() int { return len(f.fields) }

func (f *formView) update(msg tea.Msg) (formAction, tea.Cmd) {
	key, ok := msg.(tea.KeyMsg)
	if !ok {
		return formNone, nil
	}
	s := key.String()

	switch s {
	case "esc":
		return formBack, nil
	case "tab", "down":
		f.focus++
		if f.focus > f.submitIndex() {
			f.focus = 0
		}
		return formNone, nil
	case "shift+tab", "up":
		f.focus--
		if f.focus < 0 {
			f.focus = f.submitIndex()
		}
		return formNone, nil
	}

	if f.focus == f.submitIndex() {
		if s == "enter" {
			var missing []string
			for i, fld := range f.fields {
				if fld.Required && strings.TrimSpace(f.vals[i]) == "" {
					missing = append(missing, fld.Name)
				}
			}
			if len(missing) > 0 {
				f.err = "Missing required: " + strings.Join(missing, ", ")
				return formNone, nil
			}
			return formSubmit, nil
		}
		return formNone, nil
	}

	fld := f.fields[f.focus]

	if len(fld.Enum) > 0 {
		if s == "left" || s == "right" {
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
		}
		return formNone, nil
	}

	if fld.Type == FieldTypeBoolean {
		if s == "left" || s == "right" || s == " " {
			if f.vals[f.focus] == "true" {
				f.vals[f.focus] = "false"
			} else {
				f.vals[f.focus] = "true"
			}
		}
		return formNone, nil
	}

	switch s {
	case "backspace":
		if len(f.vals[f.focus]) > 0 {
			f.vals[f.focus] = f.vals[f.focus][:len(f.vals[f.focus])-1]
		}
	case "enter":
		f.focus++
		if f.focus > f.submitIndex() {
			f.focus = f.submitIndex()
		}
	default:
		if !key.Alt && len(key.Runes) > 0 {
			f.vals[f.focus] += string(key.Runes)
		}
	}
	return formNone, nil
}

func (f *formView) view() string {
	var sb strings.Builder
	sb.WriteString(StyleSection.Render(f.title))
	sb.WriteString("\n\n")
	if len(f.fields) == 0 {
		sb.WriteString(StyleDim.Render("(no parameters)"))
		sb.WriteString("\n\n")
	}
	for i, fld := range f.fields {
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
		var display string
		if len(fld.Enum) > 0 {
			if v == "" {
				display = StyleDim.Render("<" + strings.Join(fld.Enum, "|") + ">")
			} else {
				display = v
			}
		} else if fld.Type == FieldTypeBoolean {
			if v == "" {
				display = StyleDim.Render("false")
			} else {
				display = v
			}
		} else if v == "" {
			display = StyleDim.Render("(empty)")
		} else {
			display = v
		}
		cursor := ""
		if i == f.focus {
			cursor = "▎"
		}
		sb.WriteString("    ")
		sb.WriteString(display)
		sb.WriteString(cursor)
		sb.WriteString("\n\n")
	}

	submitLabel := "  [ Submit ]"
	if f.focus == f.submitIndex() {
		submitLabel = StyleSuccess.Render("› [ Submit ]")
	}
	sb.WriteString(submitLabel)
	sb.WriteString("\n")

	if f.err != "" {
		sb.WriteString("\n")
		sb.WriteString(StyleError.Render(f.err))
		sb.WriteString("\n")
	}
	sb.WriteString("\n")
	sb.WriteString(StyleDim.Render("Tab/↓ next · Shift-Tab/↑ prev · ←/→ toggle enum/bool · Enter submit · Esc back"))
	return sb.String()
}
