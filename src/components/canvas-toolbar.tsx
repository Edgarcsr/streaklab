import { Download, Shuffle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { EXPORT_SIZES, sizeLabel, type ExportSize } from '@/lib/export'

type CanvasToolbarProps = {
  seed: number
  size: ExportSize
  busy: boolean
  onShuffle: () => void
  onSizeChange: (size: ExportSize) => void
  onDownload: () => void
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
        <Button variant="outline" onClick={onShuffle}>
          <Shuffle />
          Shuffle
        </Button>
        <span className="font-mono text-xs text-muted-foreground">
          seed {seed}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <ToggleGroup
          type="single"
          aria-label="Image size"
          value={size.id}
          onValueChange={(id) => {
            const next = EXPORT_SIZES.find((s) => s.id === id)
            if (next) onSizeChange(next)
          }}
        >
          {EXPORT_SIZES.map((s) => (
            <ToggleGroupItem key={s.id} value={s.id} className="font-mono text-xs">
              {sizeLabel(s)}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <Button onClick={onDownload} disabled={busy}>
          <Download />
          {busy ? 'Rendering…' : 'Download PNG'}
        </Button>
      </div>
    </div>
  )
}
