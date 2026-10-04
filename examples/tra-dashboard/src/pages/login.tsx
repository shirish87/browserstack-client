import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { CredentialsSchema } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { errorMessage } from "@/lib/utils";

export function LoginPage() {
  const { state, signIn } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (state.status === "authenticated") return <Navigate to="/projects" replace />;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const parsed = CredentialsSchema.safeParse({ username: form.get("username"), accessKey: form.get("accessKey") });
    if (!parsed.success) {
      setError(parsed.error.issues.map((i) => i.message).join(". "));
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await signIn(parsed.data);
      void navigate("/projects", { replace: true });
    } catch (err) {
      setError(`Couldn’t sign in: ${errorMessage(err)}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <span className="mx-auto mb-4 grid size-10 place-items-center rounded-xl bg-primary text-[16px] font-bold text-on-primary" aria-hidden>
            T
          </span>
          <h1 className="text-[22px] font-bold tracking-[-0.22px]">Test Reporting</h1>
          <p className="mt-1 text-muted">Sign in with your BrowserStack credentials to browse builds and tests.</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-border bg-surface p-6 shadow-elevated" noValidate>
          <div className="space-y-1.5">
            <label htmlFor="username" className="font-semibold">
              Username
            </label>
            <Input id="username" name="username" autoComplete="username" autoFocus required />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="accessKey" className="font-semibold">
              Access key
            </label>
            <Input id="accessKey" name="accessKey" type="password" autoComplete="current-password" required />
          </div>
          {error && (
            <p role="alert" className="rounded-md bg-danger-bg px-3 py-2 text-danger">
              {error}
            </p>
          )}
          <Button type="submit" className="w-full" disabled={busy}>
            {busy && <Loader2 className="size-4 animate-spin" aria-hidden />}
            {busy ? "Verifying…" : "Continue"}
          </Button>
          <p className="text-[12px] text-muted">
            Your access key is sent once to this app’s server and kept there for the session. It is never stored in the browser.
          </p>
        </form>
      </div>
    </main>
  );
}
