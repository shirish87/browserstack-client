import React, { useState, useEffect, useMemo } from "react";
import { Box, Text, useInput, useStdout } from "ink";
import fuzzysort from "fuzzysort";

export interface SelectItem {
  id: string;
  label: string;
  description?: string;
  /** When true, the row is rendered as a section header and is not selectable. */
  header?: boolean;
}

function firstSelectableIndex(items: SelectItem[]): number {
  return items.findIndex(it => !it.header);
}

function nextSelectable(items: SelectItem[], from: number, dir: 1 | -1): number {
  const n = items.length;
  if (n === 0) return -1;
  let i = from;
  for (let k = 0; k < n; k++) {
    i = (i + dir + n) % n;
    if (!items[i].header) return i;
  }
  return from;
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
  const [query, setQuery] = useState("");
  const [filtering, setFiltering] = useState(false);
  const { stdout } = useStdout();

  // Filtered items (preserves headers when their section has any visible item)
  const filteredItems = useMemo<SelectItem[]>(() => {
    const q = query.trim();
    if (!q) return items;
    const selectable = items.filter(it => !it.header);
    const results = fuzzysort.go(q, selectable, { keys: ["label"], limit: 500, threshold: -10000 });
    const matched = new Set(results.map(r => r.obj.id));
    const out: SelectItem[] = [];
    let lastHeader: SelectItem | null = null;
    let lastHeaderEmitted = false;
    for (const it of items) {
      if (it.header) {
        lastHeader = it;
        lastHeaderEmitted = false;
        continue;
      }
      if (!matched.has(it.id)) continue;
      if (lastHeader && !lastHeaderEmitted) {
        out.push(lastHeader);
        lastHeaderEmitted = true;
      }
      out.push(it);
    }
    return out;
  }, [items, query]);

  const [index, setIndex] = useState(() => Math.max(0, firstSelectableIndex(items)));

  // Whenever the filtered list changes, keep focus on a selectable item.
  useEffect(() => {
    if (filteredItems.length === 0) return;
    if (index >= filteredItems.length || filteredItems[index]?.header) {
      const next = firstSelectableIndex(filteredItems);
      setIndex(next < 0 ? 0 : next);
    }
  }, [filteredItems, index]);

  useInput((input, key) => {
    // Esc: when filtering, exit filter mode; otherwise go back
    if (key.escape) {
      if (filtering || query) {
        setFiltering(false);
        setQuery("");
        setIndex(Math.max(0, firstSelectableIndex(items)));
      } else if (onBack) {
        onBack();
      }
      return;
    }

    if (key.upArrow) {
      setIndex(i => nextSelectable(filteredItems, i, -1));
      return;
    }
    if (key.downArrow) {
      setIndex(i => nextSelectable(filteredItems, i, 1));
      return;
    }
    if (key.pageUp) {
      setIndex(i => {
        let cur = i;
        for (let k = 0; k < 10; k++) cur = nextSelectable(filteredItems, cur, -1);
        return cur;
      });
      return;
    }
    if (key.pageDown) {
      setIndex(i => {
        let cur = i;
        for (let k = 0; k < 10; k++) cur = nextSelectable(filteredItems, cur, 1);
        return cur;
      });
      return;
    }
    if (key.return) {
      const item = filteredItems[index];
      if (item && !item.header) onSelect(item);
      return;
    }

    // Filter input
    if (!filtering && input === "/") {
      setFiltering(true);
      return;
    }
    if (filtering) {
      if (key.backspace || key.delete) {
        setQuery(q => {
          const next = q.slice(0, -1);
          if (next === "") setFiltering(false);
          return next;
        });
        return;
      }
      if (input && !key.ctrl && !key.meta) {
        setQuery(q => q + input);
        return;
      }
    } else if (input && /^[a-zA-Z0-9_-]$/.test(input) && !key.ctrl && !key.meta) {
      // Quick start: any alphanumeric key begins filtering
      setFiltering(true);
      setQuery(input);
    }
  });

  // Windowing
  const termHeight = stdout?.rows ?? 30;
  const reserveRows = (query || filtering) ? 14 : 12;
  const available = Math.max(5, termHeight - reserveRows);

  const rowHeight = (i: number) => {
    const it = filteredItems[i];
    if (!it) return 0;
    if (it.header) return i === 0 ? 1 : 2;
    return 1;
  };

  let lo = Math.min(index, Math.max(0, filteredItems.length - 1));
  let hi = lo + 1;
  let used = rowHeight(lo);
  let preferDown = true;
  while (lo > 0 || hi < filteredItems.length) {
    const canUp = lo > 0 && used + rowHeight(lo - 1) <= available;
    const canDown = hi < filteredItems.length && used + rowHeight(hi) <= available;
    if (!canUp && !canDown) break;
    if (preferDown && canDown) {
      used += rowHeight(hi); hi++;
    } else if (canUp) {
      lo--; used += rowHeight(lo);
    } else if (canDown) {
      used += rowHeight(hi); hi++;
    } else {
      break;
    }
    preferDown = !preferDown;
  }

  const start = lo;
  const end = hi;
  const hiddenAbove = start;
  const hiddenBelow = filteredItems.length - end;
  const visibleItems = filteredItems.slice(start, end);

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text bold>{title}</Text>
        {query ? (
          <Text dimColor>  ({filteredItems.filter(it => !it.header).length} of {items.filter(it => !it.header).length} match)</Text>
        ) : (hiddenAbove > 0 || hiddenBelow > 0) ? (
          <Text dimColor>  ({end - start} of {filteredItems.length})</Text>
        ) : null}
      </Box>
      {(filtering || query) ? (
        <Box marginBottom={1}>
          <Text dimColor>/ </Text>
          <Text>{query}</Text>
          <Text color="cyan">▎</Text>
        </Box>
      ) : null}
      {hiddenAbove > 0 ? (
        <Box>
          <Text dimColor>  ↑ {hiddenAbove} more above</Text>
        </Box>
      ) : null}
      {filteredItems.length === 0 ? (
        <Box>
          <Text dimColor>  No matches.</Text>
        </Box>
      ) : null}
      {visibleItems.map((item, visIdx) => {
        const i = start + visIdx;
        if (item.header) {
          return (
            <Box key={`hdr-${i}-${item.id}`} marginTop={visIdx === 0 && start === 0 ? 0 : 1}>
              <Text bold dimColor>{item.label}</Text>
            </Box>
          );
        }
        const focused = i === index;
        return (
          <Box key={item.id}>
            <Text color={focused ? "cyan" : undefined}>
              {focused ? "› " : "  "}
              {item.label}
            </Text>
          </Box>
        );
      })}
      {hiddenBelow > 0 ? (
        <Box>
          <Text dimColor>  ↓ {hiddenBelow} more below</Text>
        </Box>
      ) : null}
      <Box marginTop={1}>
        <Text dimColor>
          {(filtering || query)
            ? "Type to filter · ↑/↓ navigate · Enter select · Esc clear"
            : "↑/↓ navigate · PgUp/PgDn · / or type to filter · Enter select · Esc back · Ctrl-C quit"}
        </Text>
      </Box>
    </Box>
  );
}
