package tui

import "github.com/charmbracelet/lipgloss"

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

func Logo(version string) string {
	title := StyleTitle.Render("BrowserStack CLI")
	ver := ""
	if version != "" {
		ver = "\n" + StyleDim.Render("v"+version)
	}
	rule := "\n" + StyleDim.Render("─────────────────────────")
	return title + ver + rule
}
