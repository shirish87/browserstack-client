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

type Field struct {
	Name        string
	Label       string
	Description string
	Type        FieldType
	Required    bool
	Location    FieldLocation
	Enum        []string
}

type Action struct {
	ID          string
	Summary     string
	Description string
	Fields      []Field
}

type Resource struct {
	ID      string
	Label   string
	Actions []Action
}

type Product struct {
	ID          string
	Title       string
	Description string
	Resources   []Resource
}
