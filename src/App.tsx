import { useCallback, useState, type CSSProperties } from 'react'

import { ControlsPanel } from '@/components/controls-panel'
import { StreakCanvas } from '@/components/streak-canvas'
import { DEFAULT_PARAMS } from '@/lib/presets'
import type { StreakParams } from '@/lib/streaks'

export default function App() {
  const [params, setParams] = useState<StreakParams>(DEFAULT_PARAMS)

  const update = useCallback(
    (patch: Partial<StreakParams>) => setParams((p) => ({ ...p, ...patch })),
    [],
  )

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
            <StreakCanvas params={params} />
          </div>
        </div>
        <ControlsPanel params={params} onChange={update} />
      </main>
    </div>
  )
}
