package tui

import (
	"fmt"
	"strings"

	tea "github.com/charmbracelet/bubbletea"
)

type step int

const (
	stepProduct step = iota
	stepResource
	stepAction
	stepForm
	stepLoading
	stepResult
)

type Executor func(product *Product, action *Action, values map[string]string) (string, error)

type Model struct {
	step    step
	version string

	productList  *listView
	resourceList *listView
	actionList   *listView
	form         *formView
	result       *resultView

	product  *Product
	resource *Resource
	action   *Action

	executor Executor

	termWidth  int
	termHeight int

	loadingMsg string
	output     string
	err        string
}

type executedMsg struct {
	output string
	err    string
}

func NewModel(version string, executor Executor) *Model {
	items := make([]listItem, len(Manifest))
	for i, p := range Manifest {
		items[i] = listItem{id: p.ID, label: p.Title, description: p.Description}
	}
	return &Model{
		version:     version,
		step:        stepProduct,
		productList: newListView("Select a product", items),
		executor:    executor,
	}
}

func (m *Model) Init() tea.Cmd {
	return nil
}

func (m *Model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {
	case tea.WindowSizeMsg:
		m.termWidth = msg.Width
		m.termHeight = msg.Height
		if m.result != nil {
			m.result.setSize(msg.Width, msg.Height-8)
		}
		return m, nil

	case tea.KeyMsg:
		switch msg.String() {
		case "ctrl+c":
			return m, tea.Quit
		}

	case executedMsg:
		m.output = msg.output
		m.err = msg.err
		m.result = newResultView(m.output, m.err)
		if m.termWidth > 0 {
			m.result.setSize(m.termWidth, m.termHeight-8)
		}
		m.step = stepResult
		return m, nil
	}

	switch m.step {
	case stepProduct:
		return m.updateProductList(msg)
	case stepResource:
		return m.updateResourceList(msg)
	case stepAction:
		return m.updateActionList(msg)
	case stepForm:
		return m.updateForm(msg)
	case stepResult:
		return m.updateResult(msg)
	}
	return m, nil
}

func (m *Model) updateProductList(msg tea.Msg) (tea.Model, tea.Cmd) {
	if action, _ := m.productList.update(msg); action == listSelect {
		selected := m.productList.selected()
		for i := range Manifest {
			if Manifest[i].ID == selected.id {
				m.product = &Manifest[i]
				break
			}
		}
		if len(m.product.Resources) == 1 && m.product.Resources[0].ID == "default" {
			m.resource = &m.product.Resources[0]
			m.gotoAction()
		} else {
			m.gotoResource()
		}
	}
	return m, nil
}

func (m *Model) updateResourceList(msg tea.Msg) (tea.Model, tea.Cmd) {
	action, _ := m.resourceList.update(msg)
	switch action {
	case listSelect:
		selected := m.resourceList.selected()
		for i := range m.product.Resources {
			if m.product.Resources[i].ID == selected.id {
				m.resource = &m.product.Resources[i]
				break
			}
		}
		m.gotoAction()
	case listBack:
		m.product = nil
		m.step = stepProduct
	}
	return m, nil
}

func (m *Model) updateActionList(msg tea.Msg) (tea.Model, tea.Cmd) {
	action, _ := m.actionList.update(msg)
	switch action {
	case listSelect:
		selected := m.actionList.selected()
		for i := range m.resource.Actions {
			if m.resource.Actions[i].ID == selected.id {
				m.action = &m.resource.Actions[i]
				break
			}
		}
		m.form = newFormView(m.action.Fields, fmt.Sprintf("%s → %s", m.product.Title, m.action.ID))
		m.step = stepForm
	case listBack:
		isFlat := len(m.product.Resources) == 1 && m.product.Resources[0].ID == "default"
		if isFlat {
			m.product = nil
			m.resource = nil
			m.step = stepProduct
		} else {
			m.resource = nil
			m.step = stepResource
		}
	}
	return m, nil
}

func (m *Model) updateForm(msg tea.Msg) (tea.Model, tea.Cmd) {
	action, _ := m.form.update(msg)
	switch action {
	case formSubmit:
		values := m.form.values()
		m.step = stepLoading
		m.loadingMsg = "Running…"
		exec := m.executor
		product := m.product
		actionRef := m.action
		return m, func() tea.Msg {
			out, err := exec(product, actionRef, values)
			if err != nil {
				return executedMsg{output: out, err: err.Error()}
			}
			return executedMsg{output: out, err: ""}
		}
	case formBack:
		m.action = nil
		m.form = nil
		m.step = stepAction
	}
	return m, nil
}

func (m *Model) updateResult(msg tea.Msg) (tea.Model, tea.Cmd) {
	action, _ := m.result.update(msg)
	if action == resultBack {
		m.result = nil
		m.output = ""
		m.err = ""
		m.step = stepAction
	}
	return m, nil
}

func (m *Model) gotoResource() {
	items := make([]listItem, len(m.product.Resources))
	for i, r := range m.product.Resources {
		items[i] = listItem{id: r.ID, label: r.Label}
	}
	m.resourceList = newListView(m.product.Title+" → select a resource", items)
	m.step = stepResource
}

func (m *Model) gotoAction() {
	items := make([]listItem, len(m.resource.Actions))
	for i, a := range m.resource.Actions {
		label := a.Summary
		if label == "" {
			label = a.ID
		}
		items[i] = listItem{id: a.ID, label: label}
	}
	isFlat := len(m.product.Resources) == 1 && m.product.Resources[0].ID == "default"
	title := m.product.Title
	if !isFlat {
		title += " → " + m.resource.Label
	}
	m.actionList = newListView(title+" → select an action", items)
	m.step = stepAction
}

func (m *Model) View() string {
	var sb strings.Builder
	sb.WriteString(Logo(m.version))
	sb.WriteString("\n\n")
	switch m.step {
	case stepProduct:
		sb.WriteString(m.productList.view())
	case stepResource:
		sb.WriteString(m.resourceList.view())
	case stepAction:
		sb.WriteString(m.actionList.view())
	case stepForm:
		sb.WriteString(m.form.view())
	case stepLoading:
		sb.WriteString(m.loadingMsg)
	case stepResult:
		sb.WriteString(m.result.view())
	}
	return sb.String()
}
