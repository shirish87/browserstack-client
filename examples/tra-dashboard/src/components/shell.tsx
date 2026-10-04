import { Link, Navigate, Outlet } from "react-router";
import { LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export function AppShell() {
  const { credentials, signOut } = useAuth();
  if (!credentials) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-border bg-surface/90 backdrop-blur">
        <nav aria-label="Primary" className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Link to="/projects" className="flex items-center gap-2 font-bold tracking-[-0.14px]">
            <span className="grid size-6 place-items-center rounded-md bg-primary text-[11px] text-on-primary" aria-hidden>
              T
            </span>
            Test Reporting
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-muted">
              Signed in as <span className="font-mono text-[12px] font-medium text-text">{credentials.username}</span>
            </span>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="size-3.5" aria-hidden /> Sign out
            </Button>
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
