import { useEffect, useRef } from 'react'

import { cn } from '@/lib/utils'
import { renderStreaks, type StreakParams } from '@/lib/streaks'

/** The preview is drawn at this width and scaled down by CSS. */
export const PREVIEW_WIDTH = 1280

type StreakCanvasProps = {
  params: StreakParams
  /** Aspect ratio of the image, so the preview matches the export. */
  aspect: number
  className?: string
}

export function StreakCanvas({ params, aspect, className }: StreakCanvasProps) {
  const height = Math.round(PREVIEW_WIDTH / aspect)
  const ref = useRef<HTMLCanvasElement>(null)

  // One paint per frame, so dragging a slider never queues up stale renders.
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      if (ref.current) {
        renderStreaks(ref.current, params, PREVIEW_WIDTH, height)
      }
    })
    return () => cancelAnimationFrame(id)
  }, [params, height])

  return (
    <canvas
      ref={ref}
      width={PREVIEW_WIDTH}
      height={height}
      role="img"
      aria-label="Preview of the generated background"
      className={cn('block h-auto w-full', className)}
    />
  )
}
