package tui

import (
	"fmt"
	"strings"

	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/lipgloss"
	"github.com/sahilm/fuzzy"
)

type listItem struct {
	id          string
	label       string
	description string
	header      bool // non-selectable section header
}

type listAction int

const (
	listNone listAction = iota
	listSelect
	listBack
)

type listView struct {
	title      string
	items      []listItem
	index      int
	termHeight int
	query      string
	filtering  bool
}

func (l *listView) setHeight(h int) {
	if h > 0 {
		l.termHeight = h
	}
}

// filteredItems returns the items visible under the current query, preserving
// section headers that have at least one matching child.
func (l *listView) filteredItems() []listItem {
	q := strings.TrimSpace(l.query)
	if q == "" {
		return l.items
	}
	// Build labels for selectable items
	var selectable []listItem
	var origIdx []int
	for i, it := range l.items {
		if !it.header {
			selectable = append(selectable, it)
			origIdx = append(origIdx, i)
		}
	}
	labels := make([]string, len(selectable))
	for i, it := range selectable {
		labels[i] = it.label
	}
	matches := fuzzy.Find(q, labels)
	matched := map[string]bool{}
	for _, m := range matches {
		matched[selectable[m.Index].id] = true
	}
	out := make([]listItem, 0, len(matches))
	var lastHeader *listItem
	headerEmitted := false
	for _, it := range l.items {
		if it.header {
			tmp := it
			lastHeader = &tmp
			headerEmitted = false
			continue
		}
		if !matched[it.id] {
			continue
		}
		if lastHeader != nil && !headerEmitted {
			out = append(out, *lastHeader)
			headerEmitted = true
		}
		out = append(out, it)
	}
	return out
}

func nextSelectableIn(items []listItem, from, dir int) int {
	n := len(items)
	if n == 0 {
		return -1
	}
	i := from
	for k := 0; k < n; k++ {
		i = ((i + dir) % n + n) % n
		if !items[i].header {
			return i
		}
	}
	return from
}

func newListView(title string, items []listItem) *listView {
	idx := 0
	for i, it := range items {
		if !it.header {
			idx = i
			break
		}
	}
	return &listView{title: title, items: items, index: idx, termHeight: 30}
}

func (l *listView) firstSelectableAfter(from, dir int) int {
	n := len(l.items)
	if n == 0 {
		return -1
	}
	i := from
	for k := 0; k < n; k++ {
		i = ((i + dir) % n + n) % n
		if !l.items[i].header {
			return i
		}
	}
	return from
}

func (l *listView) selected() listItem {
	filtered := l.filteredItems()
	if l.index < 0 || l.index >= len(filtered) {
		return listItem{}
	}
	return filtered[l.index]
}

func (l *listView) update(msg tea.Msg) (listAction, tea.Cmd) {
	key, ok := msg.(tea.KeyMsg)
	if !ok {
		return listNone, nil
	}
	s := key.String()

	// Esc: exit filter mode if active, else go back
	if s == "esc" {
		if l.filtering || l.query != "" {
			l.filtering = false
			l.query = ""
			l.index = 0
			for i, it := range l.items {
				if !it.header {
					l.index = i
					break
				}
			}
			return listNone, nil
		}
		return listBack, nil
	}

	filtered := l.filteredItems()
	if l.index >= len(filtered) {
		l.index = len(filtered) - 1
	}
	if l.index < 0 {
		l.index = 0
	}

	switch s {
	case "up", "k":
		l.index = nextSelectableIn(filtered, l.index, -1)
		return listNone, nil
	case "down", "j":
		l.index = nextSelectableIn(filtered, l.index, 1)
		return listNone, nil
	case "pgup":
		for k := 0; k < 10; k++ {
			l.index = nextSelectableIn(filtered, l.index, -1)
		}
		return listNone, nil
	case "pgdown":
		for k := 0; k < 10; k++ {
			l.index = nextSelectableIn(filtered, l.index, 1)
		}
		return listNone, nil
	case "enter":
		if l.index >= 0 && l.index < len(filtered) && !filtered[l.index].header {
			// Map filtered selection back to the actual item via id (already same item)
			// Caller uses l.selected() which now needs to return from filtered list.
			return listSelect, nil
		}
		return listNone, nil
	case "backspace":
		if len(l.query) > 0 {
			l.query = l.query[:len(l.query)-1]
			if l.query == "" {
				l.filtering = false
			}
			l.index = 0
		}
		return listNone, nil
	}

	// Filter input
	if !l.filtering && s == "/" {
		l.filtering = true
		return listNone, nil
	}
	if l.filtering {
		if !key.Alt && len(key.Runes) > 0 {
			l.query += string(key.Runes)
			l.index = 0
		}
		return listNone, nil
	}
	// Quick-start filter: any alphanumeric begins filtering
	if len(key.Runes) == 1 {
		r := key.Runes[0]
		if (r >= 'a' && r <= 'z') || (r >= 'A' && r <= 'Z') || (r >= '0' && r <= '9') || r == '_' || r == '-' {
			l.filtering = true
			l.query = string(r)
			l.index = 0
		}
	}
	return listNone, nil
}

func rowHeightOf(items []listItem, i int) int {
	if i < 0 || i >= len(items) {
		return 0
	}
	if items[i].header {
		if i == 0 {
			return 1
		}
		return 2
	}
	return 1
}

func (l *listView) view() string {
	filtered := l.filteredItems()
	totalSelectable := 0
	for _, it := range l.items {
		if !it.header {
			totalSelectable++
		}
	}
	matchedSelectable := 0
	for _, it := range filtered {
		if !it.header {
			matchedSelectable++
		}
	}

	// Compute window around l.index, alternating up/down to keep focus centered.
	reserve := 12
	if l.filtering || l.query != "" {
		reserve = 14
	}
	available := l.termHeight - reserve
	if available < 5 {
		available = 5
	}
	if l.index >= len(filtered) {
		l.index = len(filtered) - 1
	}
	if l.index < 0 {
		l.index = 0
	}
	lo, hi := l.index, l.index+1
	used := rowHeightOf(filtered, l.index)
	preferDown := true
	for lo > 0 || hi < len(filtered) {
		canUp := lo > 0 && used+rowHeightOf(filtered, lo-1) <= available
		canDown := hi < len(filtered) && used+rowHeightOf(filtered, hi) <= available
		if !canUp && !canDown {
			break
		}
		if preferDown && canDown {
			used += rowHeightOf(filtered, hi)
			hi++
		} else if canUp {
			lo--
			used += rowHeightOf(filtered, lo)
		} else if canDown {
			used += rowHeightOf(filtered, hi)
			hi++
		} else {
			break
		}
		preferDown = !preferDown
	}
	hiddenAbove := lo
	hiddenBelow := len(filtered) - hi

	var sb strings.Builder
	sb.WriteString(StyleSection.Render(l.title))
	if l.query != "" {
		sb.WriteString(StyleDim.Render(fmt.Sprintf("  (%d of %d match)", matchedSelectable, totalSelectable)))
	} else if hiddenAbove > 0 || hiddenBelow > 0 {
		sb.WriteString(StyleDim.Render(fmt.Sprintf("  (%d of %d)", hi-lo, len(filtered))))
	}
	sb.WriteString("\n")
	if l.filtering || l.query != "" {
		sb.WriteString("\n")
		sb.WriteString(StyleDim.Render("/ "))
		sb.WriteString(l.query)
		sb.WriteString(lipgloss.NewStyle().Foreground(lipgloss.Color("14")).Render("▎"))
		sb.WriteString("\n")
	}
	sb.WriteString("\n")
	if hiddenAbove > 0 {
		sb.WriteString(StyleDim.Render(fmt.Sprintf("  ↑ %d more above", hiddenAbove)))
		sb.WriteString("\n")
	}
	if len(filtered) == 0 {
		sb.WriteString(StyleDim.Render("  No matches."))
		sb.WriteString("\n")
		return sb.String()
	}
	for i := lo; i < hi; i++ {
		item := filtered[i]
		if item.header {
			if i > lo {
				sb.WriteString("\n")
			}
			sb.WriteString(lipgloss.NewStyle().Bold(true).Foreground(lipgloss.Color("240")).Render(item.label))
			sb.WriteString("\n")
			continue
		}
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
	if hiddenBelow > 0 {
		sb.WriteString(StyleDim.Render(fmt.Sprintf("  ↓ %d more below", hiddenBelow)))
		sb.WriteString("\n")
	}
	sb.WriteString("\n")
	if l.filtering || l.query != "" {
		sb.WriteString(StyleDim.Render("Type to filter · ↑/↓ navigate · Enter select · Esc clear"))
	} else {
		sb.WriteString(StyleDim.Render("↑/↓ navigate · PgUp/PgDn · / or type to filter · Enter select · Esc back · Ctrl-C quit"))
	}
	return sb.String()
}
