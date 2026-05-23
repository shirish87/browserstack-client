import React, { useState } from "react";
import { Box, Text, useInput } from "ink";

export interface SelectItem {
  id: string;
  label: string;
  description?: string;
}

export function SelectList({
  items,
  title,
  onSelect,
  onBack,
}: {
  items: SelectItem[];
  title: string;
  onSelect: (item: SelectItem) => void;
  onBack?: () => void;
}) {
  const [index, setIndex] = useState(0);

  useInput((input, key) => {
    if (key.upArrow) {
      setIndex(i => (i - 1 + items.length) % items.length);
    } else if (key.downArrow) {
      setIndex(i => (i + 1) % items.length);
    } else if (key.return) {
      onSelect(items[index]);
    } else if (key.escape && onBack) {
      onBack();
    }
  });

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text bold>{title}</Text>
      </Box>
      {items.map((item, i) => (
        <Box key={item.id}>
          <Text color={i === index ? "cyan" : undefined}>
            {i === index ? "› " : "  "}
            {item.label}
          </Text>
        </Box>
      ))}
      <Box marginTop={1}>
        <Text dimColor>↑/↓ navigate · Enter select · Esc back · Ctrl-C quit</Text>
      </Box>
    </Box>
  );
}
