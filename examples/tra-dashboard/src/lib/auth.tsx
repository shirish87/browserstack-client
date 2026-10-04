import { createContext, use, useCallback, useMemo, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { TestReportingClient } from "@dot-slash/browserstack-test-reporting";
import { createTraClient } from "./api";
import { CredentialsSchema, type Credentials } from "./schemas";

const STORAGE_KEY = "tra.credentials";

function loadStored(): Credentials | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = CredentialsSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

interface AuthValue {
  credentials: Credentials | null;
  client: TestReportingClient | null;
  signIn: (creds: Credentials) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [credentials, setCredentials] = useState<Credentials | null>(loadStored);

  const signIn = useCallback((creds: Credentials) => {
    // Session-scoped on purpose: cleared when the tab closes.
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(creds));
    setCredentials(creds);
  }, []);

  const signOut = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setCredentials(null);
    queryClient.clear();
  }, [queryClient]);

  const value = useMemo<AuthValue>(
    () => ({ credentials, client: credentials ? createTraClient(credentials) : null, signIn, signOut }),
    [credentials, signIn, signOut],
  );
  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth(): AuthValue {
  const ctx = use(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

/** For routes behind the sign-in guard, where a client is guaranteed to exist. */
export function useTraClient(): { client: TestReportingClient; username: string } {
  const { client, credentials } = useAuth();
  if (!client || !credentials) throw new Error("useTraClient used while signed out");
  return { client, username: credentials.username };
}
