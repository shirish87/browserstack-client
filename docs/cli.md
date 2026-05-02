# Command Line Interface (CLI)

The BrowserStack Client project provides a unified, high-performance **native Go-based CLI** for interacting with all BrowserStack products. This standalone tool is designed for maximum performance, fast startup times, and environment flexibility.

## Features

- **Native Performance**: Written in Go, providing fast execution and minimal resource footprint.
- **Zero Dependencies**: Standalone binaries that do not require Node.js, Python, or any other runtime on your system.
- **Unified Interface**: One tool to rule them all—Automate, App Automate, Screenshots, Accessibility, and more.
- **Automated Local Testing**: Built-in management for the `BrowserStackLocal` binary.
- **OpenAPI Powered**: All commands and arguments are strictly derived from the official BrowserStack OpenAPI specifications.

## Installation

### Pre-compiled Binaries

<div id="os-install">

<details id="install-linux">
<summary><b>Linux</b></summary>

<div class="arch-amd64">

#### x64 (AMD64)
```bash
wget https://github.com/shirish87/browserstack-client/releases/download/v6.1.0/browserstack-client-linux-amd64 -O browserstack-client
chmod +x browserstack-client
```
</div>

<div class="arch-arm64">

#### ARM64
```bash
wget https://github.com/shirish87/browserstack-client/releases/download/v6.1.0/browserstack-client-linux-arm64 -O browserstack-client
chmod +x browserstack-client
```
</div>

<div class="arch-toggle" style="margin-top: 10px; font-size: 0.9em; opacity: 0.8;">
  <a href="#" onclick="window.showAllArch(); return false;">Not your architecture? Show all.</a>
</div>
</details>

<details id="install-macos">
<summary><b>macOS</b></summary>

<div class="arch-amd64">

#### Intel (x64)
```bash
wget https://github.com/shirish87/browserstack-client/releases/download/v6.1.0/browserstack-client-darwin-amd64 -O browserstack-client
chmod +x browserstack-client
```
</div>

<div class="arch-arm64">

#### Apple Silicon (ARM64)
```bash
wget https://github.com/shirish87/browserstack-client/releases/download/v6.1.0/browserstack-client-darwin-arm64 -O browserstack-client
chmod +x browserstack-client
```
</div>

<div class="arch-toggle" style="margin-top: 10px; font-size: 0.9em; opacity: 0.8;">
  <a href="#" onclick="window.showAllArch(); return false;">Not your architecture? Show all.</a>
</div>
</details>

<details id="install-windows">
<summary><b>Windows (x64)</b></summary>

```powershell
wget https://github.com/shirish87/browserstack-client/releases/download/v6.1.0/browserstack-client-windows-amd64.exe -OutFile browserstack-client.exe
```
</details>

</div>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  const ua = window.navigator.userAgent.toLowerCase()
  let osId = null
  let arch = 'amd64' // Default

  // OS Detection
  if (ua.includes('linux')) osId = 'install-linux'
  else if (ua.includes('mac')) osId = 'install-macos'
  else if (ua.includes('win')) osId = 'install-windows'

  // Architecture Detection
  // Check UA and platform
  const platform = window.navigator.platform?.toLowerCase() || ''
  if (ua.includes('arm64') || ua.includes('aarch64') || platform.includes('arm64') || platform.includes('aarch64')) {
    arch = 'arm64'
  }

  // Open appropriate OS section
  if (osId) {
    const el = document.getElementById(osId)
    if (el) el.setAttribute('open', '')
  }

  // Define global toggle function
  window.showAllArch = () => {
    document.querySelectorAll('.arch-amd64, .arch-arm64').forEach(el => el.style.display = 'block')
    document.querySelectorAll('.arch-toggle').forEach(el => el.style.display = 'none')
  }

  // Filter architectures initially
  const showClass = `arch-${arch}`
  const hideClass = `arch-${arch === 'arm64' ? 'amd64' : 'arm64'}`
  
  document.querySelectorAll(`.${hideClass}`).forEach(el => el.style.display = 'none')
  document.querySelectorAll(`.${showClass}`).forEach(el => el.style.display = 'block')
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
- `test-management`
- `test-reporting`
- `local`

## Local Testing Features

The `local` product provides powerful wrappers around the `BrowserStackLocal` binary.

- **`start [localIdentifier]`**: Starts a new BrowserStack Local instance.
- **`stop [localIdentifier]`**: Stops a running instance.
- **`list`**: Lists all active local testing identifiers.
- **`run-with [localIdentifier] -- <command>`**: 
    - Automatically starts a local instance.
    - Sets the `BROWSERSTACK_LOCAL_IDENTIFIER` environment variable for your command.
    - Runs your command.
    - Automatically cleans up and stops the local instance when your command finishes.

## Examples

### Automate
```bash
# List all projects
browserstack-client automate list-projects

# Get details of a specific project
browserstack-client automate get-project <project-id>
```

### App Automate
```bash
# Upload an Android app for Flutter testing
browserstack-client app-automate upload-flutter-android-app ./my-app.apk

# List uploaded apps
browserstack-client app-automate list-apps
```

### Screenshots
```bash
# List all generated screenshots
browserstack-client screenshots list-screenshots
```

### Accessibility
```bash
# List all Workflow Analyzer reports
browserstack-client accessibility list-workflow-analyzer-reports

# List Website Scanner scans
browserstack-client accessibility list-website-scanner-scans
```

### Test Management
```bash
# List all Test Management projects
browserstack-client test-management list-projects

# List test runs for a project
browserstack-client test-management list-test-runs <project-id>
```

## Help and Version

- **Help**: Run `browserstack-client help` or `<product> help` to see available actions and arguments.
- **Version**: Run `browserstack-client version` to check the current version of the CLI.
