import { createContext, use, useCallback, useMemo, useState, type ReactNode } from "react";
import { z } from "zod";

export const ThemeSchema = z.enum(["dark", "light"]);
export type Theme = z.infer<typeof ThemeSchema>;

const STORAGE_KEY = "tra.theme";

interface ThemeValue {
  theme: Theme;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeValue | null>(null);

/** index.html sets data-theme before paint; fall back to dark (the default). */
function initialTheme(): Theme {
  const parsed = ThemeSchema.safeParse(document.documentElement.dataset["theme"]);
  return parsed.success ? parsed.data : "dark";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  const toggle = useCallback(() => {
    setTheme((current) => {
      const next: Theme = current === "dark" ? "light" : "dark";
      document.documentElement.dataset["theme"] = next;
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* storage unavailable: the choice just won't persist */
      }
      return next;
    });
  }, []);

  const value = useMemo<ThemeValue>(() => ({ theme, toggle }), [theme, toggle]);
  return <ThemeContext value={value}>{children}</ThemeContext>;
}

export function useTheme(): ThemeValue {
  const ctx = use(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
