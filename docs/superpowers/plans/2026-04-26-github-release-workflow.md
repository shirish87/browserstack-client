# GitHub Release Workflow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a GitHub Actions workflow that, on a version tag push, builds all CLI binaries (Go + TypeScript) and SDK tarballs, creates a GitHub Release, and attaches all artifacts.

**Architecture:** One new workflow file `release.yml` triggered by `v*` tag pushes. It runs three parallel jobs — Go cross-compile, TS binary build, SDK pack — then a final `release` job that waits for all three, creates the GitHub Release, and uploads every artifact. The existing `main.yml` CI and `publish-npm-package.yml` are not modified.

**Tech Stack:** GitHub Actions, pnpm 10, Node.js LTS, Go 1.21+, `@yao-pkg/pkg` (already in devDeps), `gh` CLI (available in `ubuntu-latest` runners), `pnpm pack`

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `.github/workflows/release.yml` | **Create** | Full release workflow |
| `packages/cli/golang/Makefile` | **Modify** | Add `build-all-platforms` target for cross-compilation |

---

### Task 1: Add cross-platform Go build target to Makefile

The current `make build` only builds for the host platform. We need `linux/amd64`, `linux/arm64`, `darwin/arm64`, `darwin/amd64`, and `windows/amd64` binaries in CI.

**Files:**
- Modify: `packages/cli/golang/Makefile`

- [ ] **Step 1: Add `build-all-platforms` target**

Open `packages/cli/golang/Makefile` and append after the existing `build:` target:

```makefile
build-all-platforms:
	GOOS=linux   GOARCH=amd64 go build -ldflags "-X main.version=$(VERSION)" -o dist/browserstack-client-linux-amd64   ./cmd/browserstack
	GOOS=linux   GOARCH=arm64 go build -ldflags "-X main.version=$(VERSION)" -o dist/browserstack-client-linux-arm64   ./cmd/browserstack
	GOOS=darwin  GOARCH=amd64 go build -ldflags "-X main.version=$(VERSION)" -o dist/browserstack-client-darwin-amd64  ./cmd/browserstack
	GOOS=darwin  GOARCH=arm64 go build -ldflags "-X main.version=$(VERSION)" -o dist/browserstack-client-darwin-arm64  ./cmd/browserstack
	GOOS=windows GOARCH=amd64 go build -ldflags "-X main.version=$(VERSION)" -o dist/browserstack-client-windows-amd64.exe ./cmd/browserstack
```

Also add `build-all-platforms` to the `.PHONY` line:

```makefile
.PHONY: build build-all-platforms test lint integration-test
```

- [ ] **Step 2: Verify locally**

```bash
cd packages/cli/golang && make build-all-platforms
ls dist/
```

Expected output:
```
browserstack-client
browserstack-client-linux-amd64
browserstack-client-linux-arm64
browserstack-client-darwin-amd64
browserstack-client-darwin-arm64
browserstack-client-windows-amd64.exe
```

- [ ] **Step 3: Commit**

```bash
git add packages/cli/golang/Makefile
git commit -m "build(go): add cross-platform build targets for release"
```

---

### Task 2: Create the release workflow

**Files:**
- Create: `.github/workflows/release.yml`

- [ ] **Step 1: Create `.github/workflows/release.yml` with this exact content**

```yaml
name: Release

on:
  push:
    tags:
      - 'v*'
  workflow_dispatch:
    inputs:
      tag:
        description: 'Tag to release (e.g. v6.0.1)'
        required: true

concurrency:
  group: release-${{ github.ref }}
  cancel-in-progress: false

jobs:
  # ── Job 1: Build Go CLI binaries for all platforms ──────────────────────────
  build-go:
    name: Build Go CLI binaries
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-go@v5
        with:
          go-version-file: packages/cli/golang/go.mod
          cache-dependency-path: packages/cli/golang/go.sum

      - uses: pnpm/action-setup@v4
        with:
          version: 10

      - uses: actions/setup-node@v4
        with:
          node-version: 'lts/*'
          cache: 'pnpm'

      - name: Install dependencies (needed for VERSION from package.json)
        run: pnpm install --frozen-lockfile

      - name: Build all platforms
        working-directory: packages/cli/golang
        run: make build-all-platforms

      - name: Upload Go binaries
        uses: actions/upload-artifact@v4
        with:
          name: go-binaries
          path: packages/cli/golang/dist/browserstack-client-*
          retention-days: 1

  # ── Job 2: Build TypeScript CLI binaries ────────────────────────────────────
  build-ts:
    name: Build TypeScript CLI binaries
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 10

      - uses: actions/setup-node@v4
        with:
          node-version: 'lts/*'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build types (codegen)
        run: pnpm build:types

      - name: Build TypeScript CLI binary
        run: pnpm build:cli:ts

      - name: Upload TS binaries
        uses: actions/upload-artifact@v4
        with:
          name: ts-binaries
          path: |
            packages/cli/typescript/dist-binary/browserstack-client-linux-x64
            packages/cli/typescript/dist-binary/browserstack-client-macos-arm64
            packages/cli/typescript/dist-binary/browserstack-client-win-x64.exe
          retention-days: 1

  # ── Job 3: Pack SDK tarballs ─────────────────────────────────────────────────
  build-sdk:
    name: Pack SDK tarballs
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 10

      - uses: actions/setup-node@v4
        with:
          node-version: 'lts/*'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build types (codegen)
        run: pnpm build:types

      - name: Build all SDK packages
        run: pnpm build

      - name: Pack tarballs
        run: |
          mkdir -p release-tarballs
          for pkg in automate app-automate screenshots local-testing local-testing-binary accessibility test-management test-reporting; do
            pnpm --filter "@browserstack-client/$pkg" pack --pack-destination ../../release-tarballs
          done
        working-directory: packages

      - name: Upload SDK tarballs
        uses: actions/upload-artifact@v4
        with:
          name: sdk-tarballs
          path: release-tarballs/*.tgz
          retention-days: 1

  # ── Job 4: Create GitHub Release and attach all artifacts ───────────────────
  release:
    name: Create GitHub Release
    needs: [build-go, build-ts, build-sdk]
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Resolve tag name
        id: tag
        run: |
          if [ "${{ github.event_name }}" = "workflow_dispatch" ]; then
            echo "name=${{ github.event.inputs.tag }}" >> "$GITHUB_OUTPUT"
          else
            echo "name=${GITHUB_REF_NAME}" >> "$GITHUB_OUTPUT"
          fi

      - name: Download Go binaries
        uses: actions/download-artifact@v4
        with:
          name: go-binaries
          path: release-assets/go

      - name: Download TS binaries
        uses: actions/download-artifact@v4
        with:
          name: ts-binaries
          path: release-assets/ts

      - name: Download SDK tarballs
        uses: actions/download-artifact@v4
        with:
          name: sdk-tarballs
          path: release-assets/sdk

      - name: Make binaries executable
        run: chmod +x release-assets/go/* release-assets/ts/browserstack-client-linux-x64 release-assets/ts/browserstack-client-macos-arm64 || true

      - name: Generate release notes
        id: notes
        run: |
          TAG="${{ steps.tag.outputs.name }}"
          PREV_TAG=$(git tag --sort=-version:refname | grep -v "^${TAG}$" | head -1)
          if [ -n "$PREV_TAG" ]; then
            CHANGELOG=$(git log --pretty=format:"- %s" "${PREV_TAG}..${TAG}" -- . ':!.github')
          else
            CHANGELOG=$(git log --pretty=format:"- %s" "${TAG}" -- . ':!.github')
          fi
          {
            echo "notes<<EOF"
            echo "## CLI Binaries"
            echo ""
            echo "### Go CLI (native, no Node.js required)"
            echo "| Platform | File |"
            echo "|----------|------|"
            echo "| Linux x64 | \`browserstack-client-linux-amd64\` |"
            echo "| Linux arm64 | \`browserstack-client-linux-arm64\` |"
            echo "| macOS x64 | \`browserstack-client-darwin-amd64\` |"
            echo "| macOS arm64 (M1/M2) | \`browserstack-client-darwin-arm64\` |"
            echo "| Windows x64 | \`browserstack-client-windows-amd64.exe\` |"
            echo ""
            echo "### TypeScript CLI (requires Node.js 18+)"
            echo "| Platform | File |"
            echo "|----------|------|"
            echo "| Linux x64 | \`browserstack-client-linux-x64\` |"
            echo "| macOS arm64 (M1/M2) | \`browserstack-client-macos-arm64\` |"
            echo "| Windows x64 | \`browserstack-client-win-x64.exe\` |"
            echo ""
            echo "## SDK Packages"
            echo ""
            echo "Install directly from this release:"
            echo "\`\`\`"
            echo "npm install https://github.com/shirish87/browserstack-client/releases/download/${TAG}/@browserstack-client-automate-*.tgz"
            echo "\`\`\`"
            echo ""
            echo "## Changes"
            echo ""
            echo "$CHANGELOG"
            echo "EOF"
          } >> "$GITHUB_OUTPUT"

      - name: Create release
        env:
          GH_TOKEN: ${{ github.token }}
        run: |
          TAG="${{ steps.tag.outputs.name }}"
          IS_PRE=$(echo "$TAG" | grep -qE '-(alpha|beta|rc)\.' && echo "true" || echo "false")
          gh release create "$TAG" \
            --title "Release $TAG" \
            --notes "${{ steps.notes.outputs.notes }}" \
            $([ "$IS_PRE" = "true" ] && echo "--prerelease" || true) \
            release-assets/go/browserstack-client-linux-amd64 \
            release-assets/go/browserstack-client-linux-arm64 \
            release-assets/go/browserstack-client-darwin-amd64 \
            release-assets/go/browserstack-client-darwin-arm64 \
            "release-assets/go/browserstack-client-windows-amd64.exe" \
            release-assets/ts/browserstack-client-linux-x64 \
            release-assets/ts/browserstack-client-macos-arm64 \
            "release-assets/ts/browserstack-client-win-x64.exe" \
            release-assets/sdk/*.tgz
```

- [ ] **Step 2: Verify YAML syntax**

```bash
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/release.yml'))" && echo "YAML valid"
```

Expected: `YAML valid`

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/release.yml
git commit -m "ci: add GitHub Release workflow for CLI binaries and SDK tarballs"
```

---

### Task 3: Verify the workflow definition is correct

Before tagging, do a dry-run check of the workflow logic.

- [ ] **Step 1: Confirm pnpm pack output filename format**

`pnpm pack` produces files named `<name>-<version>.tgz` with `/` replaced by `-`. For `@browserstack-client/automate@6.0.0` it produces `browserstack-client-automate-6.0.0.tgz`. Verify:

```bash
cd packages/automate && pnpm pack --pack-destination /tmp/test-pack && ls /tmp/test-pack/
```

Expected: `browserstack-client-automate-6.0.0.tgz`

- [ ] **Step 2: Confirm the `pnpm --filter` pack command works from packages/**

```bash
mkdir -p /tmp/release-tarballs
cd packages && pnpm --filter "@browserstack-client/automate" pack --pack-destination ../release-tarballs-test
ls ../release-tarballs-test/
```

Expected: `browserstack-client-automate-6.0.0.tgz`

- [ ] **Step 3: Clean up test artifacts**

```bash
rm -rf /tmp/test-pack /tmp/release-tarballs release-tarballs-test
```

- [ ] **Step 4: Push workflow to next**

```bash
git push origin feature/cli-unified-binary:next
```

---

### Task 4: Tag v6.0.0 and trigger the release

- [ ] **Step 1: Merge `next` into `main` (prerequisite — do this in GitHub UI or via PR)**

The release workflow triggers on `v*` tag pushes. Tags should be on `main`.

- [ ] **Step 2: Create and push the tag from `main`**

```bash
git checkout main
git pull origin main
git tag -a v6.0.0 -m "Release v6.0.0 — unified CLI, URL-safe path params, bundled SDK packages"
git push origin v6.0.0
```

- [ ] **Step 3: Monitor the workflow**

```bash
gh run list --workflow=release.yml --limit 5
gh run watch   # follow the latest run live
```

- [ ] **Step 4: Verify the release**

```bash
gh release view v6.0.0
```

Expected: Release with 10 binary assets + 8 tarballs listed.

- [ ] **Step 5: Smoke-test a tarball install**

```bash
cd /tmp && mkdir test-install && cd test-install
npm install https://github.com/shirish87/browserstack-client/releases/download/v6.0.0/browserstack-client-automate-6.0.0.tgz
node -e "const { AutomateClient } = require('@browserstack-client/automate'); console.log('ok', typeof AutomateClient)"
```

Expected: `ok function`

---

## Verification Summary

After all tasks complete, confirm:

- [ ] `gh release view v6.0.0 --json assets | jq '[.assets[].name]'` lists all 18 assets (5 Go + 3 TS binaries + 8 SDK tarballs + 2 extra TS CJS files)
- [ ] Go binary runs: `./browserstack-client-linux-amd64 version` → `browserstack-client 6.0.0`
- [ ] TS binary runs: `./browserstack-client-linux-x64 version` → `browserstack-client 6.0.0`
- [ ] SDK tarball installs cleanly from the release URL
- [ ] Re-running `workflow_dispatch` with a tag input works (for hotfixes without re-tagging)
