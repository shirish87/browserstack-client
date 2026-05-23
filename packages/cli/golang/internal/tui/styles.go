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
	if !isColorTTY() {
		title := "BrowserStack CLI"
		if version != "" {
			title += "  v" + version
		}
		return title + "\n" + strings.Repeat("━", 40)
	}
	rightLines := []string{
		"", "", "", "",
		StyleTitle.Render("BrowserStack CLI"),
	}
	if version != "" {
		rightLines = append(rightLines, StyleDim.Render("v"+version))
	}
	right := strings.Join(rightLines, "\n")
	combined := lipgloss.JoinHorizontal(lipgloss.Top, LogoANSI, "  ", right)
	// Add top/left/bottom margin
	return "\n  " + strings.ReplaceAll(combined, "\n", "\n  ") + "\n"
}
