/**
 * Realistic sample data for Screenshots API testing
 */

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

export const job = {
  id: "ss-job-123",
  job_id: "ss-job-123",
  state: "done" as const,
  screenshots: [
    {
      id: "ss-001",
      state: "done" as const,
      url: "https://api.browserstack.com/screenshots/ss-001.png",
      browser: "Chrome",
      browser_version: "120.0",
      os: "Windows",
      os_version: "10",
    },
    {
      id: "ss-002",
      state: "done" as const,
      url: "https://api.browserstack.com/screenshots/ss-002.png",
      browser: "Safari",
      browser_version: "17.2",
      os: "OS X",
      os_version: "14.2",
    },
  ],
  created_at: "2024-04-05T12:00:00Z",
};

export const screenshots = [
  {
    id: "ss-001",
    state: "done" as const,
    url: "https://api.browserstack.com/screenshots/ss-001.png",
    browser: "Chrome",
    browser_version: "120.0",
    os: "Windows",
    os_version: "10",
  },
  {
    id: "ss-002",
    state: "done" as const,
    url: "https://api.browserstack.com/screenshots/ss-002.png",
    browser: "Safari",
    browser_version: "17.2",
    os: "OS X",
    os_version: "14.2",
  },
];
