import { describe, expect, it } from "vitest";

import {
  parseThemeMode,
  readStoredTheme,
  resolveTheme,
  THEME_MODES,
  THEME_STORAGE_KEY,
  writeStoredTheme,
} from "@/lib/theme";

function memoryStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => {
      data.set(key, value);
    },
  };
}

describe("parseThemeMode", () => {
  it("accepts the three known modes", () => {
    expect(parseThemeMode("light")).toBe("light");
    expect(parseThemeMode("dark")).toBe("dark");
    expect(parseThemeMode("system")).toBe("system");
  });

  it("lists the modes in selector order, each parsing to itself", () => {
    expect(THEME_MODES).toEqual(["light", "dark", "system"]);
    for (const mode of THEME_MODES) {
      expect(parseThemeMode(mode)).toBe(mode);
    }
  });

  it("falls back to system for anything else", () => {
    expect(parseThemeMode(null)).toBe("system");
    expect(parseThemeMode("purple")).toBe("system");
    expect(parseThemeMode(undefined)).toBe("system");
  });
});

describe("resolveTheme", () => {
  it("follows the OS preference in system mode", () => {
    expect(resolveTheme("system", true)).toBe("dark");
    expect(resolveTheme("system", false)).toBe("light");
  });

  it("ignores the OS preference for explicit modes", () => {
    expect(resolveTheme("light", true)).toBe("light");
    expect(resolveTheme("dark", false)).toBe("dark");
  });
});

describe("theme persistence", () => {
  it("defaults to system when nothing is stored", () => {
    expect(readStoredTheme(memoryStorage())).toBe("system");
    expect(readStoredTheme(null)).toBe("system");
  });

  it("reads a stored mode", () => {
    const storage = memoryStorage({ [THEME_STORAGE_KEY]: "dark" });
    expect(readStoredTheme(storage)).toBe("dark");
  });

  it("writes the mode under the storage key and reads it back", () => {
    const storage = memoryStorage();
    writeStoredTheme(storage, "light");
    expect(storage.getItem(THEME_STORAGE_KEY)).toBe("light");
    expect(readStoredTheme(storage)).toBe("light");
  });

  it("does not throw when storage is blocked", () => {
    const broken = {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("blocked");
      },
    };
    expect(readStoredTheme(broken)).toBe("system");
    expect(() => writeStoredTheme(broken, "dark")).not.toThrow();
  });
});
