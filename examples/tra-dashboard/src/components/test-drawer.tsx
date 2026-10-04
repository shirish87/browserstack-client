import { useEffect, useRef } from "react";
import { ExternalLink, X } from "lucide-react";
import type { FlatTest } from "@/lib/analytics";
import { formatDuration } from "@/lib/format";
import { displayValue, humanize } from "@/lib/utils";
import { StatusBadge } from "@/components/status";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { KeyValue } from "@/components/common";

export interface DrawerTest {
  test: FlatTest;
  /** Extra metadata fields (browser, os, …) reported with the test. */
  extra: Record<string, unknown>;
  /** BrowserStack page for the owning build, where raw logs, steps and screenshots live. */
  buildUrl: string | null | undefined;
  buildLabel: string;
}

/** Slide-over with a test's outcome, errors and metadata. Esc or the backdrop closes it. */
export function TestDrawer({ item, onClose }: { item: DrawerTest | null; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!item) return;
    const previous = document.activeElement;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      if (previous instanceof HTMLElement) previous.focus();
    };
  }, [item, onClose]);

  if (!item) return null;
  const { test, extra, buildUrl, buildLabel } = item;
  return (
    <div className="fixed inset-0 z-30" role="dialog" aria-modal="true" aria-labelledby="test-drawer-title">
      <button type="button" aria-label="Close details" className="absolute inset-0 cursor-default bg-black/50" onClick={onClose} />
      <aside className="panel absolute inset-y-0 right-0 flex w-full max-w-xl flex-col overflow-y-auto rounded-none border-y-0 border-r-0">
        <header className="sticky top-0 flex items-start justify-between gap-3 border-b border-border bg-surface px-6 py-4">
          <div className="min-w-0">
            <p className="truncate text-[12px] text-muted">{test.path.slice(0, -1).join(" › ")}</p>
            <h2 id="test-drawer-title" className="mt-0.5 break-words text-[18px] font-semibold tracking-[-0.02em]">
              {test.name}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <StatusBadge status={test.status} />
              {test.isFlaky && <Badge tone="warning">Flaky</Badge>}
              {test.isNewFailure && <Badge tone="danger">New failure</Badge>}
              {test.retries ? <Badge tone="outline">{test.retries} retries</Badge> : null}
            </div>
          </div>
          <Button ref={closeRef} variant="ghost" size="icon" onClick={onClose} aria-label="Close">
            <X className="size-4" aria-hidden />
          </Button>
        </header>

        <div className="space-y-6 px-6 py-5">
          <section aria-label="Outcome">
            <h3 className="mb-2 text-[13px] font-medium text-muted">Outcome</h3>
            <KeyValue rows={[["Build", buildLabel], ["Duration", formatDuration(test.durationMs)]]} />
          </section>

          <section aria-label="Errors">
            <h3 className="mb-2 text-[13px] font-medium text-muted">{test.status === "failed" ? "Failure" : "Errors"}</h3>
            {test.failures.length === 0 ? (
              <p className="text-muted">{test.status === "failed" ? "TRA recorded no error message for this failure." : "No errors recorded."}</p>
            ) : (
              <ul className="space-y-3">
                {test.failures.map((f, i) => (
                  <li key={i} className="rounded-lg border border-danger/30 bg-danger-bg p-3">
                    {f.error && <p className="break-words font-medium text-danger">{f.error}</p>}
                    {f.backtrace && (
                      <pre className="mt-2 overflow-x-auto whitespace-pre-wrap font-mono text-[12px] leading-[1.5] text-ink-muted">{f.backtrace}</pre>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {Object.keys(extra).length > 0 && (
            <section aria-label="Metadata">
              <h3 className="mb-2 text-[13px] font-medium text-muted">Metadata</h3>
              <KeyValue rows={Object.entries(extra).map(([k, v]) => [humanize(k), <span key={k} className="font-mono text-[12px]">{displayValue(v)}</span>])} />
            </section>
          )}

          <section aria-label="Logs">
            <h3 className="mb-2 text-[13px] font-medium text-muted">Logs, steps &amp; screenshots</h3>
            <p className="mb-3 text-muted">The Test Reporting API doesn’t return raw logs, so they open in BrowserStack.</p>
            {buildUrl ? (
              <Button asChild variant="outline">
                <a href={buildUrl} target="_blank" rel="noreferrer noopener">
                  Open build in BrowserStack <ExternalLink className="size-3.5" aria-hidden />
                </a>
              </Button>
            ) : (
              <p className="text-muted">No BrowserStack link was reported for this build.</p>
            )}
          </section>
        </div>
      </aside>
    </div>
  );
}
