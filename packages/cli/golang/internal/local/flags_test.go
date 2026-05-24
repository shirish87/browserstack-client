package local

import (
	"strings"
	"testing"
	"time"
)

func TestParseArgs_defaults(t *testing.T) {
	t.Setenv("BROWSERSTACK_LOCAL_COMMAND_TIMEOUT_MS", "")
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

func TestParseArgs_unknownFlagPassThrough(t *testing.T) {
	// Unknown flags + their following non-flag value are passed through to the
	// spawned binary via Extra rather than rejected.
	opts, err := ParseArgs([]string{"--unknown-flag", "val"}, "key")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if len(opts.Extra) != 2 || opts.Extra[0] != "--unknown-flag" || opts.Extra[1] != "val" {
		t.Errorf("Extra = %v, want [--unknown-flag val]", opts.Extra)
	}
}

func TestParseArgs_unknownFlagBoolean(t *testing.T) {
	// An unknown flag with no following value (or followed by another flag)
	// is still passed through as a standalone flag.
	opts, err := ParseArgs([]string{"--some-bool", "--local-identifier", "id"}, "key")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if len(opts.Extra) != 1 || opts.Extra[0] != "--some-bool" {
		t.Errorf("Extra = %v, want [--some-bool]", opts.Extra)
	}
	if opts.LocalIdentifier != "id" {
		t.Errorf("LocalIdentifier = %q, want id", opts.LocalIdentifier)
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

// --- Adversarial tests ---

func TestParseArgs_flagMissingValue(t *testing.T) {
	// --proxy-host with no following argument should return an error.
	_, err := ParseArgs([]string{"--proxy-host"}, "key")
	if err == nil {
		t.Error("expected error when --proxy-host has no value")
	}
}

func TestParseArgs_nonNumericIntFlags(t *testing.T) {
	cases := [][]string{
		{"--proxy-port", "abc"},
		{"--verbose", "abc"},
		{"--timeout", "abc"},
		{"--parallel-runs", "abc"},
		{"--local-proxy-port", "abc"},
	}
	for _, args := range cases {
		_, err := ParseArgs(args, "key")
		if err == nil {
			t.Errorf("expected error for non-numeric value in %v", args)
		}
	}
}

func TestParseArgs_verboseOutOfRange(t *testing.T) {
	// 0 and 4 are out of range and should error.
	for _, v := range []string{"0", "4", "-1", "100"} {
		_, err := ParseArgs([]string{"--verbose", v}, "key")
		if err == nil {
			t.Errorf("expected error for --verbose %s", v)
		}
	}
}

func TestParseArgs_verboseValidRange(t *testing.T) {
	for _, v := range []string{"1", "2", "3"} {
		opts, err := ParseArgs([]string{"--verbose", v}, "key")
		if err != nil {
			t.Errorf("unexpected error for --verbose %s: %v", v, err)
			continue
		}
		if opts.Verbose < 1 || opts.Verbose > 3 {
			t.Errorf("Verbose = %d out of expected range for input %s", opts.Verbose, v)
		}
	}
}

func TestDaemonArgs_emptyAccessKey(t *testing.T) {
	// Empty AccessKey should still produce --key "" in args.
	opts := &Options{AccessKey: "", LocalIdentifier: "myid"}
	args := opts.DaemonArgs("start")
	found := false
	for i, a := range args {
		if a == "--key" && i+1 < len(args) && args[i+1] == "" {
			found = true
		}
	}
	if !found {
		t.Errorf("expected --key \"\" in args, got %v", args)
	}
}

func TestDaemonArgs_allOptionalFlags(t *testing.T) {
	opts := &Options{
		AccessKey:       "k",
		LocalIdentifier: "id",
		ForceLocal:      true,
		OnlyAutomate:    true,
		Folder:          "/tmp/folder",
		LogFile:         "/tmp/log.txt",
		Timeout:         60,
		ParallelRuns:    4,
		IncludeHosts:    "host1.example.com",
		ExcludeHosts:    "host2.example.com",
		Only:            "3000,3001",
		CACert:          "/tmp/ca.pem",
		LocalProxyHost:  "localproxy.example.com",
		Verbose:         2,
	}
	args := opts.DaemonArgs("start")
	joined := strings.Join(args, " ")

	checks := []struct {
		flag string
		val  string
	}{
		{"--force-local", ""},
		{"--only-automate", ""},
		{"--folder", "/tmp/folder"},
		{"--log-file", "/tmp/log.txt"},
		{"--timeout", "60"},
		{"--parallel-runs", "4"},
		{"--include-hosts", "host1.example.com"},
		{"--exclude-hosts", "host2.example.com"},
		{"--only", "3000,3001"},
		{"--use-ca-certificate", "/tmp/ca.pem"},
		{"--local-proxy-host", "localproxy.example.com"},
		{"--verbose", "2"},
	}
	for _, c := range checks {
		if !strings.Contains(joined, c.flag) {
			t.Errorf("expected %q in DaemonArgs, got: %v", c.flag, args)
			continue
		}
		if c.val != "" && !strings.Contains(joined, c.val) {
			t.Errorf("expected value %q for flag %q in DaemonArgs, got: %v", c.val, c.flag, args)
		}
	}
}

func TestDaemonArgs_extraFlagsAppended(t *testing.T) {
	opts := &Options{
		AccessKey:       "k",
		LocalIdentifier: "id",
		Extra:           []string{"--custom-flag", "custom-value"},
	}
	args := opts.DaemonArgs("start")
	joined := strings.Join(args, " ")
	if !strings.Contains(joined, "--custom-flag") || !strings.Contains(joined, "custom-value") {
		t.Errorf("expected Extra flags in DaemonArgs, got: %v", args)
	}
}

func TestParseArgs_localIdentifierStable(t *testing.T) {
	// Explicitly-provided --local-identifier should be preserved across calls.
	opts1, err1 := ParseArgs([]string{"--local-identifier", "stable-id"}, "key")
	opts2, err2 := ParseArgs([]string{"--local-identifier", "stable-id"}, "key")
	if err1 != nil || err2 != nil {
		t.Fatalf("unexpected errors: %v, %v", err1, err2)
	}
	if opts1.LocalIdentifier != opts2.LocalIdentifier {
		t.Errorf("LocalIdentifier mismatch: %q vs %q", opts1.LocalIdentifier, opts2.LocalIdentifier)
	}
	if opts1.LocalIdentifier != "stable-id" {
		t.Errorf("LocalIdentifier = %q, want stable-id", opts1.LocalIdentifier)
	}
}

func TestParseArgs_positionalLocalIdentifier(t *testing.T) {
	// A bare positional token is taken as the LocalIdentifier when
	// --local-identifier was not passed.
	opts, err := ParseArgs([]string{"my-positional-id"}, "key")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if opts.LocalIdentifier != "my-positional-id" {
		t.Errorf("LocalIdentifier = %q, want my-positional-id", opts.LocalIdentifier)
	}
	if !opts.ExplicitLocalIdentifier {
		t.Error("ExplicitLocalIdentifier should be true for positional id")
	}
}

func TestParseArgs_secondPositionalRejected(t *testing.T) {
	// Only one positional token is meaningful — a second one is an error.
	_, err := ParseArgs([]string{"id-one", "id-two"}, "key")
	if err == nil {
		t.Error("expected error for second positional argument")
	}
}

