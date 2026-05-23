package tui

import (
	"strings"

	tea "github.com/charmbracelet/bubbletea"
)

type listItem struct {
	id          string
	label       string
	description string
}

type listAction int

const (
	listNone listAction = iota
	listSelect
	listBack
)

type listView struct {
	title string
	items []listItem
	index int
}

func newListView(title string, items []listItem) *listView {
	return &listView{title: title, items: items, index: 0}
}

func (l *listView) selected() listItem {
	if l.index < 0 || l.index >= len(l.items) {
		return listItem{}
	}
	return l.items[l.index]
}

func (l *listView) update(msg tea.Msg) (listAction, tea.Cmd) {
	key, ok := msg.(tea.KeyMsg)
	if !ok {
		return listNone, nil
	}
	switch key.String() {
	case "up", "k":
		l.index--
		if l.index < 0 {
			l.index = len(l.items) - 1
		}
	case "down", "j":
		l.index++
		if l.index >= len(l.items) {
			l.index = 0
		}
	case "enter":
		return listSelect, nil
	case "esc":
		return listBack, nil
	}
	return listNone, nil
}

func (l *listView) view() string {
	var sb strings.Builder
	sb.WriteString(StyleSection.Render(l.title))
	sb.WriteString("\n\n")
	for i, item := range l.items {
		marker := "  "
		line := item.label
		if i == l.index {
			marker = "› "
			line = StyleSelected.Render(line)
		}
		sb.WriteString(marker)
		sb.WriteString(line)
		sb.WriteString("\n")
	}
	sb.WriteString("\n")
	sb.WriteString(StyleDim.Render("↑/↓ navigate · Enter select · Esc back · Ctrl-C quit"))
	return sb.String()
}
