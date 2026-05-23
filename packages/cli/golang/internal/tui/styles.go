package tui

import (
	"os"
	"strings"

	"github.com/charmbracelet/lipgloss"
)

var (
	StyleTitle    = lipgloss.NewStyle().Bold(true).Foreground(lipgloss.Color("#E84D38"))
	StyleSection  = lipgloss.NewStyle().Bold(true)
	StyleDim      = lipgloss.NewStyle().Foreground(lipgloss.Color("240"))
	StyleSelected = lipgloss.NewStyle().Foreground(lipgloss.Color("14"))
	StyleSuccess  = lipgloss.NewStyle().Foreground(lipgloss.Color("10")).Bold(true)
	StyleError    = lipgloss.NewStyle().Foreground(lipgloss.Color("9"))
	StyleRequired = lipgloss.NewStyle().Foreground(lipgloss.Color("9"))
	StyleBorder   = lipgloss.NewStyle().Border(lipgloss.RoundedBorder()).BorderForeground(lipgloss.Color("240")).Padding(0, 1)
)

func isColorTTY() bool {
	if os.Getenv("NO_COLOR") != "" {
		return false
	}
	if os.Getenv("TERM") == "dumb" {
		return false
	}
	return true
}

// StripBrand removes the leading "BrowserStack " prefix and any trailing parenthetical from a label.
func StripBrand(s string) string {
	s = strings.TrimPrefix(s, "BrowserStack ")
	if i := strings.LastIndex(s, "("); i > 0 {
		if strings.HasSuffix(strings.TrimSpace(s), ")") {
			s = strings.TrimSpace(s[:i])
		}
	}
	return s
}

func Logo(version string) string {
	var sb strings.Builder
	if isColorTTY() {
		sb.WriteString(StyleTitle.Render(LogoANSI))
		if version != "" {
			sb.WriteString(StyleDim.Render("  v" + version))
		}
	} else {
		sb.WriteString(LogoANSI)
		if version != "" {
			sb.WriteString("  v" + version)
		}
	}
	return sb.String()
}
