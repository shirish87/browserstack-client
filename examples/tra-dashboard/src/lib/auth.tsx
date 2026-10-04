import { createContext, use, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { TestReportingClient } from "@dot-slash/browserstack-test-reporting";
import type { TestManagementClient } from "@dot-slash/browserstack-test-management";
import { createTmClient, createTraClient } from "./api";
import { SessionResponseSchema, type Credentials } from "./schemas";
import { z } from "zod";

const ErrorBodySchema = z.object({ message: z.string() });

async function sessionRequest(method: "GET" | "POST" | "DELETE", credentials?: Credentials): Promise<Response> {
  return fetch("/api/session", {
    method,
    ...(credentials ? { headers: { "content-type": "application/json" }, body: JSON.stringify(credentials) } : {}),
  });
}

async function failureMessage(res: Response): Promise<string> {
  const parsed = ErrorBodySchema.safeParse(await res.json().catch(() => null));
  return parsed.success ? parsed.data.message : `Request failed (${res.status})`;
}

export type AuthState =
  | { status: "loading" }
  | { status: "anonymous" }
  | { status: "authenticated"; username: string };

interface AuthValue {
  state: AuthState;
  /** Throws an Error with a user-presentable message on failure. */
  signIn: (creds: Credentials) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [state, setState] = useState<AuthState>({ status: "loading" });

  // Resume an existing server session (cookie) on page load.
  useEffect(() => {
    let cancelled = false;
    sessionRequest("GET")
      .then(async (res) => {
        const parsed = res.ok ? SessionResponseSchema.safeParse(await res.json()) : null;
        if (!cancelled) setState(parsed?.success ? { status: "authenticated", username: parsed.data.username } : { status: "anonymous" });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "anonymous" });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(async (creds: Credentials) => {
    const res = await sessionRequest("POST", creds);
    if (!res.ok) throw new Error(await failureMessage(res));
    const { username } = SessionResponseSchema.parse(await res.json());
    setState({ status: "authenticated", username });
  }, []);

  const signOut = useCallback(async () => {
    await sessionRequest("DELETE").catch(() => undefined);
    setState({ status: "anonymous" });
    queryClient.clear();
  }, [queryClient]);

  const value = useMemo<AuthValue>(() => ({ state, signIn, signOut }), [state, signIn, signOut]);
  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth(): AuthValue {
  const ctx = use(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

const client = createTraClient();
const tmClient = createTmClient();

/** For routes behind the sign-in guard. */
export function useTraClient(): { client: TestReportingClient; username: string } {
  const { state } = useAuth();
  if (state.status !== "authenticated") throw new Error("useTraClient used while signed out");
  return { client, username: state.username };
}

export function useTmClient(): { client: TestManagementClient; username: string } {
  const { state } = useAuth();
  if (state.status !== "authenticated") throw new Error("useTmClient used while signed out");
  return { client: tmClient, username: state.username };
}
