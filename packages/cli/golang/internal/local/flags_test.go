package local

import (
	"testing"
	"time"
)

func TestParseArgs_defaults(t *testing.T) {
	opts, err := ParseArgs([]string{}, "mykey")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if opts.AccessKey != "mykey" {
		t.Errorf("AccessKey = %q, want %q", opts.AccessKey, "mykey")
	}
	if opts.CommandTimeout != 20*time.Second {
		t.Errorf("CommandTimeout = %v, want 20s", opts.CommandTimeout)
	}
	if opts.LocalIdentifier == "" {
		t.Error("LocalIdentifier should be auto-generated when not provided")
	}
}

func TestParseArgs_localIdentifier(t *testing.T) {
	opts, err := ParseArgs([]string{"--local-identifier", "myid"}, "mykey")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if opts.LocalIdentifier != "myid" {
		t.Errorf("LocalIdentifier = %q, want %q", opts.LocalIdentifier, "myid")
	}
}

func TestParseArgs_proxyFlags(t *testing.T) {
	opts, err := ParseArgs([]string{
		"--proxy-host", "proxy.example.com",
		"--proxy-port", "8080",
		"--proxy-user", "u",
		"--proxy-pass", "p",
		"--force-proxy",
	}, "mykey")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if opts.ProxyHost != "proxy.example.com" {
		t.Errorf("ProxyHost = %q", opts.ProxyHost)
	}
	if opts.ProxyPort != 8080 {
		t.Errorf("ProxyPort = %d", opts.ProxyPort)
	}
	if opts.ProxyUser != "u" {
		t.Errorf("ProxyUser = %q", opts.ProxyUser)
	}
	if opts.ProxyPass != "p" {
		t.Errorf("ProxyPass = %q", opts.ProxyPass)
	}
	if !opts.ForceProxy {
		t.Error("ForceProxy should be true")
	}
}

func TestParseArgs_unknownFlag(t *testing.T) {
	_, err := ParseArgs([]string{"--unknown-flag", "val"}, "key")
	if err == nil {
		t.Error("expected error for unknown flag")
	}
}

func TestDaemonArgs_start(t *testing.T) {
	opts := &Options{
		AccessKey:       "key123",
		LocalIdentifier: "myid",
	}
	args := opts.DaemonArgs("start")
	want := []string{"--key", "key123", "--local-identifier", "myid", "--daemon", "start", "--enable-logging-for-api"}
	if len(args) != len(want) {
		t.Fatalf("DaemonArgs len = %d, want %d: got %v", len(args), len(want), args)
	}
	for i, a := range args {
		if a != want[i] {
			t.Errorf("args[%d] = %q, want %q", i, a, want[i])
		}
	}
}

func TestDaemonArgs_proxyIncluded(t *testing.T) {
	opts := &Options{
		AccessKey:       "k",
		LocalIdentifier: "id",
		ProxyHost:       "h",
		ProxyPort:       3128,
	}
	args := opts.DaemonArgs("start")
	found := false
	for i, a := range args {
		if a == "--proxy-host" && i+1 < len(args) && args[i+1] == "h" {
			found = true
		}
	}
	if !found {
		t.Errorf("expected --proxy-host h in %v", args)
	}
}

func TestDaemonArgs_verboseLevels(t *testing.T) {
	for _, level := range []int{1, 2, 3} {
		opts := &Options{AccessKey: "k", LocalIdentifier: "id", Verbose: level}
		args := opts.DaemonArgs("start")
		found := false
		for _, a := range args {
			if a == "--verbose" {
				found = true
			}
		}
		if !found {
			t.Errorf("verbose level %d: expected --verbose in %v", level, args)
		}
	}
}
