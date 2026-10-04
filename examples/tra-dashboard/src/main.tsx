import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import { AuthProvider } from "@/lib/auth";
import { ThemeProvider } from "@/lib/theme";
import { AppShell } from "@/components/shell";
import { LoginPage } from "@/pages/login";
import { InsightsPage } from "@/pages/insights";
import { InsightsProjectPage } from "@/pages/insights-project";
import { RunsPage } from "@/pages/runs";
import { ComparePage } from "@/pages/compare";
import { SessionPage } from "@/pages/session";
import { BuildPage } from "@/pages/build";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false } },
});

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Missing #root element");

createRoot(rootEl).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<AppShell />}>
              <Route index element={<Navigate to="/insights" replace />} />
              <Route path="/insights" element={<InsightsPage />} />
              <Route path="/insights/projects/:projectId" element={<InsightsProjectPage />} />
              <Route path="/runs" element={<RunsPage />} />
              <Route path="/runs/compare" element={<ComparePage />} />
              <Route path="/builds/:buildId" element={<BuildPage />} />
              <Route path="/builds/:buildId/sessions/:sessionId" element={<SessionPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/insights" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
);
