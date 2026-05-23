import { useState, useEffect, useMemo } from "react";
import { Box, Text, useInput, useStdout } from "ink";
import fuzzysort from "fuzzysort";
import type { PickerConfig } from "../tui-types.ts";
import { fetchPickerItemsForAction, type PickerItem } from "./pickers.ts";

export function PickerOverlay({
  picker,
  fieldLabel,
  filterValues,
  onSelect,
  onCancel,
}: {
  picker: PickerConfig;
  fieldLabel: string;
  filterValues: Record<string, string>;
  onSelect: (value: string) => void;
  onCancel: () => void;
}) {
  const [items, setItems] = useState<PickerItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const { stdout } = useStdout();

  useEffect(() => {
    let cancelled = false;
    fetchPickerItemsForAction(picker, filterValues)
      .then(list => {
        if (cancelled) return;
        if (list.length === 0) {
          setError("No items returned. Check credentials and any filter values, or just type the value directly.");
        }
        setItems(list);
      })
      .catch(e => {
        if (!cancelled) setError(String(e?.message ?? e));
      });
    return () => { cancelled = true; };
  }, [picker.source, JSON.stringify(filterValues)]);

  const filtered = useMemo(() => {
    if (!items) return [];
    if (!query.trim()) return items;
    const results = fuzzysort.go(query, items, { keys: ["label"], limit: 200, threshold: -10000 });
    return results.map(r => r.obj);
  }, [items, query]);

  useEffect(() => {
    if (index >= filtered.length) setIndex(Math.max(0, filtered.length - 1));
  }, [filtered.length, index]);

  useInput((input, key) => {
    if (key.escape) {
      onCancel();
      return;
    }
    if (key.return) {
      const sel = filtered[index];
      if (sel) onSelect(sel.value);
      return;
    }
    if (key.upArrow) {
      setIndex(i => Math.max(0, i - 1));
      return;
    }
    if (key.downArrow) {
      setIndex(i => Math.min(filtered.length - 1, i + 1));
      return;
    }
    if (key.pageUp) {
      setIndex(i => Math.max(0, i - 10));
      return;
    }
    if (key.pageDown) {
      setIndex(i => Math.min(filtered.length - 1, i + 10));
      return;
    }
    if (key.backspace || key.delete) {
      setQuery(q => q.slice(0, -1));
      return;
    }
    if (input && !key.ctrl && !key.meta) {
      setQuery(q => q + input);
    }
  });

  const visibleCount = Math.max(5, (stdout?.rows ?? 30) - 12);
  const start = Math.max(0, Math.min(index - Math.floor(visibleCount / 2), filtered.length - visibleCount));
  const visible = filtered.slice(start, start + visibleCount);

  return (
    <Box flexDirection="column" borderStyle="round" borderColor="cyan" paddingX={1}>
      <Box>
        <Text bold>Pick {fieldLabel}</Text>
        <Text dimColor>  ({filtered.length}{items ? ` of ${items.length}` : ""})</Text>
      </Box>
      <Box marginTop={1}>
        <Text>{"> "}</Text>
        <Text>{query}</Text>
        <Text color="cyan">▎</Text>
      </Box>
      <Box flexDirection="column" marginTop={1}>
        {!items ? (
          <Text dimColor>Loading…</Text>
        ) : error && filtered.length === 0 ? (
          <Text color="red">{error}</Text>
        ) : filtered.length === 0 ? (
          <Text dimColor>No matches.</Text>
        ) : (
          visible.map((item, i) => {
            const absoluteIdx = start + i;
            const focused = absoluteIdx === index;
            return (
              <Box key={`${item.value}-${absoluteIdx}`}>
                <Text color={focused ? "cyan" : undefined}>
                  {focused ? "› " : "  "}
                  {item.label}
                </Text>
              </Box>
            );
          })
        )}
      </Box>
      <Box marginTop={1}>
        <Text dimColor>Type to filter · ↑/↓ navigate · Enter select · Esc cancel</Text>
      </Box>
    </Box>
  );
}
