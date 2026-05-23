import React from "react";
import { Box, Text } from "ink";

export function Logo({ version }: { version?: string }) {
  return (
    <Box flexDirection="column" marginBottom={1}>
      <Text bold color="#E84D38">BrowserStack CLI</Text>
      {version ? <Text dimColor>v{version}</Text> : null}
      <Text dimColor>─────────────────────────</Text>
    </Box>
  );
}
