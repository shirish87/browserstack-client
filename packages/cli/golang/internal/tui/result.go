package tui

import (
	"fmt"
	"strings"

	tea "github.com/charmbracelet/bubbletea"
)

type resultAction int

const (
	resultNone resultAction = iota
	resultBack
)

type resultView struct {
	output string
	err    string
	lines  []string
	scroll int
	width  int
	height int
}

func newResultView(output, errMsg string) *resultView {
	text := output
	if errMsg != "" {
		text = errMsg
	}
	if text == "" {
		text = "(no output)"
	}
	return &resultView{
		output: output,
		err:    errMsg,
		lines:  strings.Split(text, "\n"),
		height: 20,
		width:  80,
	}
}

func (r *resultView) setSize(w, h int) {
	r.width = w
	if h < 5 {
		h = 5
	}
	r.height = h
}

func (r *resultView) maxScroll() int {
	if len(r.lines) <= r.height {
		return 0
	}
	return len(r.lines) - r.height
}

func (r *resultView) update(msg tea.Msg) (resultAction, tea.Cmd) {
	key, ok := msg.(tea.KeyMsg)
	if !ok {
		return resultNone, nil
	}
	switch key.String() {
	case "esc", "enter":
		return resultBack, nil
	case "up", "k":
		if r.scroll > 0 {
			r.scroll--
		}
	case "down", "j":
		if r.scroll < r.maxScroll() {
			r.scroll++
		}
	case "pgup":
		r.scroll -= r.height
		if r.scroll < 0 {
			r.scroll = 0
		}
	case "pgdown":
		r.scroll += r.height
		if r.scroll > r.maxScroll() {
			r.scroll = r.maxScroll()
		}
	}
	return resultNone, nil
}

func (r *resultView) view() string {
	var sb strings.Builder
	if r.err != "" {
		sb.WriteString(StyleError.Render("✗ Error"))
	} else {
		sb.WriteString(StyleSuccess.Render("✓ Result"))
	}
	if len(r.lines) > r.height {
		end := r.scroll + r.height
		if end > len(r.lines) {
			end = len(r.lines)
		}
		sb.WriteString(StyleDim.Render(fmt.Sprintf("  (%d-%d / %d)", r.scroll+1, end, len(r.lines))))
	}
	sb.WriteString("\n")

	end := r.scroll + r.height
	if end > len(r.lines) {
		end = len(r.lines)
	}
	visible := strings.Join(r.lines[r.scroll:end], "\n")
	if r.err != "" {
		visible = StyleError.Render(visible)
	}
	sb.WriteString(StyleBorder.Render(visible))
	sb.WriteString("\n\n")
	sb.WriteString(StyleDim.Render("↑/↓ scroll · PgUp/PgDn page · Enter/Esc back"))
	return sb.String()
}
