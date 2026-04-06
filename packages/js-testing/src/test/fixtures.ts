/**
 * Realistic sample data for JS Testing API testing
 */

export const status = {
  status: "ok",
  limits: {
    total_workers: 10,
    concurrent_workers: 5,
  },
  usage: {
    total_workers: 2,
    concurrent_workers: 1,
  },
};

export const browsers = [
  {
    browser: "Chrome",
    browser_version: "120.0",
    os: "Windows",
    os_version: "10",
  },
  {
    browser: "Firefox",
    browser_version: "121.0",
    os: "Windows",
    os_version: "10",
  },
  {
    browser: "Safari",
    browser_version: "17.2",
    os: "OS X",
    os_version: "14.2",
  },
];

export const worker = {
  id: 1001,
  status: "running" as const,
  browser: "Chrome",
  browser_version: "120.0",
  os: "Windows",
  os_version: "10",
  created_at: "2024-04-05T12:00:00Z",
};

export const runningWorker = {
  id: 1001,
  status: "running" as const,
  browser: "Chrome",
  browser_version: "120.0",
  os: "Windows",
  os_version: "10",
  created_at: "2024-04-05T12:00:00Z",
};

export const workers = [
  {
    id: 1001,
    status: "running" as const,
    browser: "Chrome",
    browser_version: "120.0",
    os: "Windows",
    os_version: "10",
    created_at: "2024-04-05T12:00:00Z",
  },
  {
    id: 1002,
    status: "running" as const,
    browser: "Firefox",
    browser_version: "121.0",
    os: "Windows",
    os_version: "10",
    created_at: "2024-04-05T12:05:00Z",
  },
];

export const screenshot = new ArrayBuffer(1024);

export const launchedWorker = {
  id: 1001,
  status: "running" as const,
  browser: "Chrome",
  browser_version: "120.0",
  os: "Windows",
  os_version: "10",
  created_at: "2024-04-05T12:00:00Z",
  updateURL: vi.fn(),
  getScreenshot: vi.fn(),
  getScreenshotURL: vi.fn(),
  terminate: vi.fn(),
};

// Dummy vi for fixture
const vi = { fn: () => Promise.resolve() };
