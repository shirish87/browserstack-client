import { useState } from "react";
import { Box, Text, useApp, useInput } from "ink";
import { TUI_MANIFEST } from "../tui-manifest.generated.ts";
import type { TUIProduct, TUIResource, TUIAction } from "../tui-types.ts";
import { Banner } from "./banner.tsx";
import { SelectList, type SelectItem } from "./select-list.tsx";
import { Form } from "./form.tsx";
import { Result } from "./result.tsx";
import { executeAction } from "./execute.ts";

function productLabel(p: { title: string; id: string }): string {
  return p.title
    .replace(/^BrowserStack\s+/i, "")
    .replace(/\s*\([^)]+\)\s*$/, "")
    .trim() || p.id;
}

function groupedActionItems(actions: TUIAction[]): SelectItem[] {
  // Preserve first-seen section order; ungrouped actions go to "General" at the end.
  const sectionOrder: string[] = [];
  const bySection = new Map<string, TUIAction[]>();
  for (const a of actions) {
    const key = (a.section && a.section.trim()) || "General";
    if (!bySection.has(key)) {
      bySection.set(key, []);
      sectionOrder.push(key);
    }
    bySection.get(key)!.push(a);
  }
  // If there's only one section, skip headers entirely.
  if (sectionOrder.length === 1) {
    return bySection.get(sectionOrder[0])!.map(a => ({ id: a.id, label: a.summary || a.id }));
  }
  const items: SelectItem[] = [];
  for (const section of sectionOrder) {
    items.push({ id: `__section_${section}`, label: section, header: true });
    for (const a of bySection.get(section)!) {
      items.push({ id: a.id, label: a.summary || a.id });
    }
  }
  return items;
}

type Step = "product" | "resource" | "action" | "form" | "loading" | "result";

interface AppState {
  step: Step;
  product: TUIProduct | null;
  resource: TUIResource | null;
  action: TUIAction | null;
  output: string;
  error: string | null;
}

export function App(_props: { version?: string }) {
  const { exit } = useApp();
  const [state, setState] = useState<AppState>({
    step: "product",
    product: null,
    resource: null,
    action: null,
    output: "",
    error: null,
  });

  useInput((_input, key) => {
    if (key.ctrl && _input === "c") {
      exit();
    }
  });

  if (state.step === "product") {
    return (
      <Box flexDirection="column">
        <Banner />
        <SelectList
          title="Select a product"
          items={TUI_MANIFEST.map(p => ({ id: p.id, label: productLabel(p), description: p.description }))}
          onSelect={item => {
            const product = TUI_MANIFEST.find(p => p.id === item.id)!;
            const resources = product.resources;
            if (resources.length === 1 && resources[0].id === "default") {
              setState({ ...state, product, resource: resources[0], step: "action" });
            } else {
              setState({ ...state, product, step: "resource" });
            }
          }}
        />
      </Box>
    );
  }

  if (state.step === "resource" && state.product) {
    return (
      <Box flexDirection="column">
        <Banner />
        <SelectList
          title={`${productLabel(state.product)} → select a resource`}
          items={state.product.resources.map(r => ({ id: r.id, label: r.label }))}
          onSelect={item => {
            const resource = state.product!.resources.find(r => r.id === item.id)!;
            setState({ ...state, resource, step: "action" });
          }}
          onBack={() => setState({ ...state, product: null, step: "product" })}
        />
      </Box>
    );
  }

  if (state.step === "action" && state.product && state.resource) {
    const isFlat = state.product.resources.length === 1 && state.product.resources[0].id === "default";
    return (
      <Box flexDirection="column">
        <Banner />
        <SelectList
          title={`${productLabel(state.product)}${isFlat ? "" : ` → ${state.resource.label}`} → select an action`}
          items={groupedActionItems(state.resource.actions)}
          onSelect={item => {
            const action = state.resource!.actions.find(a => a.id === item.id)!;
            if (action.fields.length === 0) {
              setState(s => ({ ...s, action, step: "loading" }));
              executeAction(state.product!, action, {}).then(({ output, error }) => {
                setState(s => ({ ...s, output, error, step: "result" }));
              });
              return;
            }
            setState({ ...state, action, step: "form" });
          }}
          onBack={() =>
            isFlat
              ? setState({ ...state, product: null, resource: null, step: "product" })
              : setState({ ...state, resource: null, step: "resource" })
          }
        />
      </Box>
    );
  }

  if (state.step === "form" && state.action) {
    return (
      <Box flexDirection="column">
        <Banner />
        <Form
          title={`${productLabel(state.product!)} → ${state.action.id}`}
          fields={state.action.fields}
          onBack={() => setState({ ...state, action: null, step: "action" })}
          onSubmit={values => {
            setState(s => ({ ...s, step: "loading" }));
            executeAction(state.product!, state.action!, values).then(({ output, error }) => {
              setState(s => ({ ...s, output, error, step: "result" }));
            });
          }}
        />
      </Box>
    );
  }

  if (state.step === "loading") {
    return (
      <Box flexDirection="column">
        <Banner />
        <Text>Running…</Text>
      </Box>
    );
  }

  if (state.step === "result") {
    return (
      <Box flexDirection="column">
        <Banner />
        <Result
          output={state.output}
          error={state.error}
          onBack={() => setState({ ...state, step: "action", output: "", error: null })}
        />
      </Box>
    );
  }

  return <Text>Unknown state</Text>;
}
