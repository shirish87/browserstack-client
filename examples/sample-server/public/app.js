import { AutomateClient } from "/sdk/automate.js";

const form = document.getElementById("creds-form");
const usernameInput = document.getElementById("username");
const accessKeyInput = document.getElementById("access-key");
const statusEl = document.getElementById("status");
const resultsEl = document.getElementById("results");

function createRouterMiddleware(username, accessKey) {
  return async function routerMiddleware(req, next) {
    return next({
      ...req,
      url: `/gateway?url=${encodeURIComponent(req.url)}`,
      headers: {
        ...req.headers,
        "x-browserstack-username": username,
        "x-browserstack-access-key": accessKey,
      },
    });
  };
}

function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.classList.toggle("error", isError);
}

function clearResults() {
  resultsEl.replaceChildren();
}

function renderSessionsTable(sessions) {
  const table = document.createElement("table");

  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  for (const heading of ["Session", "Status", "Duration", "Browser / OS"]) {
    const th = document.createElement("th");
    th.textContent = heading;
    headerRow.appendChild(th);
  }
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  for (const session of sessions) {
    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.textContent = session.name || session.hashedId;
    row.appendChild(nameCell);

    const statusCell = document.createElement("td");
    const badge = document.createElement("span");
    badge.className = `badge badge-${session.status}`;
    badge.textContent = session.status;
    statusCell.appendChild(badge);
    row.appendChild(statusCell);

    const durationCell = document.createElement("td");
    durationCell.textContent = `${session.duration}s`;
    row.appendChild(durationCell);

    const platformCell = document.createElement("td");
    platformCell.textContent = [
      [session.browser, session.browserVersion].filter(Boolean).join(" "),
      [session.os, session.osVersion].filter(Boolean).join(" "),
    ].filter(Boolean).join(" / ");
    row.appendChild(platformCell);

    tbody.appendChild(row);
  }
  table.appendChild(tbody);

  return table;
}

function renderBuilds(buildsWithSessions) {
  clearResults();

  if (buildsWithSessions.length === 0) {
    setStatus("No builds found for this account.");
    return;
  }

  for (const { build, sessions } of buildsWithSessions) {
    const card = document.createElement("div");
    card.className = "card";

    const title = document.createElement("h3");
    title.textContent = `${build.name} - ${build.status} (${build.duration}s)`;
    card.appendChild(title);

    if (sessions.length === 0) {
      const empty = document.createElement("p");
      empty.textContent = "No sessions in this build.";
      card.appendChild(empty);
    } else {
      card.appendChild(renderSessionsTable(sessions));
    }

    resultsEl.appendChild(card);
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = usernameInput.value.trim();
  const accessKey = accessKeyInput.value.trim();

  if (!username || !accessKey) {
    setStatus("Enter both your BrowserStack username and access key.", true);
    return;
  }

  clearResults();
  setStatus("Loading builds and sessions...");

  const client = new AutomateClient({
    middleware: [createRouterMiddleware(username, accessKey)],
  });

  try {
    const builds = await client.getBuilds(undefined, "10");
    const buildsWithSessions = await Promise.all(
      builds.map(async (build) => ({
        build,
        sessions: await client.getSessions(build.hashedId, "25"),
      }))
    );

    setStatus(`Loaded ${builds.length} build(s).`);
    renderBuilds(buildsWithSessions);
  } catch (error) {
    setStatus(error instanceof Error ? error.message : "Failed to load sessions.", true);
  }
});
