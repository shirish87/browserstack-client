import React, { useState } from "react";
import { Box, Text, useApp, useInput } from "ink";
import { TUI_MANIFEST } from "../tui-manifest.generated.ts";
import type { TUIProduct, TUIResource, TUIAction } from "../tui-types.ts";
import { Logo } from "./logo.tsx";
import { SelectList } from "./select-list.tsx";
import { Form } from "./form.tsx";
import { Result } from "./result.tsx";
import { executeAction } from "./execute.ts";

type Step = "product" | "resource" | "action" | "form" | "loading" | "result";

interface AppState {
  step: Step;
  product: TUIProduct | null;
  resource: TUIResource | null;
  action: TUIAction | null;
  output: string;
  error: string | null;
}

export function App({ version }: { version?: string }) {
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
        <Logo version={version} />
        <SelectList
          title="Select a product"
          items={TUI_MANIFEST.map(p => ({ id: p.id, label: p.title, description: p.description }))}
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
        <Logo version={version} />
        <SelectList
          title={`${state.product.title} → select a resource`}
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
        <Logo version={version} />
        <SelectList
          title={`${state.product.title}${isFlat ? "" : ` → ${state.resource.label}`} → select an action`}
          items={state.resource.actions.map(a => ({ id: a.id, label: a.summary || a.id }))}
          onSelect={item => {
            const action = state.resource!.actions.find(a => a.id === item.id)!;
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
        <Logo version={version} />
        <Form
          title={`${state.product!.title} → ${state.action.id}`}
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
        <Logo version={version} />
        <Text>Running…</Text>
      </Box>
    );
  }

  if (state.step === "result") {
    return (
      <Box flexDirection="column">
        <Logo version={version} />
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
