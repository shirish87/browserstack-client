package browserstackhttp

import (
	"testing"
)

func TestBuildURL(t *testing.T) {
	c := &Client{baseURL: "https://api.browserstack.com"}
	
	tests := []struct {
		path   string
		query  map[string]string
		expect string
	}{
		{
			path:   "/test",
			query:  map[string]string{"a": "1", "b": ""},
			expect: "https://api.browserstack.com/test?a=1",
		},
		{
			path:   "/test",
			query:  map[string]string{"a": "", "b": ""},
			expect: "https://api.browserstack.com/test",
		},
		{
			path:   "/test",
			query:  map[string]string{},
			expect: "https://api.browserstack.com/test",
		},
	}

	for _, tt := range tests {
		got := c.buildURL(tt.path, tt.query)
		if got != tt.expect {
			t.Errorf("buildURL(%q, %v) = %q, want %q", tt.path, tt.query, got, tt.expect)
		}
	}
}
