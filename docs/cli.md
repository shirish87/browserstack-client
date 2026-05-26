# Command Line Interface (CLI)

The BrowserStack Client project provides a unified, high-performance **native Go-based CLI** for interacting with all BrowserStack products. This standalone tool is designed for maximum performance, fast startup times, and environment flexibility.

## Installation

### Pre-compiled Binaries

<div id="os-install">

<details id="install-linux">
<summary><b>Linux</b></summary>

<div class="arch-amd64">

#### x64 (AMD64)
```bash
wget https://github.com/shirish87/browserstack-client/releases/download/v7.0.0/browserstack-client-linux-amd64 -O browserstack-client
chmod +x browserstack-client
```
</div>

<div class="arch-arm64">

#### ARM64
```bash
wget https://github.com/shirish87/browserstack-client/releases/download/v7.0.0/browserstack-client-linux-arm64 -O browserstack-client
chmod +x browserstack-client
```
</div>

<div class="arch-toggle" style="margin-top: 10px; font-size: 0.9em; opacity: 0.8;">
  <a href="#" onclick="window.showAllArch(); return false;">Not your architecture? Show all.</a>
</div>
</details>

<details id="install-macos">
<summary><b>macOS</b></summary>

#### Apple Silicon (ARM64)
```bash
wget https://github.com/shirish87/browserstack-client/releases/download/v7.0.0/browserstack-client-darwin-arm64 -O browserstack-client
chmod +x browserstack-client
```

#### Intel (x64)
```bash
wget https://github.com/shirish87/browserstack-client/releases/download/v7.0.0/browserstack-client-darwin-amd64 -O browserstack-client
chmod +x browserstack-client
```

</details>

<details id="install-windows">
<summary><b>Windows (x64)</b></summary>

```powershell
wget https://github.com/shirish87/browserstack-client/releases/download/v7.0.0/browserstack-client-windows-amd64.exe -OutFile browserstack-client.exe
```
</details>

</div>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  const ua = window.navigator.userAgent.toLowerCase()
  let osId = null

  // OS Detection
  if (ua.includes('linux')) osId = 'install-linux'
  else if (ua.includes('mac')) osId = 'install-macos'
  else if (ua.includes('win')) osId = 'install-windows'

  // Open appropriate OS section
  if (osId) {
    const el = document.getElementById(osId)
    if (el) el.setAttribute('open', '')
  }

  // Architecture detection for Linux only (macOS always shows both).
  // Browsers on macOS ARM don't reliably expose arm64 in the UA string.
  if (osId === 'install-linux') {
    const platform = window.navigator.platform?.toLowerCase() || ''
    const isArm = ua.includes('arm64') || ua.includes('aarch64') || platform.includes('arm64') || platform.includes('aarch64')
    const arch = isArm ? 'arm64' : 'amd64'
    const hideClass = arch === 'arm64' ? 'arch-amd64' : 'arch-arm64'
    document.querySelectorAll(`#install-linux .${hideClass}`).forEach(el => el.style.display = 'none')
  }

  // Define global toggle function
  window.showAllArch = () => {
    document.querySelectorAll('.arch-amd64, .arch-arm64').forEach(el => el.style.display = 'block')
    document.querySelectorAll('.arch-toggle').forEach(el => el.style.display = 'none')
  }
})
</script>

After downloading, move the binary to a directory in your `PATH`.

## Global Configuration

The CLI looks for BrowserStack credentials in the following environment variables:

```bash
export BROWSERSTACK_USERNAME="your_username"
export BROWSERSTACK_ACCESS_KEY="your_access_key"
```

## Usage Structure

```bash
browserstack-client <product> <action> [args...]
```

### Supported Products
- `automate`
- `app-automate`
- `screenshots`
- `accessibility`
- `website-scanner`
- `test-management`
- `test-reporting`
- `local`

## Automate

```bash
# List all projects
browserstack-client automate list-projects

# Get a specific project
browserstack-client automate get-project <projectId>

# List builds
browserstack-client automate list-builds

# List sessions for a build
browserstack-client automate list-sessions <buildId>

# Get a session
browserstack-client automate get-session <sessionId>

# Update a session (e.g. mark passed/failed)
browserstack-client automate update-session <sessionId>

# Delete a build
browserstack-client automate delete-build <buildId>

# Get Appium logs for a session
browserstack-client automate list-session-appium-logs <sessionId>

# List available browsers
browserstack-client automate list-browsers

# Get current plan usage
browserstack-client automate get-plan
```

## App Automate

```bash
# Upload an app
browserstack-client app-automate upload-app ./my-app.apk

# List uploaded apps
browserstack-client app-automate list-apps

# List builds
browserstack-client app-automate list-builds

# Get a session
browserstack-client app-automate get-session <sessionId>

# List available devices
browserstack-client app-automate list-devices

# Upload a Flutter Android app
browserstack-client app-automate upload-flutter-android-app ./my-app.apk

# Upload an Espresso app
browserstack-client app-automate upload-espresso-app ./my-app.apk

# Delete an app
browserstack-client app-automate delete-app <appId>

# Get session logs
browserstack-client app-automate list-session-logs <buildId> <sessionId>

# Get current plan usage
browserstack-client app-automate get-plan
```

## Screenshots

```bash
# List available browsers
browserstack-client screenshots list-browsers

# Create a screenshot job
browserstack-client screenshots create-job

# Get job status and results
browserstack-client screenshots get-job <jobId>
```

## Accessibility

```bash
# List Workflow Analyzer reports
browserstack-client accessibility list-workflow-analyzer-reports

# Get a Workflow Analyzer report summary
browserstack-client accessibility get-workflow-analyzer-report-summary <reportId>

# List issues for a report
browserstack-client accessibility list-workflow-analyzer-report-issues <reportId>

# List Assisted Test reports
browserstack-client accessibility list-assisted-test-reports

# Get an Assisted Test report summary
browserstack-client accessibility get-assisted-test-report-summary <reportId>
```

## Website Scanner

```bash
# List all scans
browserstack-client website-scanner list-website-scanner-scans

# Create a new scan
browserstack-client website-scanner create-website-scanner-scan

# Get scan overview
browserstack-client website-scanner get-website-scanner-scan-overview <projId>

# List scan runs
browserstack-client website-scanner list-website-scanner-scan-runs <projId>

# Get scan run summary
browserstack-client website-scanner get-website-scanner-scan-run-summary <projId> <reportId>

# Get scan run status
browserstack-client website-scanner list-website-scanner-scan-run-status <projId> <reportId>

# List scan run issues
browserstack-client website-scanner list-website-scanner-scan-run-issues <projId> <reportId>

# Manage auth configs (for scanning authenticated pages)
browserstack-client website-scanner list-website-scanner-auth-configs
browserstack-client website-scanner create-website-scanner-auth-config
```

## Test Management

```bash
# List projects
browserstack-client test-management list-projects

# Create a project
browserstack-client test-management create-project

# List test cases in a project
browserstack-client test-management list-test-cases <projectId>

# Create a test run
browserstack-client test-management create-test-run

# List test runs
browserstack-client test-management list-test-runs <projectId>

# Get a test run
browserstack-client test-management get-test-run <testRunId>

# Add results to a test run
browserstack-client test-management add-test-run-results <testRunId>

# Close a test run
browserstack-client test-management close-test-run <testRunId>

# List test plans
browserstack-client test-management list-test-plans <projectId>

# Create a test plan
browserstack-client test-management create-test-plan
```

## Test Reporting & Analytics

```bash
# Upload a JUnit XML report
browserstack-client test-reporting upload-report ./results.xml \
  --project-name "My Project" \
  --build-name "Build #42"

# Upload an Allure report archive
browserstack-client test-reporting upload-report ./allure-results.zip \
  --project-name "My Project" \
  --build-name "Build #42" \
  --format allure

# List projects
browserstack-client test-reporting list-projects

# Get the latest build for a project
browserstack-client test-reporting get-latest-build "My Project" "Build #42"

# List builds for a project
browserstack-client test-reporting list-project-builds <projectId>

# Start a build programmatically
browserstack-client test-reporting start-build

# Finish a build
browserstack-client test-reporting finish-build <buildId>

# List quality gate status
browserstack-client test-reporting list-quality-gate-status <buildId>
```

## Local Testing

The `local` product manages the `BrowserStackLocal` binary — start and stop tunnel instances, or wrap a command to run inside a tunnel.

```bash
# Start a tunnel (blocks until ready)
browserstack-client local start

# Start a named tunnel
browserstack-client local start my-tunnel

# List active tunnels
browserstack-client local list

# Stop a named tunnel
browserstack-client local stop my-tunnel

# Run a command inside a tunnel, then auto-stop
browserstack-client local run-with my-tunnel -- npm test
```

`run-with` automatically sets `BROWSERSTACK_LOCAL_IDENTIFIER` in the child process environment and stops the tunnel when the command exits.

## Help and Version

- **Help**: Run `browserstack-client help` or `browserstack-client <product> help` to see available actions and arguments.
- **Version**: Run `browserstack-client version` to check the current version of the CLI.
