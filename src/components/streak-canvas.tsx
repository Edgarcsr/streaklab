import { useEffect, useRef } from 'react'

import { cn } from '@/lib/utils'
import { renderStreaks, type StreakParams } from '@/lib/streaks'

/** The preview is always drawn at 16:9, then scaled by CSS. */
export const PREVIEW_WIDTH = 1280
export const PREVIEW_HEIGHT = 720

type StreakCanvasProps = {
  params: StreakParams
  className?: string
}

export function StreakCanvas({ params, className }: StreakCanvasProps) {
  const ref = useRef<HTMLCanvasElement>(null)

  // One paint per frame, so dragging a slider never queues up stale renders.
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      if (ref.current) {
        renderStreaks(ref.current, params, PREVIEW_WIDTH, PREVIEW_HEIGHT)
      }
    })
    return () => cancelAnimationFrame(id)
  }, [params])

  return (
    <canvas
      ref={ref}
      width={PREVIEW_WIDTH}
      height={PREVIEW_HEIGHT}
      role="img"
      aria-label="Preview of the generated background"
      className={cn('block h-auto w-full', className)}
    />
  )
}
