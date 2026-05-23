import { useState } from "react";
import { Box, Text, useInput, useStdout } from "ink";

export function Result({
  output,
  error,
  onBack,
}: {
  output: string;
  error: string | null;
  onBack: () => void;
}) {
  const [scroll, setScroll] = useState(0);
  const { stdout } = useStdout();
  const height = Math.max(10, (stdout?.rows ?? 30) - 8);

  const text = error ?? output ?? "";
  const lines = text.split("\n");
  const maxScroll = Math.max(0, lines.length - height);
  const visible = lines.slice(scroll, scroll + height);

  useInput((_input, key) => {
    if (key.escape || key.return) {
      onBack();
    } else if (key.upArrow) {
      setScroll(s => Math.max(0, s - 1));
    } else if (key.downArrow) {
      setScroll(s => Math.min(maxScroll, s + 1));
    } else if (key.pageUp) {
      setScroll(s => Math.max(0, s - height));
    } else if (key.pageDown) {
      setScroll(s => Math.min(maxScroll, s + height));
    }
  });

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text bold color={error ? "red" : "green"}>
          {error ? "✗ Error" : "✓ Result"}
        </Text>
        {lines.length > height ? (
          <Text dimColor>  ({scroll + 1}-{Math.min(scroll + height, lines.length)} / {lines.length})</Text>
        ) : null}
      </Box>
      <Box flexDirection="column" borderStyle="round" borderColor={error ? "red" : "gray"} paddingX={1}>
        {visible.map((line, i) => (
          <Text key={i} color={error ? "red" : undefined}>{line || " "}</Text>
        ))}
      </Box>
      <Box marginTop={1}>
        <Text dimColor>↑/↓ scroll · PgUp/PgDn page · Enter/Esc back</Text>
      </Box>
    </Box>
  );
}
