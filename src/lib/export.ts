import { renderStreaks, type StreakParams } from "@/lib/streaks";

export interface ExportSize {
  height: number;
  id: string;
  width: number;
}

export const EXPORT_SIZES: ExportSize[] = [
  { height: 720, id: "hd", width: 1280 },
  { height: 1080, id: "fhd", width: 1920 },
  { height: 1440, id: "qhd", width: 2560 },
  { height: 630, id: "og", width: 1200 },
];

export const sizeLabel = (s: ExportSize) => `${s.width}×${s.height}`;

export function exportFileName(params: StreakParams, size: ExportSize) {
  return `streaklab-${params.seed}-${size.width}x${size.height}.png`;
}

/** Renders the image off-screen at full size and saves it as a PNG. */
export async function downloadPng(params: StreakParams, size: ExportSize) {
  const canvas = document.createElement("canvas");
  renderStreaks(canvas, params, size.width, size.height);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/png")
  );
  if (!blob) {
    throw new Error("Could not encode the image as PNG");
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = exportFileName(params, size);
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
