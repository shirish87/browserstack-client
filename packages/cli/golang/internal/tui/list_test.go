package tui

import (
	"strings"
	"testing"
)

func TestListViewEmptyFilterNoPanic(t *testing.T) {
	l := &listView{
		title: "Test",
		items: []listItem{
			{id: "a", label: "Alpha"},
			{id: "b", label: "Beta"},
		},
		index:      0,
		termHeight: 24,
		query:      "zzz_no_match",
		filtering:  true,
	}
	// Must not panic when filter matches nothing.
	got := l.view()
	if !strings.Contains(got, "No matches") {
		t.Errorf("expected 'No matches' in output, got: %q", got)
	}
}
