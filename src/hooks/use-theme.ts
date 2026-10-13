import { useCallback, useEffect, useState } from "react";

import {
  applyResolvedTheme,
  getThemeStorage,
  readStoredTheme,
  resolveTheme,
  type ThemeMode,
  writeStoredTheme,
} from "@/lib/theme";

const DARK_QUERY = "(prefers-color-scheme: dark)";

export function useTheme() {
  const [mode, setMode] = useState<ThemeMode>(() =>
    readStoredTheme(getThemeStorage())
  );
  const [systemDark, setSystemDark] = useState(
    () => window.matchMedia(DARK_QUERY).matches
  );

  useEffect(() => {
    const query = window.matchMedia(DARK_QUERY);
    const onChange = (event: MediaQueryListEvent) =>
      setSystemDark(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const resolved = resolveTheme(mode, systemDark);

  useEffect(() => {
    applyResolvedTheme(document.documentElement, resolved);
  }, [resolved]);

  const updateMode = useCallback((next: ThemeMode) => {
    setMode(next);
    writeStoredTheme(getThemeStorage(), next);
  }, []);

  return { mode, resolved, setMode: updateMode };
}
