import { Image, Maximize, Maximize2, Monitor } from "lucide-react";
import type { ExportSize } from "@/lib/export";

/** Icon per export size, so the size picker can be scanned at a glance. */
export const SIZE_ICONS: Record<ExportSize["id"], typeof Monitor> = {
  fhd: Maximize,
  hd: Monitor,
  og: Image,
  qhd: Maximize2,
};
