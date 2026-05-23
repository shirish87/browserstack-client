import React from "react";
import { Box, Text } from "ink";
import { LOGO_ANSI } from "./logo-ansi.ts";

const BRAND = "#E84D38";

function isColorTTY(): boolean {
  if (!process.stdout.isTTY) return false;
  if (process.env.NO_COLOR) return false;
  if (process.env.TERM === "dumb") return false;
  return true;
}

export function Logo({ version }: { version?: string }) {
  if (!isColorTTY()) {
    return (
      <Box flexDirection="column" marginBottom={1}>
        <Text bold>BrowserStack CLI{version ? `  v${version}` : ""}</Text>
        <Text>{"━".repeat(40)}</Text>
      </Box>
    );
  }
  return (
    <Box flexDirection="row" marginTop={1} marginBottom={1} marginLeft={2}>
      <Text>{LOGO_ANSI}</Text>
      <Box flexDirection="column" marginLeft={2} marginTop={4}>
        <Text bold color={BRAND}>BrowserStack CLI</Text>
        {version ? <Text dimColor>v{version}</Text> : null}
      </Box>
    </Box>
  );
}
