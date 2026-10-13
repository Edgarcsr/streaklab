import { useState } from 'react'

import { StreakCanvas } from '@/components/streak-canvas'
import { DEFAULT_PARAMS } from '@/lib/presets'

export default function App() {
  const [params] = useState(DEFAULT_PARAMS)

  return (
    <main className="mx-auto max-w-5xl p-6">
      <div className="overflow-hidden rounded-xl border">
        <StreakCanvas params={params} />
      </div>
    </main>
  )
}
