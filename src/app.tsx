import { Command } from "lucide-react";
import { type CSSProperties, useCallback, useState } from "react";

import { CanvasToolbar } from "@/components/canvas-toolbar";
import { CommandPalette, ShortcutKeys } from "@/components/command-palette";
import { ControlsPanel } from "@/components/controls-panel";
import { StreakCanvas } from "@/components/streak-canvas";
import { ThemeSelect } from "@/components/theme-select";
import { Button } from "@/components/ui/button";

import { useTheme } from "@/hooks/use-theme";
import { PALETTE_SHORTCUT } from "@/lib/commands";
import { downloadPng, EXPORT_SIZES } from "@/lib/export";
import { DEFAULT_PARAMS } from "@/lib/presets";
import type { StreakParams } from "@/lib/streaks";

const randomSeed = () => Math.floor(Math.random() * 1_000_000) + 1;

export default function App() {
  const { mode, resolved, setMode } = useTheme();
  const [params, setParams] = useState<StreakParams>(DEFAULT_PARAMS);
  const [size, setSize] = useState(EXPORT_SIZES[1]);
  const [busy, setBusy] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  const update = useCallback(
    (patch: Partial<StreakParams>) => setParams((p) => ({ ...p, ...patch })),
    []
  );

  const shuffle = useCallback(() => update({ seed: randomSeed() }), [update]);

  const download = useCallback(async () => {
    setBusy(true);
    try {
      // Let the button repaint before the main thread gets busy.
      await new Promise((resolve) => requestAnimationFrame(resolve));
      await downloadPng(params, size);
    } finally {
      setBusy(false);
    }
  }, [params, size]);

  return (
    <div
      className="min-h-screen"
      style={{ "--live": params.mid } as CSSProperties}
    >
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 pt-6 pb-4">
        <h1 className="font-semibold text-xl tracking-tight">streaklab</h1>
        <div className="flex items-center gap-3">
          <p className="text-muted-foreground text-sm">
            Grainy light-streak backgrounds
          </p>
          <Button
            aria-label="Abrir comandos (atalho Ctrl K ou ⌘ K)"
            onClick={() => setPaletteOpen(true)}
            size="sm"
            variant="outline"
          >
            <Command aria-hidden className="size-4" />
            Comandos
            <ShortcutKeys shortcut={PALETTE_SHORTCUT} />
          </Button>
          <ThemeSelect onChange={setMode} value={mode} />
        </div>
      </header>

      <CommandPalette
        busy={busy}
        onDownload={download}
        onOpenChange={setPaletteOpen}
        onShuffle={shuffle}
        onSizeChange={setSize}
        onThemeChange={setMode}
        open={paletteOpen}
        resolvedTheme={resolved}
        size={size}
        theme={mode}
      />

      <main className="mx-auto grid max-w-6xl gap-6 px-6 pb-10 lg:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="lg:sticky lg:top-6 lg:self-start">
          <div className="overflow-hidden rounded-xl border">
            <StreakCanvas aspect={size.width / size.height} params={params} />
          </div>
          <CanvasToolbar
            busy={busy}
            onDownload={download}
            onShuffle={shuffle}
            onSizeChange={setSize}
            seed={params.seed}
            size={size}
          />
        </div>
        <ControlsPanel onChange={update} params={params} />
      </main>
    </div>
  );
}
