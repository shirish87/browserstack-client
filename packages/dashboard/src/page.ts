export const PAGE_HTML = /* html */ `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>TRA Dashboard</title>
<style>
  :root { --bg:#fff; --fg:#1b1f24; --muted:#656d76; --line:#d8dee4; --accent:#0969da; --pass:#1a7f37; --fail:#cf222e; }
  @media (prefers-color-scheme: dark) { :root { --bg:#0d1117; --fg:#e6edf3; --muted:#8d96a0; --line:#30363d; --accent:#4493f8; --pass:#3fb950; --fail:#f85149; } }
  body { margin:0; font:14px/1.5 system-ui,sans-serif; background:var(--bg); color:var(--fg); }
  header, main { max-width:1100px; margin:0 auto; padding:12px 16px; }
  header { border-bottom:1px solid var(--line); display:flex; gap:12px; align-items:center; flex-wrap:wrap; }
  h1 { font-size:16px; margin:0; }
  table { width:100%; border-collapse:collapse; }
  th, td { text-align:left; padding:6px 8px; border-bottom:1px solid var(--line); vertical-align:top; }
  a, button.link { color:var(--accent); cursor:pointer; background:none; border:0; padding:0; font:inherit; }
  .muted { color:var(--muted); } .pass { color:var(--pass); } .fail { color:var(--fail); }
  pre { background:color-mix(in srgb, var(--fg) 6%, transparent); padding:8px; overflow:auto; max-height:320px; }
  input, button { font:inherit; }
</style>
</head>
<body>
<header>
  <h1>TRA Dashboard</h1>
  <nav id="crumbs" class="muted"></nav>
</header>
<main id="view">Loading…</main>
<script type="module">
const view = document.getElementById("view");
const crumbs = document.getElementById("crumbs");
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" })[c]);
const api = async (path) => {
  const res = await fetch(path);
  const body = await res.json();
  if (!res.ok) throw new Error(body.error ?? res.statusText);
  return body;
};
const cls = (s) => (/pass|success/i.test(s ?? "") ? "pass" : /fail|error/i.test(s ?? "") ? "fail" : "muted");
const fmtMs = (ms) => (ms == null ? "" : ms < 1000 ? ms + " ms" : (ms / 1000).toFixed(1) + " s");

async function projects() {
  crumbs.textContent = "Projects";
  const data = await api("/api/projects");
  const rows = (data.projects ?? []).map((p) =>
    '<tr><td><a href="#/projects/' + esc(p.id) + '">' + esc(p.name) + '</a></td><td class="muted">' + esc(p.id) + "</td></tr>").join("");
  view.innerHTML = "<table><tr><th>Project</th><th>Id</th></tr>" + rows + "</table>";
}

async function builds(projectId) {
  crumbs.innerHTML = '<a href="#/">Projects</a> › Builds';
  const data = await api("/api/projects/" + encodeURIComponent(projectId) + "/builds");
  const rows = (data.builds ?? []).map((b) =>
    '<tr><td><a href="#/builds/' + esc(b.buildUuid ?? b.id) + '">' + esc(b.name ?? b.buildUuid ?? b.id) + '</a></td><td class="' + cls(b.status) + '">' + esc(b.status) +
    '</td><td class="muted">' + esc(b.startedAt) + "</td></tr>").join("");
  view.innerHTML = "<table><tr><th>Build</th><th>Status</th><th>Started</th></tr>" + rows + "</table>";
}

async function tests(buildId) {
  crumbs.innerHTML = '<a href="#/">Projects</a> › Build tests';
  const { tests } = await api("/api/builds/" + encodeURIComponent(buildId) + "/tests");
  const rows = tests.map((t) =>
    "<tr><td>" + esc(t.key) + '</td><td class="' + cls(t.status) + '">' + esc(t.status) + '</td><td class="muted">' + fmtMs(t.durationMs) + "</td><td>" +
    (t.sessionId ? '<a href="#/sessions/' + esc(t.sessionId) + (t.platform.device ? "?device=" + encodeURIComponent(t.platform.device) : "") + '">' + esc(t.sessionId.slice(0, 10)) + "…</a>" : '<span class="muted">none</span>') +
    "</td></tr>").join("");
  view.innerHTML = "<table><tr><th>Test</th><th>Status</th><th>Duration</th><th>Session</th></tr>" + rows + "</table>";
}

async function session(id, query) {
  crumbs.innerHTML = '<a href="#/">Projects</a> › Session';
  const linked = await api("/api/sessions/" + encodeURIComponent(id) + query);
  const s = linked.session;
  view.innerHTML = "<h2>" + esc(s.name ?? id) + '</h2><p class="muted">' + esc(linked.product) + " · " + esc(s.status) + " · " + esc(s.os) + " " + esc(s.osVersion) + "</p>" +
    (s.publicUrl ? '<p><a href="' + esc(s.publicUrl) + '" target="_blank" rel="noopener noreferrer">Open in BrowserStack</a></p>' : "") +
    '<p><button id="load">Load logs</button></p><div id="logs"></div>';
  document.getElementById("load").onclick = async () => {
    const logs = await api("/api/sessions/" + encodeURIComponent(id) + "/logs" + query);
    document.getElementById("logs").innerHTML = Object.entries(logs).map(([kind, r]) =>
      "<h3>" + esc(kind) + "</h3>" + (r.status === "ok" ? "<pre>" + esc(typeof r.data === "string" ? r.data : JSON.stringify(r.data, null, 2)) + "</pre>"
        : '<p class="muted">' + esc(r.status) + ": " + esc(r.reason ?? r.error) + "</p>")).join("");
  };
}

async function route() {
  const [hash, query = ""] = location.hash.slice(1).split("?");
  const parts = hash.split("/").filter(Boolean).map(decodeURIComponent);
  view.textContent = "Loading…";
  try {
    if (parts[0] === "projects" && parts[1]) await builds(parts[1]);
    else if (parts[0] === "builds" && parts[1]) await tests(parts[1]);
    else if (parts[0] === "sessions" && parts[1]) await session(parts[1], query ? "?" + query : "");
    else await projects();
  } catch (e) {
    view.innerHTML = '<p class="fail">' + esc(e.message) + "</p>";
  }
}
addEventListener("hashchange", route);
route();
</script>
</body>
</html>`;
