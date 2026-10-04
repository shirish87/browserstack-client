import type { IncomingMessage, ServerResponse } from "node:http";
import type { Plugin } from "vite";
import { createGateway } from "@dot-slash/browserstack-router";
import { GATEWAY_ACCESS_KEY_HEADER, GATEWAY_USERNAME_HEADER, GatewayHeadersSchema } from "../src/lib/schemas";
import { createMockUpstream } from "./mock-upstream";

/** Test Reporting & Analytics lives on these hosts only. */
export const TRA_ALLOWED_HOSTS = ["api-automation.browserstack.com", "upload-automation.browserstack.com"];

type Next = (err?: unknown) => void;

export interface GatewayHandlerOptions {
  fetchFn?: typeof fetch;
}

/**
 * Per-request gateway: credentials arrive as headers from the dashboard sign-in form,
 * are stripped before forwarding, and re-attached upstream as Basic auth by the router.
 * Fine for a local/internal tool; for a public deployment keep credentials server-side.
 */
export function createTraGatewayHandler(options: GatewayHandlerOptions = {}) {
  return (req: IncomingMessage, res: ServerResponse, next: Next): void => {
    const parsed = GatewayHeadersSchema.safeParse({
      [GATEWAY_USERNAME_HEADER]: req.headers[GATEWAY_USERNAME_HEADER],
      [GATEWAY_ACCESS_KEY_HEADER]: req.headers[GATEWAY_ACCESS_KEY_HEADER],
    });
    delete req.headers[GATEWAY_USERNAME_HEADER];
    delete req.headers[GATEWAY_ACCESS_KEY_HEADER];

    if (!parsed.success) {
      res.statusCode = 400;
      res.setHeader("content-type", "text/plain");
      res.end(`Missing ${GATEWAY_USERNAME_HEADER} / ${GATEWAY_ACCESS_KEY_HEADER} headers`);
      return;
    }

    const gateway = createGateway({
      username: parsed.data[GATEWAY_USERNAME_HEADER],
      accessKey: parsed.data[GATEWAY_ACCESS_KEY_HEADER],
      allowedHosts: TRA_ALLOWED_HOSTS,
      ...(options.fetchFn ? { fetchFn: options.fetchFn } : {}),
    });
    void gateway(req, res, next);
  };
}

export function traGatewayPlugin(opts: { mock?: boolean } = {}): Plugin {
  const handler = createTraGatewayHandler(opts.mock ? { fetchFn: createMockUpstream() } : {});
  return {
    name: "tra-gateway",
    configureServer(server) {
      server.middlewares.use("/gateway", handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use("/gateway", handler);
    },
  };
}
