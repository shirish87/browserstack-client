import json
import os
import subprocess
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def _get(url: str) -> dict:
    with urllib.request.urlopen(url, timeout=10) as response:
        return json.load(response)


def _logs(hits: list[dict]) -> list[dict]:
    found = []
    for hit in hits:
        if hit["method"] == "POST" and str(hit["url"]).endswith("/logs"):
            found.extend(hit["body"].get("logs") or [])
    return found


def test_playwright_screenshot_and_session_video_are_attached():
    middleware = subprocess.Popen(
        ["node", str(ROOT / "middleware.mjs")],
        cwd=ROOT,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )
    assert middleware.stdout is not None
    completed = None
    snapshot: dict = {}
    hits: list = []
    try:
        line = middleware.stdout.readline()
        assert line, "middleware did not announce its ports"
        ports = json.loads(line)
        env = os.environ.copy()
        env.update({
            "OTEL_TRACES_EXPORTER": "otlp",
            "OTEL_METRICS_EXPORTER": "none",
            "OTEL_LOGS_EXPORTER": "none",
            "OTEL_EXPORTER_OTLP_PROTOCOL": "http/protobuf",
            "OTEL_EXPORTER_OTLP_TRACES_ENDPOINT": f"{ports['otel']}/v1/traces",
            "OTEL_EXPORTER_OTLP_INSECURE": "true",
            "OTEL_EXPORTER_OTLP_COMPRESSION": "none",
            "OTEL_SERVICE_NAME": "checkout",
            "OTEL_RESOURCE_ATTRIBUTES": "service.name=checkout",
            "PYTEST_RUN_NAME": "pw-session",
            "OTEL_BSP_SCHEDULE_DELAY": "60000",
            "OTEL_BSP_EXPORT_TIMEOUT": "30000",
        })
        completed = subprocess.run(
            [
                sys.executable,
                "-m",
                "pytest",
                "playwright_suite",
                "--export-traces",
                "--browser",
                "chromium",
                "--screenshot",
                "on",
                "--video",
                "on",
                "-p",
                "no:cacheprovider",
                "-q",
            ],
            cwd=ROOT,
            env=env,
            capture_output=True,
            text=True,
            timeout=180,
            check=False,
        )
        snapshot = _get(f"{ports['otel']}/v1/traces")
        hits = _get(f"{ports['tra']}/__requests")
    finally:
        middleware.terminate()
        try:
            middleware.wait(timeout=5)
        except subprocess.TimeoutExpired:
            middleware.kill()
        stderr = middleware.stderr.read() if middleware.stderr else ""

    detail = "\n".join([
        f"pytest exit {None if completed is None else completed.returncode}",
        "" if completed is None else completed.stdout,
        "" if completed is None else completed.stderr,
        "middleware:",
        stderr,
        "snapshot:",
        json.dumps(snapshot, indent=2),
        "hits:",
        json.dumps(hits, indent=2),
    ])
    assert completed is not None and completed.returncode == 0, detail
    traces = snapshot["traces"]
    assert len(traces) == 1, detail
    trace = traces[0]
    assert trace["exitCode"] == 0, detail
    assert trace["balanced"] is True, detail
    assert trace["pairs"]["test"]["started"] == trace["pairs"]["test"]["finished"] == 1, detail
    assert "missing-build" not in [error["code"] for error in trace["errors"]], detail

    test_starts = [hit for hit in hits if hit["method"] == "POST" and str(hit["url"]).endswith("/tests/start")]
    assert len(test_starts) == 1, detail
    assert "test_checkout_heading" in test_starts[0]["body"]["name"], detail
    test_uuid = test_starts[0]["response"]["uuid"]
    logs = _logs(hits)
    screenshots = [log for log in logs if log["kind"] == "TEST_SCREENSHOT"]
    videos = [log for log in logs if log["kind"] == "TEST_ATTACHMENT" and str(log.get("file_name", "")).endswith(".webm")]
    assert len(screenshots) >= 1, detail
    assert screenshots[0]["file_name"].endswith(".png"), detail
    assert screenshots[0]["file_size"] > 0, detail
    assert screenshots[0]["test_run_uuid"] == test_uuid, detail
    assert len(videos) == 1, detail
    assert videos[0]["file_size"] > 0, detail
    assert "test_run_uuid" not in videos[0], detail
