import { randomBytes } from "node:crypto";
import type { Credentials } from "../src/lib/schemas";

export interface SessionStoreOptions {
  /** Idle timeout; each successful `get` extends it. */
  ttlMs: number;
  now?: () => number;
}

interface Entry {
  credentials: Credentials;
  expiresAt: number;
}

/** In-memory session store. Swap for Redis (same interface) when running more than one instance. */
export class SessionStore {
  private readonly entries = new Map<string, Entry>();
  private readonly ttlMs: number;
  private readonly now: () => number;

  constructor(options: SessionStoreOptions) {
    this.ttlMs = options.ttlMs;
    this.now = options.now ?? Date.now;
  }

  create(credentials: Credentials): string {
    this.sweep();
    const id = randomBytes(32).toString("base64url");
    this.entries.set(id, { credentials, expiresAt: this.now() + this.ttlMs });
    return id;
  }

  get(id: string | undefined): Credentials | undefined {
    if (!id) return undefined;
    const entry = this.entries.get(id);
    if (!entry) return undefined;
    const now = this.now();
    if (entry.expiresAt <= now) {
      this.entries.delete(id);
      return undefined;
    }
    entry.expiresAt = now + this.ttlMs;
    return entry.credentials;
  }

  destroy(id: string | undefined): void {
    if (id) this.entries.delete(id);
  }

  private sweep(): void {
    const now = this.now();
    for (const [id, entry] of this.entries) if (entry.expiresAt <= now) this.entries.delete(id);
  }
}
