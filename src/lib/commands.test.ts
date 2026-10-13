import { describe, expect, it } from "vitest";

import {
  DOWNLOAD_SHORTCUT,
  matchesShortcut,
  PALETTE_SHORTCUT,
  shortcutKeys,
} from "@/lib/commands";

const event = (
  key: string,
  modifiers: { ctrl?: boolean; meta?: boolean; shift?: boolean } = {}
) => ({
  ctrlKey: Boolean(modifiers.ctrl),
  key,
  metaKey: Boolean(modifiers.meta),
  shiftKey: Boolean(modifiers.shift),
});

describe("matchesShortcut", () => {
  it("accepts Ctrl or Cmd with the palette key", () => {
    expect(matchesShortcut(event("k", { ctrl: true }), PALETTE_SHORTCUT)).toBe(
      true
    );
    expect(matchesShortcut(event("K", { meta: true }), PALETTE_SHORTCUT)).toBe(
      true
    );
  });

  it("rejects the key without the modifier, or extra Shift", () => {
    expect(matchesShortcut(event("k"), PALETTE_SHORTCUT)).toBe(false);
    expect(
      matchesShortcut(event("k", { ctrl: true, shift: true }), PALETTE_SHORTCUT)
    ).toBe(false);
  });

  it("requires Shift when the shortcut uses it", () => {
    expect(
      matchesShortcut(
        event("E", { ctrl: true, shift: true }),
        DOWNLOAD_SHORTCUT
      )
    ).toBe(true);
    expect(matchesShortcut(event("e", { ctrl: true }), DOWNLOAD_SHORTCUT)).toBe(
      false
    );
  });
});

describe("shortcutKeys", () => {
  it("uses Ctrl and Shift labels off macOS", () => {
    expect(shortcutKeys(DOWNLOAD_SHORTCUT, false)).toEqual([
      "Ctrl",
      "Shift",
      "E",
    ]);
  });

  it("uses symbols on macOS", () => {
    expect(shortcutKeys(PALETTE_SHORTCUT, true)).toEqual(["⌘", "K"]);
  });
});
