import { describe, expect, it } from "vitest";
import { EXPORT_SIZES, exportFileName, sizeLabel } from "@/lib/export";
import { DEFAULT_PARAMS } from "@/lib/presets";

describe("export", () => {
  it("names files after seed and size", () => {
    const og = EXPORT_SIZES.find((s) => s.id === "og")!;
    expect(exportFileName({ ...DEFAULT_PARAMS, seed: 99 }, og)).toBe(
      "streaklab-99-1200x630.png"
    );
  });

  it("labels sizes", () => {
    expect(sizeLabel(EXPORT_SIZES[0])).toBe("1280×720");
  });
});
