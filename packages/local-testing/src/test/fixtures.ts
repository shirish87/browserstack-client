/**
 * Realistic sample data for Local Testing API testing
 */

export const instance = {
  id: "local-instance-123",
  pid: 5432,
  status: "connected" as const,
  public_ip: "192.0.2.1",
  local_ip: "127.0.0.1",
  created_at: "2024-04-05T12:00:00Z",
  updated_at: "2024-04-05T14:30:00Z",
};

export const instances = [
  {
    id: "local-instance-123",
    pid: 5432,
    status: "connected" as const,
    public_ip: "192.0.2.1",
    local_ip: "127.0.0.1",
    created_at: "2024-04-05T12:00:00Z",
    updated_at: "2024-04-05T14:30:00Z",
  },
  {
    id: "local-instance-124",
    pid: 5433,
    status: "connected" as const,
    public_ip: "192.0.2.2",
    local_ip: "127.0.0.1",
    created_at: "2024-04-05T13:00:00Z",
    updated_at: "2024-04-05T14:15:00Z",
  },
];

export const download = {
  content: new Uint8Array([0x50, 0x4b, 0x03, 0x04]), // ZIP file signature
  filename: "BrowserStackLocal",
};
