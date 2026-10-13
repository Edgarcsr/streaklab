import { Download, Shuffle } from "lucide-react";

import { ShortcutKeys } from "@/components/command-palette";
import { SIZE_ICONS } from "@/components/size-icons";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DOWNLOAD_SHORTCUT, SHUFFLE_SHORTCUT } from "@/lib/commands";
import { EXPORT_SIZES, type ExportSize, sizeLabel } from "@/lib/export";

interface CanvasToolbarProps {
  busy: boolean;
  onDownload: () => void;
  onShuffle: () => void;
  onSizeChange: (size: ExportSize) => void;
  seed: number;
  size: ExportSize;
}

export function CanvasToolbar({
  seed,
  size,
  busy,
  onShuffle,
  onSizeChange,
  onDownload,
}: CanvasToolbarProps) {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={onShuffle} variant="outline">
              <Shuffle aria-hidden className="size-4" />
              Shuffle
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Embaralhar seed
            <ShortcutKeys shortcut={SHUFFLE_SHORTCUT} />
          </TooltipContent>
        </Tooltip>
        <span className="font-mono text-muted-foreground text-xs">
          seed {seed}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <ToggleGroup
          aria-label="Image size"
          onValueChange={(id) => {
            const next = EXPORT_SIZES.find((s) => s.id === id);
            if (next) {
              onSizeChange(next);
            }
          }}
          type="single"
          value={size.id}
        >
          {EXPORT_SIZES.map((s) => {
            const Icon = SIZE_ICONS[s.id];
            return (
              <ToggleGroupItem
                className="font-mono text-xs"
                key={s.id}
                value={s.id}
              >
                <Icon aria-hidden className="size-4" />
                {sizeLabel(s)}
              </ToggleGroupItem>
            );
          })}
        </ToggleGroup>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button disabled={busy} onClick={onDownload}>
              <Download aria-hidden className="size-4" />
              {busy ? "Rendering…" : "Download PNG"}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Baixar PNG
            <ShortcutKeys shortcut={DOWNLOAD_SHORTCUT} />
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
