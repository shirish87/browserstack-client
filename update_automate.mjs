import fs from 'node:fs';
const path = 'packages/openapi/specs/automate.yml';
let content = fs.readFileSync(path, 'utf8');

const replacements = [
  {
    from: "      operationId: getAutomateProject\n",
    to: "      operationId: getAutomateProject\n      x-response-transform:\n        codec: json-unwrap\n        config:\n          path: \"$.project\"\n"
  },
  {
    from: "      operationId: getAutomateBuilds\n",
    to: "      operationId: getAutomateBuilds\n      x-response-transform:\n        codec: json-unwrap\n        config:\n          path: \"$[*].automation_build\"\n"
  },
  {
    from: "      operationId: getAutomateSessions\n",
    to: "      operationId: getAutomateSessions\n      x-response-transform:\n        codec: json-unwrap\n        config:\n          path: \"$[*].automation_session\"\n"
  },
  {
    from: "      operationId: getAutomateSession\n",
    to: "      operationId: getAutomateSession\n      x-response-transform:\n        codec: json-unwrap\n        config:\n          path: \"$.automation_session\"\n"
  },
  {
    from: "      operationId: updateAutomateSession\n",
    to: "      operationId: updateAutomateSession\n      x-response-transform:\n        codec: json-unwrap\n        config:\n          path: \"$.automation_session\"\n"
  },
  {
    from: "      operationId: getAutomateBuild\n",
    to: "      operationId: getAutomateBuild\n      x-response-transform:\n        codec: json-compose\n        config:\n          base: \"$.build.automation_build\"\n          merge:\n            sessions: \"$.build.sessions[*].automation_session\"\n"
  },
  {
    from: "      operationId: getAutomateProjectBadgeKey\n",
    to: "      operationId: getAutomateProjectBadgeKey\n      x-response-transform:\n        codec: text\n"
  },
  {
    from: "      operationId: getAutomateSessionAppiumLogs\n",
    to: "      operationId: getAutomateSessionAppiumLogs\n      x-response-transform:\n        codec: text\n"
  },
  {
    from: "      operationId: getAutomateSessionLogs\n",
    to: "      operationId: getAutomateSessionLogs\n      x-response-transform:\n        codec: text\n"
  },
  {
    from: "      operationId: getAutomateSessionSeleniumLogs\n",
    to: "      operationId: getAutomateSessionSeleniumLogs\n      x-response-transform:\n        codec: text\n"
  },
  {
    from: "      operationId: getAutomateSessionConsoleLogs\n",
    to: "      operationId: getAutomateSessionConsoleLogs\n      x-response-transform:\n        codec: text\n"
  },
  {
    from: "      operationId: getAutomateSessionTelemetryLogs\n",
    to: "      operationId: getAutomateSessionTelemetryLogs\n      x-response-transform:\n        codec: binary\n"
  },
  {
    from: "      operationId: uploadAutomateSessionTerminalLogs\n",
    to: "      operationId: uploadAutomateSessionTerminalLogs\n      x-request-custom: true\n      x-response-custom: true\n"
  },
  {
    from: "      operationId: uploadAutomateBuildTerminalLogs\n",
    to: "      operationId: uploadAutomateBuildTerminalLogs\n      x-request-custom: true\n      x-response-custom: true\n"
  },
  {
    from: "      operationId: uploadAutomateMediaFile\n",
    to: "      operationId: uploadAutomateMediaFile\n      x-request-custom: true\n      x-response-custom: true\n"
  }
];

for (const r of replacements) {
  content = content.replace(r.from, r.to);
}

fs.writeFileSync(path, content);
