import json
import os
import subprocess
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
AUTH = "Basic dXNlcjprZXk="


def _get(url: str) -> dict:
    with urllib.request.urlopen(url, timeout=10) as response:
        return json.load(response)


def _failure_text(body: dict) -> str:
    parts = []
    for failure in body.get("failure") or []:
        parts.append(str(failure.get("error") or ""))
        parts.append(str(failure.get("backtrace") or ""))
    return "\n".join(parts)


def test_pytest_opentelemetry_exports_a_balanced_run():
    middleware = subprocess.Popen(
        ["node", str(ROOT / "middleware.mjs")],
        cwd=ROOT,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )
    assert middleware.stdout is not None
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
            "PYTEST_RUN_NAME": "pr-18",
            "OTEL_BSP_SCHEDULE_DELAY": "60000",
            "OTEL_BSP_EXPORT_TIMEOUT": "30000",
        })
        completed = subprocess.run(
            [sys.executable, "-m", "pytest", "suite", "--export-traces", "-p", "no:cacheprovider", "-q"],
            cwd=ROOT,
            env=env,
            capture_output=True,
            text=True,
            timeout=60,
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
        f"pytest exit {completed.returncode}",
        completed.stdout,
        completed.stderr,
        "middleware:",
        stderr,
        "snapshot:",
        json.dumps(snapshot, indent=2),
        "hits:",
        json.dumps(hits, indent=2),
    ])
    assert completed.returncode == 1, detail

    traces = snapshot["traces"]
    assert len(traces) == 1, detail
    trace = traces[0]
    assert trace["exitCode"] == 1, detail
    assert trace["balanced"] is True, detail
    assert trace["closed"] is True, detail
    assert trace["pairs"]["build"] == {"started": 1, "finished": 1}, detail
    assert trace["pairs"]["test"] == {"started": 2, "finished": 2}, detail
    assert trace["pairs"]["hook"]["started"] == trace["pairs"]["hook"]["finished"], detail
    assert trace["pairs"]["hook"]["started"] >= 1, detail
    assert trace["pairs"]["step"]["started"] == trace["pairs"]["step"]["finished"], detail
    codes = [error["code"] for error in trace["errors"]]
    for code in ("tra_start_failed", "missing-build", "missing-start", "parent-end"):
        assert code not in codes, detail

    assert all(hit["auth"] == AUTH for hit in hits), detail
    build_starts = [hit for hit in hits if hit["method"] == "POST" and hit["url"] == "/builds/start"]
    build_finishes = [hit for hit in hits if hit["method"] == "PUT" and hit["url"] == "/builds/bld_1/finish"]
    assert len(build_starts) == 1 and len(build_finishes) == 1, detail
    assert build_starts[0]["body"]["name"] == "pr-18", detail
    assert build_starts[0]["body"]["project_name"] == "checkout", detail
    assert build_starts[0]["body"]["framework"]["name"] == "pytest", detail
    assert "started_at" in build_starts[0]["body"], detail

    test_starts = [hit for hit in hits if hit["method"] == "POST" and str(hit["url"]).endswith("/tests/start")]
    test_finishes = [hit for hit in hits if hit["method"] == "PUT" and "/tests/" in str(hit["url"]) and str(hit["url"]).endswith("/finish")]
    names = sorted(hit["body"]["name"] for hit in test_starts)
    assert names == ["test_login_rejects_bad_password", "test_login_succeeds"], detail
    assert all("::call" not in hit["body"]["name"] for hit in test_starts), detail
    assert all(str(hit["body"]["file_name"]).endswith("test_login.py") for hit in test_starts), detail
    assert all(hit["body"].get("scopes") for hit in test_starts), detail
    results = sorted(hit["body"]["result"] for hit in test_finishes)
    assert results == ["failed", "passed"], detail
    failed = next(hit for hit in test_finishes if hit["body"]["result"] == "failed")
    assert "bad password rejected" in _failure_text(failed["body"]), detail
    error_logs = [
        log for hit in hits
        if hit["method"] == "POST" and str(hit["url"]).endswith("/logs")
        for log in (hit["body"].get("logs") or [])
        if log.get("level") == "ERROR" and log.get("failure") is True
    ]
    assert any("bad password rejected" in str(log.get("message")) for log in error_logs), detail
    assert any(str(log.get("test_run_uuid")) for log in error_logs), detail

    hook_starts = [hit for hit in hits if hit["method"] == "POST" and str(hit["url"]).endswith("/hooks/start")]
    hook_finishes = [hit for hit in hits if hit["method"] == "PUT" and "/hooks/" in str(hit["url"]) and str(hit["url"]).endswith("/finish")]
    assert len(hook_starts) == len(hook_finishes) >= 1, detail
    assert all("hook_type" in hit["body"] and "file_name" in hit["body"] for hit in hook_starts), detail
    assert all("::call" not in hit["body"]["name"] for hit in hook_starts), detail
