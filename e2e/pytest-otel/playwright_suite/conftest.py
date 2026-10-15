import os

import pytest
from opentelemetry import trace

_session_videos: list[str] = []


@pytest.fixture(scope="session")
def browser_type_launch_args():
    return {"args": ["--no-sandbox", "--disable-dev-shm-usage"]}


def _record(span, kind: str, path: str) -> None:
    if not getattr(span, "is_recording", lambda: False)():
        return
    if not path or not os.path.isfile(path):
        return
    span.add_event(
        "browserstack.attachment",
        {
            "browserstack.attachment.kind": kind,
            "browserstack.attachment.name": os.path.basename(path),
            "browserstack.attachment.path": path,
            "browserstack.attachment.size": os.path.getsize(path),
        },
    )


def pytest_runtest_logreport(report: pytest.TestReport) -> None:
    if report.when != "teardown":
        return
    span = trace.get_current_span()
    for name, value in report.user_properties:
        path = str(value)
        if name == "playwright_screenshot":
            _record(span, "screenshot", path)
        elif name == "playwright_video":
            _session_videos.append(path)
        elif name == "playwright_trace":
            _record(span, "trace", path)


@pytest.hookimpl(tryfirst=True)
def pytest_sessionfinish(session: pytest.Session) -> None:
    plugin = next(
        (
            candidate
            for candidate in session.config.pluginmanager.get_plugins()
            if type(candidate).__name__ == "OpenTelemetryPlugin" and hasattr(candidate, "session_span")
        ),
        None,
    )
    if plugin is None:
        return
    for path in _session_videos:
        _record(plugin.session_span, "video", path)
