// Package contract checks that the generated Go types match real API responses.
//
// The fixtures are captured from the live APIs (see packages/contract-tests) and shared with the
// TypeScript contract tests. Decoding with DisallowUnknownFields makes any field the OpenAPI spec
// does not model a test failure, which is how API drift is noticed on the Go side.
package contract

import (
	"bytes"
	"encoding/json"
	"os"
	"path/filepath"
	"testing"

	appautomate "github.com/browserstack/browserstack-client/generated/app-automate"
	"github.com/browserstack/browserstack-client/generated/automate"
	testreporting "github.com/browserstack/browserstack-client/generated/test-reporting"
)

func fixture(t *testing.T, name string) []byte {
	t.Helper()
	b, err := os.ReadFile(filepath.Join("..", "..", "..", "..", "contract-tests", "fixtures", name))
	if err != nil {
		t.Fatalf("read fixture %s: %v", name, err)
	}
	return b
}

func decodeStrict(t *testing.T, name string, into any) {
	t.Helper()
	dec := json.NewDecoder(bytes.NewReader(fixture(t, name)))
	dec.DisallowUnknownFields()
	if err := dec.Decode(into); err != nil {
		t.Fatalf("%s does not match the generated Go types: %v", name, err)
	}
}

func TestTestReportingFixturesMatchGeneratedTypes(t *testing.T) {
	var builds testreporting.BuildListResponse
	decodeStrict(t, "tra-build-list.json", &builds)
	if len(builds.Builds) == 0 {
		t.Fatal("expected builds in the list fixture")
	}

	var details testreporting.BuildDetails
	decodeStrict(t, "tra-build-details.json", &details)
	if details.Duration == nil || *details.Duration < 1000 {
		t.Fatalf("build duration should be in milliseconds, got %v", details.Duration)
	}

	for _, name := range []string{
		"tra-test-runs-playwright.json", "tra-test-runs-selenium.json", "tra-test-runs-final-page.json",
		"tra-test-runs-diverse-page1.json", "tra-test-runs-diverse-page2.json", "tra-test-runs-diverse-page3.json",
	} {
		var runs testreporting.TestRunsResponse
		decodeStrict(t, name, &runs)
	}
}

func TestTestTreeIsTypedEndToEnd(t *testing.T) {
	var runs testreporting.TestRunsResponse
	decodeStrict(t, "tra-test-runs-selenium.json", &runs)

	root := runs.Hierarchy[0]
	if root.Type == nil || *root.Type != "ROOT" {
		t.Fatalf("expected a ROOT node, got %v", root.Type)
	}
	group := root.Children[0]
	if group.Type == nil || *group.Type != "DESCRIBE" || group.Details != nil {
		t.Fatalf("expected a DESCRIBE node with null details, got %+v", group)
	}
	var failed *testreporting.TestRunNode
	for i := range group.Children {
		if d := group.Children[i].Details; d != nil && d.Status != nil && *d.Status == "failed" {
			failed = &group.Children[i]
		}
	}
	if failed == nil {
		t.Fatal("expected a failed test in the fixture")
	}
	if len(failed.Details.Retries) == 0 || len(failed.Details.Retries[0].Logs.TESTFAILURE) == 0 {
		t.Fatal("expected the failed test's first attempt to carry TEST_FAILURE log lines")
	}
}

func TestAutomateFixturesMatchGeneratedTypes(t *testing.T) {
	var session automate.AutomateSessionContainer
	decodeStrict(t, "automate-session-playwright.json", &session)

	var builds []struct {
		AutomationBuild automate.AutomateBuild `json:"automation_build"`
	}
	decodeStrict(t, "automate-builds.json", &builds)
	if len(builds) == 0 {
		t.Fatal("expected builds in the fixture")
	}
}

func TestHarFixtureMatchesGeneratedTypes(t *testing.T) {
	var har automate.HarArchive
	decodeStrict(t, "automate-network-logs.har.json", &har)
	if har.Log == nil || len(har.Log.Entries) == 0 || har.Log.Entries[0].Request == nil {
		t.Fatal("expected HAR entries with requests")
	}
}

// A test's details.session_id is the Automate session hashed_id: the TRA -> Automate join.
func TestTraSessionIdIsTheAutomateSessionId(t *testing.T) {
	var runs testreporting.TestRunsResponse
	decodeStrict(t, "tra-test-runs-playwright.json", &runs)
	var session automate.AutomateSessionContainer
	decodeStrict(t, "automate-session-playwright.json", &session)

	var ids []string
	for _, root := range runs.Hierarchy {
		for _, test := range root.Children {
			if test.Details != nil && test.Details.SessionId != nil {
				ids = append(ids, *test.Details.SessionId)
			}
		}
	}
	if len(ids) < 2 {
		t.Fatalf("expected at least two tests with a session id, got %d", len(ids))
	}
	for _, id := range ids {
		if id != session.AutomationSession.HashedId {
			t.Fatalf("session id %q does not match the Automate session %q", id, session.AutomationSession.HashedId)
		}
	}
}

func TestAppAutomateFixturesMatchGeneratedTypes(t *testing.T) {
	var session appautomate.AppAutomateSessionContainer
	decodeStrict(t, "app-automate-session.json", &session)
	if session.AutomationSession.DeviceLogsUrl == nil || session.AutomationSession.Browser != nil {
		t.Fatalf("expected a mobile session: device_logs_url set and browser null, got %+v", session.AutomationSession)
	}

	var sessions []appautomate.AppAutomateSessionContainer
	decodeStrict(t, "app-automate-sessions.json", &sessions)
	if len(sessions) != 3 {
		t.Fatalf("expected 3 sessions in the build, got %d", len(sessions))
	}

	var build struct {
		Build appautomate.AppAutomateBuildContainer `json:"build"`
	}
	decodeStrict(t, "app-automate-build.json", &build)

	var runs testreporting.TestRunsResponse
	decodeStrict(t, "tra-test-runs-appium.json", &runs)
	if d := runs.Hierarchy[0].Details; d == nil || d.Device == nil || *d.Device != "Google Pixel 7" {
		t.Fatalf("expected the mobile root to name its device, got %+v", d)
	}
}
