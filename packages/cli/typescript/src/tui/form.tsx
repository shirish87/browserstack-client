import React, { useState } from "react";
import { Box, Text, useInput } from "ink";
import type { TUIField } from "../tui-types.ts";

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
  const submitIndex = fields.length;

  useInput((input, key) => {
    if (key.escape) {
      onBack();
      return;
    }
    if (key.tab && !key.shift) {
      setFocus(i => (i + 1) % (fields.length + 1));
      return;
    }
    if (key.tab && key.shift) {
      setFocus(i => (i - 1 + fields.length + 1) % (fields.length + 1));
      return;
    }
    if (key.downArrow) {
      setFocus(i => Math.min(i + 1, submitIndex));
      return;
    }
    if (key.upArrow) {
      setFocus(i => Math.max(i - 1, 0));
      return;
    }

    if (focus === submitIndex && key.return) {
      const missing = fields.filter(f => f.required && !values[f.name]?.trim());
      if (missing.length > 0) {
        setError(`Missing required: ${missing.map(f => f.name).join(", ")}`);
        return;
      }
      onSubmit(values);
      return;
    }

    if (focus < fields.length) {
      const field = fields[focus];

      if (field.enum && field.enum.length > 0) {
        if (key.leftArrow || key.rightArrow) {
          const cur = values[field.name];
          const i = field.enum.indexOf(cur);
          const next = key.rightArrow
            ? field.enum[(i + 1) % field.enum.length]
            : field.enum[(i - 1 + field.enum.length) % field.enum.length];
          setValues(v => ({ ...v, [field.name]: next }));
        }
        return;
      }

      if (field.type === "boolean") {
        if (key.leftArrow || key.rightArrow || input === " ") {
          const cur = values[field.name];
          setValues(v => ({ ...v, [field.name]: cur === "true" ? "false" : "true" }));
        }
        return;
      }

      if (key.backspace || key.delete) {
        setValues(v => ({ ...v, [field.name]: (v[field.name] || "").slice(0, -1) }));
        return;
      }

      if (key.return) {
        setFocus(i => Math.min(i + 1, submitIndex));
        return;
      }

      if (input && !key.ctrl && !key.meta) {
        setValues(v => ({ ...v, [field.name]: (v[field.name] || "") + input }));
      }
    }
  });

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text bold>{title}</Text>
      </Box>
      {fields.length === 0 && (
        <Box marginBottom={1}>
          <Text dimColor>(no parameters)</Text>
        </Box>
      )}
      {fields.map((field, i) => {
        const isFocused = i === focus;
        const value = values[field.name] || "";
        let display: string;
        if (field.enum && field.enum.length > 0) {
          display = value || `<${field.enum.join("|")}>`;
        } else if (field.type === "boolean") {
          display = value || "false";
        } else {
          display = value || "(empty)";
        }
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
            <Box paddingLeft={4}>
              <Text color={value ? undefined : "gray"}>{display}{isFocused ? "▎" : ""}</Text>
            </Box>
          </Box>
        );
      })}
      <Box marginTop={1}>
        <Text color={focus === submitIndex ? "green" : undefined} bold={focus === submitIndex}>
          {focus === submitIndex ? "› " : "  "}[ Submit ]
        </Text>
      </Box>
      {error ? (
        <Box marginTop={1}>
          <Text color="red">{error}</Text>
        </Box>
      ) : null}
      <Box marginTop={1}>
        <Text dimColor>Tab/↓ next · Shift-Tab/↑ prev · ←/→ toggle enum/bool · Enter submit · Esc back</Text>
      </Box>
    </Box>
  );
}
