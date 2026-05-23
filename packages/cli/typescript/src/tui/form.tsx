import React, { useState } from "react";
import { Box, Text, useInput, useStdout } from "ink";
import type { TUIField } from "../tui-types.ts";
import { PickerOverlay } from "./picker-list.tsx";

function fieldRowHeight(field: TUIField): number {
  // label + description (if any) + 3 rows for the bordered input + 1 margin
  return 1 + (field.description ? 1 : 0) + 3 + 1;
}

export function Form({
  fields,
  title,
  onSubmit,
  onBack,
}: {
  fields: TUIField[];
  title: string;
  onSubmit: (values: Record<string, string>) => void;
  onBack: () => void;
}) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map(f => [f.name, ""]))
  );
  const [focus, setFocus] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const lastIndex = Math.max(0, fields.length - 1);

  function nextUnfilledRequired(from: number, currentValues: Record<string, string>): number {
    // Find next required field (after `from`, wrapping) whose value is empty.
    for (let step = 1; step <= fields.length; step++) {
      const i = (from + step) % fields.length;
      const f = fields[i];
      if (f.required && !currentValues[f.name]?.trim()) return i;
    }
    return -1;
  }

  function trySubmit(currentValues: Record<string, string>): boolean {
    const missing = fields.filter(f => f.required && !currentValues[f.name]?.trim());
    if (missing.length > 0) {
      setError(`Missing required: ${missing.map(f => f.name).join(", ")}`);
      return false;
    }
    onSubmit(currentValues);
    return true;
  }

  /**
   * Enter behavior:
   * - If any required field is unfilled, jump to the next unfilled required field.
   * - Otherwise, submit.
   */
  function handleEnter(currentValues: Record<string, string>) {
    const next = nextUnfilledRequired(focus, currentValues);
    if (next === -1) {
      trySubmit(currentValues);
    } else {
      setFocus(next);
    }
  }

  useInput((input, key) => {
    if (pickerOpen) return; // overlay handles input
    if (key.escape) {
      onBack();
      return;
    }

    if (key.tab && !key.shift) {
      setFocus(i => (i + 1) % fields.length);
      return;
    }
    if (key.tab && key.shift) {
      setFocus(i => (i - 1 + fields.length) % fields.length);
      return;
    }
    if (key.downArrow) {
      setFocus(i => Math.min(i + 1, lastIndex));
      return;
    }
    if (key.upArrow) {
      setFocus(i => Math.max(i - 1, 0));
      return;
    }

    const field = fields[focus];

    // Ctrl+Enter (or Ctrl+S) submits from anywhere.
    if (key.ctrl && (key.return || input === "s")) {
      trySubmit(values);
      return;
    }

    // Picker: Enter or Space opens the overlay
    if (field.picker && (key.return || input === " ")) {
      setPickerOpen(true);
      return;
    }

    if (field.enum && field.enum.length > 0) {
      if (key.leftArrow || key.rightArrow) {
        const cur = values[field.name];
        const i = field.enum.indexOf(cur);
        const next = key.rightArrow
          ? field.enum[(i + 1) % field.enum.length]
          : field.enum[(i - 1 + field.enum.length) % field.enum.length];
        setValues(v => ({ ...v, [field.name]: next }));
      } else if (key.return) {
        handleEnter(values);
      }
      return;
    }

    if (field.type === "boolean") {
      if (key.leftArrow || key.rightArrow || input === " ") {
        const cur = values[field.name];
        setValues(v => ({ ...v, [field.name]: cur === "true" ? "false" : "true" }));
      } else if (key.return) {
        handleEnter(values);
      }
      return;
    }

    if (key.backspace || key.delete) {
      setValues(v => ({ ...v, [field.name]: (v[field.name] || "").slice(0, -1) }));
      return;
    }

    if (key.return) {
      handleEnter(values);
      return;
    }

    if (input && !key.ctrl && !key.meta) {
      setValues(v => ({ ...v, [field.name]: (v[field.name] || "") + input }));
    }
  });

  const { stdout } = useStdout();
  const termHeight = stdout?.rows ?? 30;
  // Reserve rows for: logo (~7), title (2), hint bar (3), error (1), margin
  const reserved = 14;
  const available = Math.max(8, termHeight - reserved);

  // Find a window [start, end) of fields that contains `focus` and fits within `available`.
  const heights = fields.map(fieldRowHeight);
  let start = 0;
  let end = fields.length;
  // Grow window around focus until it would exceed `available`.
  // Strategy: anchor on focus, then expand outward.
  let used = heights[focus] ?? 0;
  let lo = focus;
  let hi = focus + 1;
  while (lo > 0 || hi < fields.length) {
    const canGrowUp = lo > 0 && used + heights[lo - 1] <= available;
    const canGrowDown = hi < fields.length && used + heights[hi] <= available;
    if (!canGrowUp && !canGrowDown) break;
    // Prefer growing down first (so more upcoming fields are visible), then up
    if (canGrowDown) { used += heights[hi]; hi++; }
    else if (canGrowUp) { lo--; used += heights[lo]; }
  }
  start = lo;
  end = hi;
  const visibleFields = fields.slice(start, end);
  const hiddenAbove = start;
  const hiddenBelow = fields.length - end;

  if (pickerOpen) {
    const field = fields[focus];
    const filterValues: Record<string, string> = {};
    if (field?.picker?.filterBy) {
      for (const k of field.picker.filterBy) {
        if (values[k]) filterValues[k] = values[k];
      }
    }
    return (
      <Box flexDirection="column">
        <Box marginBottom={1}>
          <Text bold>{title}</Text>
        </Box>
        <PickerOverlay
          picker={field.picker!}
          fieldLabel={field.label}
          filterValues={filterValues}
          onSelect={value => {
            setValues(v => ({ ...v, [field.name]: value }));
            setPickerOpen(false);
            // Advance focus to next field
            setFocus(i => Math.min(i + 1, lastIndex));
          }}
          onCancel={() => setPickerOpen(false)}
        />
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text bold>{title}</Text>
        {(hiddenAbove > 0 || hiddenBelow > 0) ? (
          <Text dimColor>  (fields {start + 1}-{end} of {fields.length})</Text>
        ) : null}
      </Box>
      {hiddenAbove > 0 ? (
        <Box>
          <Text dimColor>  ↑ {hiddenAbove} more above</Text>
        </Box>
      ) : null}
      {visibleFields.map((field, visIdx) => {
        const i = start + visIdx;
        const isFocused = i === focus;
        const value = values[field.name] || "";
        const hasValue = value.length > 0;

        let placeholder: string;
        if (field.picker) {
          placeholder = `<${field.name.toLowerCase()}>  (Enter to pick)`;
        } else if (field.enum && field.enum.length > 0) {
          placeholder = `${field.enum.join(" / ")}  (← →)`;
        } else if (field.type === "boolean") {
          placeholder = "false  (← → / space)";
        } else if (field.type === "number") {
          placeholder = `<${field.name.toLowerCase()}>  (number)`;
        } else if (field.type === "file") {
          placeholder = `<path/to/file>`;
        } else {
          placeholder = `<${field.name.toLowerCase()}>`;
        }

        const borderColor = isFocused ? "cyan" : "gray";

        return (
          <Box key={field.name} flexDirection="column" marginBottom={1}>
            <Text color={isFocused ? "cyan" : undefined}>
              {isFocused ? "› " : "  "}
              {field.label}
              {field.required ? <Text color="red">*</Text> : null}
              <Text dimColor> [{field.type}{field.location !== "query" ? `/${field.location}` : ""}]</Text>
            </Text>
            {field.description ? (
              <Box paddingLeft={4}>
                <Text dimColor>{field.description}</Text>
              </Box>
            ) : null}
            <Box paddingLeft={4} marginTop={0}>
              <Box borderStyle="round" borderColor={borderColor} paddingX={1} minWidth={32}>
                {hasValue ? (
                  <Text>{value}{isFocused ? <Text color="cyan">▎</Text> : null}</Text>
                ) : (
                  <Text dimColor>{placeholder}{isFocused ? <Text color="cyan">▎</Text> : null}</Text>
                )}
              </Box>
            </Box>
          </Box>
        );
      })}
      {hiddenBelow > 0 ? (
        <Box>
          <Text dimColor>  ↓ {hiddenBelow} more below</Text>
        </Box>
      ) : null}
      {error ? (
        <Box marginTop={1}>
          <Text color="red">{error}</Text>
        </Box>
      ) : null}
      <Box marginTop={1}>
        <Text dimColor>
          Tab/↓ next · Shift-Tab/↑ prev · ←/→ toggle enum/bool · Enter next-required/run · Ctrl-Enter run from anywhere · Esc back
        </Text>
      </Box>
    </Box>
  );
}
