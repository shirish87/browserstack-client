package tui

import (
	"fmt"
	"strings"

	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/lipgloss"
	"github.com/sahilm/fuzzy"
)

type pickerAction int

const (
	pickerNone pickerAction = iota
	pickerSelect
	pickerCancel
)

type pickerLoadedMsg struct {
	items []PickerItem
	err   error
}

type pickerView struct {
	picker     *PickerConfig
	fieldLabel string
	filters    map[string]string
	items      []PickerItem
	loaded     bool
	loadErr    error
	query      string
	index      int
	width      int
	height     int
}

func newPickerView(picker *PickerConfig, fieldLabel string, filters map[string]string) *pickerView {
	return &pickerView{
		picker:     picker,
		fieldLabel: fieldLabel,
		filters:    filters,
		width:      80,
		height:    20,
	}
}

func (p *pickerView) setSize(w, h int) {
	p.width = w
	if h > 0 {
		p.height = h
	}
}

func (p *pickerView) filtered() []PickerItem {
	if !p.loaded {
		return nil
	}
	if strings.TrimSpace(p.query) == "" {
		return p.items
	}
	labels := make([]string, len(p.items))
	for i, it := range p.items {
		labels[i] = it.Label
	}
	matches := fuzzy.Find(p.query, labels)
	out := make([]PickerItem, 0, len(matches))
	for _, m := range matches {
		out = append(out, p.items[m.Index])
	}
	return out
}

func (p *pickerView) update(msg tea.Msg) (pickerAction, tea.Cmd) {
	switch msg := msg.(type) {
	case pickerLoadedMsg:
		p.items = msg.items
		p.loadErr = msg.err
		p.loaded = true
		return pickerNone, nil
	case tea.KeyMsg:
		s := msg.String()
		switch s {
		case "esc":
			return pickerCancel, nil
		case "enter":
			if p.loaded {
				items := p.filtered()
				if p.index >= 0 && p.index < len(items) {
					return pickerSelect, nil
				}
			}
		case "up", "ctrl+p":
			if p.index > 0 {
				p.index--
			}
		case "down", "ctrl+n":
			items := p.filtered()
			if p.index < len(items)-1 {
				p.index++
			}
		case "pgup":
			p.index -= 10
			if p.index < 0 {
				p.index = 0
			}
		case "pgdown":
			items := p.filtered()
			p.index += 10
			if p.index >= len(items) {
				p.index = len(items) - 1
			}
		case "backspace":
			if len(p.query) > 0 {
				p.query = p.query[:len(p.query)-1]
				p.index = 0
			}
		default:
			if !msg.Alt && len(msg.Runes) > 0 {
				p.query += string(msg.Runes)
				p.index = 0
			}
		}
	}
	return pickerNone, nil
}

func (p *pickerView) selectedValue() string {
	items := p.filtered()
	if p.index >= 0 && p.index < len(items) {
		return items[p.index].Value
	}
	return ""
}

func (p *pickerView) view() string {
	items := p.filtered()
	var sb strings.Builder
	sb.WriteString(StyleSection.Render(fmt.Sprintf("Pick %s", p.fieldLabel)))
	if p.loaded {
		sb.WriteString(StyleDim.Render(fmt.Sprintf("  (%d of %d)", len(items), len(p.items))))
	}
	sb.WriteString("\n")
	sb.WriteString(StyleDim.Render("> "))
	sb.WriteString(p.query)
	sb.WriteString(lipgloss.NewStyle().Foreground(lipgloss.Color("14")).Render("▎"))
	sb.WriteString("\n\n")
	if !p.loaded {
		sb.WriteString(StyleDim.Render("Loading…"))
	} else if p.loadErr != nil && len(items) == 0 {
		sb.WriteString(StyleError.Render(p.loadErr.Error()))
	} else if len(items) == 0 {
		sb.WriteString(StyleDim.Render("No matches."))
	} else {
		visibleN := p.height - 12
		if visibleN < 5 {
			visibleN = 5
		}
		start := p.index - visibleN/2
		if start < 0 {
			start = 0
		}
		if start+visibleN > len(items) {
			start = len(items) - visibleN
			if start < 0 {
				start = 0
			}
		}
		end := start + visibleN
		if end > len(items) {
			end = len(items)
		}
		for i := start; i < end; i++ {
			marker := "  "
			line := items[i].Label
			if i == p.index {
				marker = "› "
				line = StyleSelected.Render(line)
			}
			sb.WriteString(marker)
			sb.WriteString(line)
			sb.WriteString("\n")
		}
	}
	sb.WriteString("\n")
	sb.WriteString(StyleDim.Render("Type to filter · ↑/↓ navigate · Enter select · Esc cancel"))
	return StyleBorder.BorderForeground(lipgloss.Color("14")).Width(p.width-4).Render(sb.String())
}
