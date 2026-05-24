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
	prefills map[string]string

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

func NewModel(version string, executor Executor, prefills map[string]string) *Model {
	return &Model{
		version:     version,
		step:        stepProduct,
		productList: newListView("Select a product", groupedProductItems(Manifest)),
		executor:    executor,
		prefills:    prefills,
	}
}

func groupedProductItems(products []Product) []listItem {
	type bucket struct{ name string; items []Product }
	order := []string{}
	byCategory := map[string][]Product{}
	for _, p := range products {
		cat := p.Category
		if cat == "" {
			cat = "Other"
		}
		if _, ok := byCategory[cat]; !ok {
			order = append(order, cat)
		}
		byCategory[cat] = append(byCategory[cat], p)
	}
	// Single category → flat list, no headers.
	if len(order) == 1 {
		out := make([]listItem, len(products))
		for i, p := range products {
			out[i] = listItem{id: p.ID, label: StripBrand(p.Title), description: p.Description}
		}
		return out
	}
	out := []listItem{}
	for _, cat := range order {
		out = append(out, listItem{id: "__cat_" + cat, label: cat, header: true})
		for _, p := range byCategory[cat] {
			out = append(out, listItem{id: p.ID, label: StripBrand(p.Title), description: p.Description})
		}
	}
	return out
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
		if m.form != nil {
			m.form.setHeight(msg.Height)
			m.form.setWidth(msg.Width)
		}
		if m.productList != nil {
			m.productList.setHeight(msg.Height)
		}
		if m.resourceList != nil {
			m.resourceList.setHeight(msg.Height)
		}
		if m.actionList != nil {
			m.actionList.setHeight(msg.Height)
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
		if len(m.action.Fields) == 0 {
			m.step = stepLoading
			m.loadingMsg = "Running…"
			exec := m.executor
			product := m.product
			actionRef := m.action
			return m, func() tea.Msg {
				out, err := exec(product, actionRef, map[string]string{})
				if err != nil {
					return executedMsg{output: out, err: err.Error()}
				}
				return executedMsg{output: out, err: ""}
			}
		}
		m.form = newFormView(m.action.Fields, fmt.Sprintf("%s → %s", StripBrand(m.product.Title), m.action.ID), m.prefills)
		if m.termHeight > 0 {
			m.form.setHeight(m.termHeight)
		}
		if m.termWidth > 0 {
			m.form.setWidth(m.termWidth)
		}
		// Provide a picker fetcher that resolves productID/actionID via the manifest then calls executor.
		exec := m.executor
		m.form.setFetcher(func(productID, actionID string, args map[string]string) (string, error) {
			var prod *Product
			var act *Action
			for i := range Manifest {
				if Manifest[i].ID != productID {
					continue
				}
				prod = &Manifest[i]
				for j := range prod.Resources {
					for k := range prod.Resources[j].Actions {
						if prod.Resources[j].Actions[k].ID == actionID {
							act = &prod.Resources[j].Actions[k]
						}
					}
				}
			}
			if prod == nil || act == nil {
				return "", fmt.Errorf("picker source not found: %s.%s", productID, actionID)
			}
			return exec(prod, act, args)
		})
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
	m.resourceList = newListView(StripBrand(m.product.Title)+" → select a resource", items)
	if m.termHeight > 0 {
		m.resourceList.setHeight(m.termHeight)
	}
	m.step = stepResource
}

func (m *Model) gotoAction() {
	items := groupedActionItems(m.resource.Actions, m.resource.SectionOrder)
	isFlat := len(m.product.Resources) == 1 && m.product.Resources[0].ID == "default"
	title := StripBrand(m.product.Title)
	if !isFlat {
		title += " → " + m.resource.Label
	}
	m.actionList = newListView(title+" → select an action", items)
	if m.termHeight > 0 {
		m.actionList.setHeight(m.termHeight)
	}
	m.step = stepAction
}

func groupedActionItems(actions []Action, sectionOrder []string) []listItem {
	type bucket struct {
		name    string
		actions []Action
	}
	order := []string{}
	bySection := map[string][]Action{}
	for _, a := range actions {
		key := a.Section
		if key == "" {
			key = "General"
		}
		if _, ok := bySection[key]; !ok {
			order = append(order, key)
		}
		bySection[key] = append(bySection[key], a)
	}
	// Apply explicit section order if provided, preserving any sections not listed at the end.
	if len(sectionOrder) > 0 {
		ranked := make([]string, 0, len(order))
		inRanked := map[string]bool{}
		for _, s := range sectionOrder {
			if _, ok := bySection[s]; ok {
				ranked = append(ranked, s)
				inRanked[s] = true
			}
		}
		for _, s := range order {
			if !inRanked[s] {
				ranked = append(ranked, s)
			}
		}
		order = ranked
	}
	mkLabel := func(a Action) string {
		if a.Summary != "" {
			return a.Summary
		}
		return a.ID
	}
	// One section → flat list, no headers.
	if len(order) == 1 {
		out := make([]listItem, len(actions))
		for i, a := range actions {
			out[i] = listItem{id: a.ID, label: mkLabel(a)}
		}
		return out
	}
	out := []listItem{}
	for _, section := range order {
		out = append(out, listItem{id: "__section_" + section, label: section, header: true})
		for _, a := range bySection[section] {
			out = append(out, listItem{id: a.ID, label: mkLabel(a)})
		}
	}
	return out
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
