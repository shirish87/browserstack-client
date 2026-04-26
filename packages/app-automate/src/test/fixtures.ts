/**
 * Realistic sample data for App Automate API testing
 */

export const plan = {
  parallel_sessions_max_allowed: 10,
  parallel_sessions_running: 2,
  queued_sessions: 0,
  devices_max_allowed: 50,
  devices_running: 5,
  team_parallel_sessions_max_allowed: 20,
  team_parallel_sessions_running: 3,
};

export const badgeKey =
  "abc123def456ghi789jkl012mno345pqr678stu901vwx234yz";

export const devices = [
  {
    device: "iPhone 15",
    os: "iOS",
    os_version: "17.2",
  },
  {
    device: "Pixel 8 Pro",
    os: "Android",
    os_version: "14.0",
  },
  {
    device: "Samsung Galaxy S24",
    os: "Android",
    os_version: "14.0",
  },
];

export const projects = [
  {
    id: 12345,
    name: "Mobile App Test 1",
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-04-05T14:20:00Z",
    build_count: 28,
  },
  {
    id: 12346,
    name: "Mobile App Test 2",
    created_at: "2024-02-20T08:15:00Z",
    updated_at: "2024-04-04T16:45:00Z",
    build_count: 12,
  },
];

export const project = {
  id: 12345,
  name: "Mobile App Test 1",
  created_at: "2024-01-15T10:30:00Z",
  updated_at: "2024-04-05T14:20:00Z",
  build_count: 28,
};

export const builds = [
  {
    automation_build: {
      id: 3001,
      name: "App Build #1",
      status: "done" as const,
      hashed_id: "app001",
      created_at: "2024-04-05T12:00:00Z",
      updated_at: "2024-04-05T12:15:00Z",
    },
  },
];

export const build = {
  id: 3001,
  name: "App Build #1",
  status: "done" as const,
  hashed_id: "app001",
  created_at: "2024-04-05T12:00:00Z",
  updated_at: "2024-04-05T12:15:00Z",
  sessions: [
    {
      id: 4001,
      hashed_id: "appsess001",
      status: "done" as const,
      device: "iPhone 15",
      device_version: "17.2",
      os: "iOS",
      os_version: "17.2",
      created_at: "2024-04-05T12:00:00Z",
      updated_at: "2024-04-05T12:15:00Z",
      duration: 240,
    },
  ],
};

export const sessions = [
  {
    automation_session: {
      id: 4001,
      hashed_id: "appsess001",
      status: "done" as const,
      device: "iPhone 15",
      device_version: "17.2",
      os: "iOS",
      os_version: "17.2",
      created_at: "2024-04-05T12:00:00Z",
      updated_at: "2024-04-05T12:15:00Z",
      duration: 240,
    },
  },
];

export const session = {
  id: 4001,
  hashed_id: "appsess001",
  status: "done" as const,
  device: "iPhone 15",
  device_version: "17.2",
  os: "iOS",
  os_version: "17.2",
  created_at: "2024-04-05T12:00:00Z",
  updated_at: "2024-04-05T12:15:00Z",
  duration: 240,
};

export const logs = `[info] App session started
[debug] Executing test steps
[info] Test completed successfully`;

export const deviceLogs = `Device log: App launched
Device log: Screen captured
Device log: Test completed`;

export const appiumLogs = `[INFO] Appium server started
[INFO] iOS device connected
[INFO] App installed and launched
[INFO] Session created successfully`;

export const networkLogs = {
  requests: [
    {
      method: "GET",
      url: "https://api.example.com/data",
      status: 200,
      duration: 200,
    },
  ],
};

export const profilingDataV1 = {
  cpu: [
    { timestamp: 1712325600000, value: 35.2 },
    { timestamp: 1712325610000, value: 42.5 },
  ],
  memory: [
    { timestamp: 1712325600000, value: 256.0 },
    { timestamp: 1712325610000, value: 280.5 },
  ],
};

export const profilingDataV2 = {
  cpu_usage: 38.5,
  memory_usage: 268.2,
  fps: 59.8,
  battery_drain: 1.2,
};

export const mediaFile = {
  id: "appmedia123",
  custom_id: "my-app-video",
  mime_type: "video/mp4",
  size: 10485760,
  created_at: "2024-04-05T12:00:00Z",
  expires_at: "2024-05-05T12:00:00Z",
};

export const mediaFiles = [
  {
    id: "appmedia123",
    custom_id: "my-app-video",
    mime_type: "video/mp4",
    size: 10485760,
    created_at: "2024-04-05T12:00:00Z",
    expires_at: "2024-05-05T12:00:00Z",
  },
];

export const appiumApp = {
  app_id: "bs://app123456",
  custom_id: "my-app",
  app_url: "https://browserstack.com/app/ios/upload/bs://app123456",
  app_name: "TestApp.ipa",
  uploaded_at: "2024-04-05T12:00:00Z",
  expires_at: "2024-05-05T12:00:00Z",
};

export const appiumApps = [
  {
    app_id: "bs://app123456",
    custom_id: "my-app",
    app_url: "https://browserstack.com/app/ios/upload/bs://app123456",
    app_name: "TestApp.ipa",
    uploaded_at: "2024-04-05T12:00:00Z",
    expires_at: "2024-05-05T12:00:00Z",
  },
];
