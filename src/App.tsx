import { useCallback, useState, type CSSProperties } from 'react'

import { CanvasToolbar } from '@/components/canvas-toolbar'
import { ControlsPanel } from '@/components/controls-panel'
import { StreakCanvas } from '@/components/streak-canvas'
import { downloadPng, EXPORT_SIZES } from '@/lib/export'
import { DEFAULT_PARAMS } from '@/lib/presets'
import type { StreakParams } from '@/lib/streaks'

const randomSeed = () => Math.floor(Math.random() * 1_000_000) + 1

export default function App() {
  const [params, setParams] = useState<StreakParams>(DEFAULT_PARAMS)
  const [size, setSize] = useState(EXPORT_SIZES[1])
  const [busy, setBusy] = useState(false)

  const update = useCallback(
    (patch: Partial<StreakParams>) => setParams((p) => ({ ...p, ...patch })),
    [],
  )

  const download = async () => {
    setBusy(true)
    try {
      // Let the button repaint before the main thread gets busy.
      await new Promise((resolve) => requestAnimationFrame(resolve))
      await downloadPng(params, size)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div
      className="min-h-screen"
      style={{ '--live': params.mid } as CSSProperties}
    >
      <header className="mx-auto flex max-w-6xl items-baseline justify-between px-6 pt-6 pb-4">
        <h1 className="text-xl font-semibold tracking-tight">streaklab</h1>
        <p className="text-sm text-muted-foreground">
          Grainy light-streak backgrounds
        </p>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-6 pb-10 lg:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="lg:sticky lg:top-6 lg:self-start">
          <div className="overflow-hidden rounded-xl border">
            <StreakCanvas params={params} aspect={size.width / size.height} />
          </div>
          <CanvasToolbar
            seed={params.seed}
            size={size}
            busy={busy}
            onShuffle={() => update({ seed: randomSeed() })}
            onSizeChange={setSize}
            onDownload={download}
          />
        </div>
        <ControlsPanel params={params} onChange={update} />
      </main>
    </div>
  )
}
