package local

import (
	"fmt"
	"math/rand" // math/rand global is auto-seeded since Go 1.20; math/rand/v2 requires Go 1.22
	"strconv"
	"strings"
	"time"
)

// Options holds all configuration for controlling the BrowserStackLocal binary.
type Options struct {
	AccessKey       string
	BinHome         string
	LocalIdentifier string
	// ExplicitLocalIdentifier is true when the user supplied the identifier
	// either positionally or via --local-identifier (i.e. not auto-generated).
	ExplicitLocalIdentifier bool
	CommandTimeout          time.Duration

	// HTTP proxy
	ProxyHost  string
	ProxyPort  int
	ProxyUser  string
	ProxyPass  string
	ForceProxy bool
	CACert     string

	// Local proxy (behind-proxy testing)
	LocalProxyHost string
	LocalProxyPort int
	LocalProxyUser string
	LocalProxyPass string

	// Tunnel config
	ForceLocal   bool
	OnlyAutomate bool
	Only         string
	IncludeHosts string
	ExcludeHosts string
	Folder       string

	// Debug
	Verbose int
	LogFile string

	// Limits
	Timeout      int
	ParallelRuns int

	// Pass-through flags for the binary
	Extra []string
}

// ParseArgs parses CLI args into an Options. Three forms are accepted:
//
//   - positional [string]                — first bare token is taken as the
//     LocalIdentifier (when --local-identifier was not also passed).
//   - --local-identifier <string>        — explicit form; sets LocalIdentifier.
//   - --<flag> [value]                   — known flags update the corresponding
//     Options field; unknown flags (and a following non-flag value, if any)
//     are appended to Options.Extra and passed through to the binary as-is.
//
// accessKey is used as the default value for Options.AccessKey.
// A random localIdentifier is generated if neither form supplied one.
func ParseArgs(args []string, accessKey string) (*Options, error) {
	opts := &Options{
		AccessKey:      accessKey,
		CommandTimeout: 20 * time.Second,
	}

	i := 0
	for i < len(args) {
		arg := args[i]
		if !strings.HasPrefix(arg, "--") {
			// Bare positional → LocalIdentifier (only the first one wins).
			if !opts.ExplicitLocalIdentifier {
				opts.LocalIdentifier = arg
				opts.ExplicitLocalIdentifier = true
			} else {
				return nil, fmt.Errorf("unexpected positional argument %q", arg)
			}
			i++
			continue
		}
		key := strings.TrimPrefix(arg, "--")

		needsValue := func() (string, error) {
			if i+1 >= len(args) {
				return "", fmt.Errorf("flag --%s requires a value", key)
			}
			i++
			return args[i], nil
		}

		switch key {
		case "local-identifier":
			v, err := needsValue()
			if err != nil {
				return nil, err
			}
			opts.LocalIdentifier = v
			opts.ExplicitLocalIdentifier = true
		case "proxy-host":
			v, err := needsValue()
			if err != nil {
				return nil, err
			}
			opts.ProxyHost = v
		case "proxy-port":
			v, err := needsValue()
			if err != nil {
				return nil, err
			}
			n, err := strconv.Atoi(v)
			if err != nil {
				return nil, fmt.Errorf("--proxy-port must be an integer: %w", err)
			}
			opts.ProxyPort = n
		case "proxy-user":
			v, err := needsValue()
			if err != nil {
				return nil, err
			}
			opts.ProxyUser = v
		case "proxy-pass":
			v, err := needsValue()
			if err != nil {
				return nil, err
			}
			opts.ProxyPass = v
		case "force-proxy":
			opts.ForceProxy = true
		case "use-ca-certificate":
			v, err := needsValue()
			if err != nil {
				return nil, err
			}
			opts.CACert = v
		case "local-proxy-host":
			v, err := needsValue()
			if err != nil {
				return nil, err
			}
			opts.LocalProxyHost = v
		case "local-proxy-port":
			v, err := needsValue()
			if err != nil {
				return nil, err
			}
			n, err := strconv.Atoi(v)
			if err != nil {
				return nil, fmt.Errorf("--local-proxy-port must be an integer: %w", err)
			}
			opts.LocalProxyPort = n
		case "local-proxy-user":
			v, err := needsValue()
			if err != nil {
				return nil, err
			}
			opts.LocalProxyUser = v
		case "local-proxy-pass":
			v, err := needsValue()
			if err != nil {
				return nil, err
			}
			opts.LocalProxyPass = v
		case "force-local":
			opts.ForceLocal = true
		case "only-automate":
			opts.OnlyAutomate = true
		case "only":
			v, err := needsValue()
			if err != nil {
				return nil, err
			}
			opts.Only = v
		case "include-hosts":
			v, err := needsValue()
			if err != nil {
				return nil, err
			}
			opts.IncludeHosts = v
		case "exclude-hosts":
			v, err := needsValue()
			if err != nil {
				return nil, err
			}
			opts.ExcludeHosts = v
		case "folder":
			v, err := needsValue()
			if err != nil {
				return nil, err
			}
			opts.Folder = v
		case "verbose":
			v, err := needsValue()
			if err != nil {
				return nil, err
			}
			n, err := strconv.Atoi(v)
			if err != nil || n < 1 || n > 3 {
				return nil, fmt.Errorf("--verbose must be 1, 2, or 3")
			}
			opts.Verbose = n
		case "log-file":
			v, err := needsValue()
			if err != nil {
				return nil, err
			}
			opts.LogFile = v
		case "timeout":
			v, err := needsValue()
			if err != nil {
				return nil, err
			}
			n, err := strconv.Atoi(v)
			if err != nil {
				return nil, fmt.Errorf("--timeout must be an integer: %w", err)
			}
			opts.Timeout = n
		case "parallel-runs":
			v, err := needsValue()
			if err != nil {
				return nil, err
			}
			n, err := strconv.Atoi(v)
			if err != nil {
				return nil, fmt.Errorf("--parallel-runs must be an integer: %w", err)
			}
			opts.ParallelRuns = n
		default:
			// Unknown flag: pass through to the binary. Append the flag and,
			// if the next token is not itself a flag, append it as the value.
			opts.Extra = append(opts.Extra, arg)
			if i+1 < len(args) && !strings.HasPrefix(args[i+1], "--") {
				opts.Extra = append(opts.Extra, args[i+1])
				i++
			}
		}
		i++
	}

	if opts.LocalIdentifier == "" {
		opts.LocalIdentifier = randomIdentifier()
	}

	return opts, nil
}

// DaemonArgs builds the argument slice to pass to the BrowserStackLocal binary.
func (o *Options) DaemonArgs(action string) []string {
	args := []string{
		"--key", o.AccessKey,
		"--local-identifier", o.LocalIdentifier,
		"--daemon", action,
		"--enable-logging-for-api",
	}

	if o.ProxyHost != "" {
		args = append(args, "--proxy-host", o.ProxyHost)
	}
	if o.ProxyPort != 0 {
		args = append(args, "--proxy-port", strconv.Itoa(o.ProxyPort))
	}
	if o.ProxyUser != "" {
		args = append(args, "--proxy-user", o.ProxyUser)
	}
	if o.ProxyPass != "" {
		args = append(args, "--proxy-pass", o.ProxyPass)
	}
	if o.ForceProxy {
		args = append(args, "--force-proxy")
	}
	if o.CACert != "" {
		args = append(args, "--use-ca-certificate", o.CACert)
	}
	if o.LocalProxyHost != "" {
		args = append(args, "--local-proxy-host", o.LocalProxyHost)
	}
	if o.LocalProxyPort != 0 {
		args = append(args, "--local-proxy-port", strconv.Itoa(o.LocalProxyPort))
	}
	if o.LocalProxyUser != "" {
		args = append(args, "--local-proxy-user", o.LocalProxyUser)
	}
	if o.LocalProxyPass != "" {
		args = append(args, "--local-proxy-pass", o.LocalProxyPass)
	}
	if o.ForceLocal {
		args = append(args, "--force-local")
	}
	if o.OnlyAutomate {
		args = append(args, "--only-automate")
	}
	if o.Only != "" {
		args = append(args, "--only", o.Only)
	}
	if o.IncludeHosts != "" {
		args = append(args, "--include-hosts", o.IncludeHosts)
	}
	if o.ExcludeHosts != "" {
		args = append(args, "--exclude-hosts", o.ExcludeHosts)
	}
	if o.Folder != "" {
		args = append(args, "--folder", o.Folder)
	}
	if o.Verbose >= 1 && o.Verbose <= 3 {
		args = append(args, "--verbose", strconv.Itoa(o.Verbose))
	}
	if o.LogFile != "" {
		args = append(args, "--log-file", o.LogFile)
	}
	if o.Timeout > 0 {
		args = append(args, "--timeout", strconv.Itoa(o.Timeout))
	}
	if o.ParallelRuns > 0 {
		args = append(args, "--parallel-runs", strconv.Itoa(o.ParallelRuns))
	}
	args = append(args, o.Extra...)
	return args
}

func randomIdentifier() string {
	const chars = "abcdefghijklmnopqrstuvwxyz0123456789"
	b := make([]byte, 12)
	for i := range b {
		b[i] = chars[rand.Intn(len(chars))]
	}
	return string(b)
}
