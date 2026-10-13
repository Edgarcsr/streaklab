import { useEffect, useRef } from "react";
import { renderStreaks, type StreakParams } from "@/lib/streaks";
import { cn } from "@/lib/utils";

/** The preview is drawn at this width and scaled down by CSS. */
export const PREVIEW_WIDTH = 1280;

interface StreakCanvasProps {
  /** Aspect ratio of the image, so the preview matches the export. */
  aspect: number;
  className?: string;
  params: StreakParams;
}

export function StreakCanvas({ params, aspect, className }: StreakCanvasProps) {
  const height = Math.round(PREVIEW_WIDTH / aspect);
  const ref = useRef<HTMLCanvasElement>(null);

  // One paint per frame, so dragging a slider never queues up stale renders.
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      if (ref.current) {
        renderStreaks(ref.current, params, PREVIEW_WIDTH, height);
      }
    });
    return () => cancelAnimationFrame(id);
  }, [params, height]);

  return (
    <canvas
      aria-label="Preview of the generated background"
      className={cn("block h-auto w-full", className)}
      height={height}
      ref={ref}
      role="img"
      width={PREVIEW_WIDTH}
    />
  );
}
