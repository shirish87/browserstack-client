import { mkdir, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";

// BrowserStack Local tunnels started and stopped by different test files and
// processes (vitest runs each project in its own worker, and the CLI e2e
// suites run concurrently) interfere with each other: `--stop` can report
// "process instance not found" or print nothing when another tunnel is being
// started or torn down at the same time. Tests that start a tunnel hold this
// lock for as long as the tunnel lives.
//
// mkdir is atomic across processes, so the lock directory is the lock. A lock
// older than STALE_MS is assumed to belong to a crashed process and is taken over.
const LOCK_DIR = join(tmpdir(), "browserstack-client-tunnel.lock");
const POLL_MS = 250;
const STALE_MS = 5 * 60_000;

export async function acquireTunnelLock(): Promise<() => Promise<void>> {
  for (;;) {
    try {
      await mkdir(LOCK_DIR);
      return () => rm(LOCK_DIR, { recursive: true, force: true });
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code !== "EEXIST") throw err;
    }

    try {
      const { mtimeMs } = await stat(LOCK_DIR);
      if (Date.now() - mtimeMs > STALE_MS) {
        await rm(LOCK_DIR, { recursive: true, force: true });
        continue;
      }
    } catch {
      continue; // released between mkdir and stat; try again
    }

    await sleep(POLL_MS);
  }
}
