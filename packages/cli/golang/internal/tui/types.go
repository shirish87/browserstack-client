package tui

type FieldType string

const (
	FieldTypeString  FieldType = "string"
	FieldTypeNumber  FieldType = "number"
	FieldTypeBoolean FieldType = "boolean"
	FieldTypeFile    FieldType = "file"
)

type FieldLocation string

const (
	LocationPath  FieldLocation = "path"
	LocationQuery FieldLocation = "query"
	LocationBody  FieldLocation = "body"
)

type PickerConfig struct {
	Source      string   // "product.action-id"
	ValueField  string   // field in each list item that becomes the value
	LabelFields []string // fields shown in the picker UI; defaults to [ValueField]
	FilterBy    []string // sibling field names that filter results
}

type Field struct {
	Name        string
	Label       string
	Description string
	Type        FieldType
	Required    bool
	Location    FieldLocation
	Enum        []string
	Picker      *PickerConfig
}

type Action struct {
	ID          string
	Summary     string
	Description string
	Section     string
	Fields      []Field
}

type Resource struct {
	ID           string
	Label        string
	Actions      []Action
	SectionOrder []string
}

type Product struct {
	ID          string
	Title       string
	Description string
	Resources   []Resource
}
