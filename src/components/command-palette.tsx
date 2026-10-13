import { Download, Monitor, Moon, Shuffle, Sun } from "lucide-react";
import { useEffect } from "react";

import { SIZE_ICONS } from "@/components/size-icons";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import {
  DOWNLOAD_SHORTCUT,
  isMacPlatform,
  matchesShortcut,
  PALETTE_SHORTCUT,
  SHUFFLE_SHORTCUT,
  type Shortcut,
  shortcutKeys,
} from "@/lib/commands";
import { EXPORT_SIZES, type ExportSize, sizeLabel } from "@/lib/export";
import type { ResolvedTheme, ThemeMode } from "@/lib/theme";

interface CommandPaletteProps {
  busy: boolean;
  onDownload: () => void;
  onOpenChange: (open: boolean) => void;
  onShuffle: () => void;
  onSizeChange: (size: ExportSize) => void;
  onThemeChange: (mode: ThemeMode) => void;
  open: boolean;
  resolvedTheme: ResolvedTheme;
  size: ExportSize;
  theme: ThemeMode;
}

const THEME_OPTIONS: { icon: typeof Sun; label: string; mode: ThemeMode }[] = [
  { icon: Sun, label: "Claro", mode: "light" },
  { icon: Moon, label: "Escuro", mode: "dark" },
  { icon: Monitor, label: "Sistema", mode: "system" },
];

/** Renders a shortcut as keycaps, using ⌘ on macOS and Ctrl elsewhere. */
export function ShortcutKeys({ shortcut }: { shortcut: Shortcut }) {
  return (
    <KbdGroup>
      {shortcutKeys(shortcut, isMacPlatform()).map((key) => (
        <Kbd key={key}>{key}</Kbd>
      ))}
    </KbdGroup>
  );
}

export function CommandPalette({
  open,
  onOpenChange,
  busy,
  onDownload,
  onShuffle,
  size,
  onSizeChange,
  theme,
  resolvedTheme,
  onThemeChange,
}: CommandPaletteProps) {
  // Global shortcuts. Each one runs the same handler as its button.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (matchesShortcut(event, PALETTE_SHORTCUT)) {
        event.preventDefault();
        onOpenChange(!open);
      } else if (matchesShortcut(event, DOWNLOAD_SHORTCUT)) {
        event.preventDefault();
        if (!busy) {
          onDownload();
        }
      } else if (matchesShortcut(event, SHUFFLE_SHORTCUT)) {
        event.preventDefault();
        onShuffle();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, busy, onOpenChange, onDownload, onShuffle]);

  // Close first so focus returns to the page before the action runs.
  const run = (action: () => void) => {
    onOpenChange(false);
    action();
  };

  return (
    <CommandDialog onOpenChange={onOpenChange} open={open}>
      <CommandInput placeholder="Digite um comando…" />
      <CommandList>
        <CommandEmpty>Nenhum comando encontrado.</CommandEmpty>

        <CommandGroup heading="Ações">
          <CommandItem
            disabled={busy}
            keywords={["png", "exportar", "download", "baixar"]}
            onSelect={() => run(onDownload)}
            value="Baixar PNG"
          >
            <Download aria-hidden className="size-4" />
            Baixar PNG
            <CommandShortcut>
              <ShortcutKeys shortcut={DOWNLOAD_SHORTCUT} />
            </CommandShortcut>
          </CommandItem>
          <CommandItem
            keywords={["seed", "aleatório", "random", "sortear"]}
            onSelect={() => run(onShuffle)}
            value="Embaralhar seed"
          >
            <Shuffle aria-hidden className="size-4" />
            Embaralhar seed
            <CommandShortcut>
              <ShortcutKeys shortcut={SHUFFLE_SHORTCUT} />
            </CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandGroup heading="Tamanho da imagem">
          {EXPORT_SIZES.map((option) => {
            const Icon = SIZE_ICONS[option.id];
            return (
              <CommandItem
                key={option.id}
                keywords={["resolução", "tamanho", "size"]}
                onSelect={() => run(() => onSizeChange(option))}
                value={`Tamanho ${sizeLabel(option)}`}
              >
                <Icon aria-hidden className="size-4" />
                {sizeLabel(option)}
                {option.id === size.id && (
                  <CommandShortcut>atual</CommandShortcut>
                )}
              </CommandItem>
            );
          })}
        </CommandGroup>

        <CommandGroup heading="Tema">
          <CommandItem
            keywords={["dark", "light", "modo", "inverter"]}
            onSelect={() =>
              run(() =>
                onThemeChange(resolvedTheme === "dark" ? "light" : "dark")
              )
            }
            value="Alternar tema"
          >
            {resolvedTheme === "dark" ? (
              <Sun aria-hidden className="size-4" />
            ) : (
              <Moon aria-hidden className="size-4" />
            )}
            Alternar tema
          </CommandItem>
          {THEME_OPTIONS.map(({ icon: Icon, label, mode }) => (
            <CommandItem
              key={mode}
              onSelect={() => run(() => onThemeChange(mode))}
              value={`Tema ${label}`}
            >
              <Icon aria-hidden className="size-4" />
              {label}
              {mode === theme && <CommandShortcut>atual</CommandShortcut>}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
