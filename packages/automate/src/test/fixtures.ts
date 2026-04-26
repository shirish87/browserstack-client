/**
 * Realistic sample data for Automate API testing
 */

export const plan = {
  parallel_sessions_max_allowed: 10,
  parallel_sessions_running: 2,
  queued_sessions: 0,
  browsers_max_allowed: 100,
  browsers_running: 5,
  team_parallel_sessions_max_allowed: 20,
  team_parallel_sessions_running: 3,
};

export const recycleKeyResponse = {
  message: "Key recycled successfully",
};

export const badgeKey =
  "abc123def456ghi789jkl012mno345pqr678stu901vwx234yz";

export const browsers = [
  {
    os: "Windows",
    os_version: "10",
    browser: "Chrome",
    browser_version: "120.0",
  },
  {
    os: "OS X",
    os_version: "14.2",
    browser: "Safari",
    browser_version: "17.2",
  },
  {
    os: "Linux",
    os_version: "20.04",
    browser: "Firefox",
    browser_version: "121.0",
  },
];

export const projects = [
  {
    id: 12345,
    name: "Test Project 1",
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-04-05T14:20:00Z",
    build_count: 42,
  },
  {
    id: 12346,
    name: "Test Project 2",
    created_at: "2024-02-20T08:15:00Z",
    updated_at: "2024-04-04T16:45:00Z",
    build_count: 18,
  },
];

export const project = {
  id: 12345,
  name: "Test Project 1",
  created_at: "2024-01-15T10:30:00Z",
  updated_at: "2024-04-05T14:20:00Z",
  build_count: 42,
};

export const builds = [
  {
    automation_build: {
      id: 1001,
      name: "Build #1",
      status: "done" as const,
      hashed_id: "abc123def456",
      created_at: "2024-04-05T12:00:00Z",
      updated_at: "2024-04-05T12:15:00Z",
    },
  },
  {
    automation_build: {
      id: 1002,
      name: "Build #2",
      status: "running" as const,
      hashed_id: "xyz789uvw456",
      created_at: "2024-04-05T13:00:00Z",
      updated_at: "2024-04-05T13:30:00Z",
    },
  },
];

export const build = {
  id: 1001,
  name: "Build #1",
  status: "done" as const,
  hashed_id: "abc123def456",
  created_at: "2024-04-05T12:00:00Z",
  updated_at: "2024-04-05T12:15:00Z",
  sessions: [
    {
      id: 2001,
      hashed_id: "sess001",
      status: "done" as const,
      browser: "Chrome",
      browser_version: "120.0",
      os: "Windows",
      os_version: "10",
      created_at: "2024-04-05T12:00:00Z",
      updated_at: "2024-04-05T12:15:00Z",
      duration: 180,
    },
  ],
};

export const sessions = [
  {
    automation_session: {
      id: 2001,
      hashed_id: "sess001",
      status: "done" as const,
      browser: "Chrome",
      browser_version: "120.0",
      os: "Windows",
      os_version: "10",
      created_at: "2024-04-05T12:00:00Z",
      updated_at: "2024-04-05T12:15:00Z",
      duration: 180,
      logs: {
        console_logs_url: "https://api-cloud.browserstack.com/...console",
        network_logs_url: "https://api-cloud.browserstack.com/...network",
        selenium_logs_url: "https://api-cloud.browserstack.com/...selenium",
      },
    },
  },
];

export const session = {
  id: 2001,
  hashed_id: "sess001",
  status: "done" as const,
  browser: "Chrome",
  browser_version: "120.0",
  os: "Windows",
  os_version: "10",
  created_at: "2024-04-05T12:00:00Z",
  updated_at: "2024-04-05T12:15:00Z",
  duration: 180,
  logs: {
    console_logs_url: "https://api-cloud.browserstack.com/...console",
    network_logs_url: "https://api-cloud.browserstack.com/...network",
    selenium_logs_url: "https://api-cloud.browserstack.com/...selenium",
  },
};

export const logs = `[info] Session started
[debug] Executing test steps
[info] Test completed successfully`;

export const networkLogs = {
  requests: [
    {
      method: "GET",
      url: "https://example.com",
      status: 200,
      duration: 150,
    },
  ],
};

export const consoleLogs = `console.log: Test message
console.error: Warning message
console.info: Info message`;

export const seleniumLogs = `[INFO] Building new session for capabilities: ...
[INFO] Session created: abc123
[INFO] Command: GET /session/abc123
[INFO] Command completed in 100ms`;

export const appiumLogs = `[info] Appium server started
[debug] Device connected
[info] App launched successfully`;

export const telemetryLogs = {
  cpu_usage: [
    { timestamp: 1712325600000, value: 25.5 },
    { timestamp: 1712325610000, value: 28.3 },
  ],
  memory_usage: [
    { timestamp: 1712325600000, value: 512.0 },
    { timestamp: 1712325610000, value: 520.5 },
  ],
};

export const mediaFile = {
  id: "media123",
  custom_id: "my-file",
  mime_type: "video/mp4",
  size: 5242880,
  created_at: "2024-04-05T12:00:00Z",
  expires_at: "2024-05-05T12:00:00Z",
};

export const mediaFiles = [
  {
    id: "media123",
    custom_id: "my-file",
    mime_type: "video/mp4",
    size: 5242880,
    created_at: "2024-04-05T12:00:00Z",
    expires_at: "2024-05-05T12:00:00Z",
  },
  {
    id: "media124",
    custom_id: "another-file",
    mime_type: "image/png",
    size: 1024000,
    created_at: "2024-04-04T12:00:00Z",
    expires_at: "2024-05-04T12:00:00Z",
  },
];
