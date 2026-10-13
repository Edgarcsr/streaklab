export const THEME_STORAGE_KEY = "streaklab-theme";

export const THEME_MODES = ["light", "dark", "system"] as const;

export type ThemeMode = (typeof THEME_MODES)[number];
export type ResolvedTheme = "light" | "dark";

type ThemeStorage = Pick<Storage, "getItem" | "setItem">;

/** Anything that is not a known mode falls back to "system". */
export function parseThemeMode(value: unknown): ThemeMode {
  return value === "light" || value === "dark" || value === "system"
    ? value
    : "system";
}

export function resolveTheme(
  mode: ThemeMode,
  systemPrefersDark: boolean
): ResolvedTheme {
  if (mode === "system") {
    return systemPrefersDark ? "dark" : "light";
  }
  return mode;
}

export function getThemeStorage(): ThemeStorage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    // Accessing localStorage can throw when storage is blocked.
    return null;
  }
}

export function readStoredTheme(storage: ThemeStorage | null): ThemeMode {
  try {
    return parseThemeMode(storage?.getItem(THEME_STORAGE_KEY));
  } catch {
    return "system";
  }
}

export function writeStoredTheme(
  storage: ThemeStorage | null,
  mode: ThemeMode
): void {
  try {
    storage?.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    // Persisting is best effort; the theme still applies for this visit.
  }
}

export function applyResolvedTheme(
  root: Pick<HTMLElement, "classList" | "style">,
  resolved: ResolvedTheme
): void {
  root.classList.toggle("dark", resolved === "dark");
  root.style.colorScheme = resolved;
}
