/** A keyboard shortcut. `mod` means Cmd on macOS and Ctrl elsewhere. */
export interface Shortcut {
  key: string;
  mod?: boolean;
  shift?: boolean;
}

export type ShortcutEvent = Pick<
  KeyboardEvent,
  "ctrlKey" | "key" | "metaKey" | "shiftKey"
>;

export const PALETTE_SHORTCUT: Shortcut = { key: "k", mod: true };
export const DOWNLOAD_SHORTCUT: Shortcut = { key: "e", mod: true, shift: true };
export const SHUFFLE_SHORTCUT: Shortcut = { key: "s", mod: true, shift: true };

export function matchesShortcut(event: ShortcutEvent, shortcut: Shortcut) {
  const mod = event.metaKey || event.ctrlKey;
  return (
    event.key.toLowerCase() === shortcut.key &&
    mod === Boolean(shortcut.mod) &&
    event.shiftKey === Boolean(shortcut.shift)
  );
}

/** Key labels for display, e.g. ["Ctrl", "Shift", "E"] or ["⌘", "⇧", "E"]. */
export function shortcutKeys(shortcut: Shortcut, isMac: boolean): string[] {
  const keys: string[] = [];
  if (shortcut.mod) {
    keys.push(isMac ? "⌘" : "Ctrl");
  }
  if (shortcut.shift) {
    keys.push(isMac ? "⇧" : "Shift");
  }
  keys.push(shortcut.key.toUpperCase());
  return keys;
}

const MAC_PATTERN = /Mac|iPhone|iPad|iPod/;

export function isMacPlatform(): boolean {
  if (typeof navigator === "undefined") {
    return false;
  }
  return MAC_PATTERN.test(navigator.platform || navigator.userAgent);
}
