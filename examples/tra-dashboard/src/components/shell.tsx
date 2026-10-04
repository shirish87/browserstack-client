import { Link, Navigate, Outlet } from "react-router";
import { LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export function AppShell() {
  const { state, signOut } = useAuth();
  if (state.status === "loading") {
    return (
      <div className="grid min-h-screen place-items-center text-muted" role="status">
        Loading…
      </div>
    );
  }
  if (state.status === "anonymous") return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur">
        <nav aria-label="Primary" className="mx-auto flex h-14 max-w-[1280px] items-center justify-between px-6">
          <Link to="/projects" className="flex items-center gap-2.5 font-medium">
            <span className="grid size-6 place-items-center rounded-md bg-primary text-[12px] font-semibold text-on-primary" aria-hidden>
              T
            </span>
            Test Reporting
          </Link>
          <div className="flex items-center gap-2">
            <span className="mr-1 hidden text-muted sm:inline">
              Signed in as <span className="font-mono text-[12px] font-medium text-text">{state.username}</span>
            </span>
            <Button variant="outline" size="sm" onClick={() => void signOut()}>
              <LogOut className="size-3.5" aria-hidden /> Sign out
            </Button>
            <ThemeToggle />
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-[1280px] px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
}
