package output

import (
	"encoding/json"
	"fmt"
)

func Print(v any) error {
	return PrintWithColumns(v, nil)
}

func PrintWithColumns(v any, cols []string) error {
	// Validate marshalability first so callers get an error on bad input.
	if _, err := json.Marshal(v); err != nil {
		return err
	}
	fmt.Println(Format(v, cols))
	return nil
}
