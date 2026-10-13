import type { StreakParams } from "@/lib/streaks";

export const DEFAULT_PARAMS: StreakParams = {
  angle: -24,
  count: 120,
  fan: 7,
  glow: 1,
  grain: 40,
  intensity: 1.2,
  light: "#62d86c",
  mid: "#1c9a42",
  mode: "diagonal",
  seed: 7,
  shadow: "#08331a",
  streak: "#aaff96",
  thickness: 1,
};

export interface Preset {
  id: string;
  name: string;
  params: Partial<StreakParams>;
}

export const PRESETS: Preset[] = [
  {
    id: "moss",
    name: "Moss",
    params: {},
  },
  {
    id: "lagoon",
    name: "Lagoon",
    params: {
      angle: -30,
      light: "#45ead8",
      mid: "#12c4c0",
      mode: "diagonal",
      shadow: "#0b5a68",
      streak: "#c8fff8",
    },
  },
  {
    id: "ultraviolet",
    name: "Ultraviolet",
    params: {
      count: 130,
      intensity: 1.2,
      light: "#6f8bff",
      mid: "#2b1bd0",
      mode: "radial",
      shadow: "#0b0560",
      streak: "#b9c8ff",
    },
  },
  {
    id: "ember",
    name: "Ember",
    params: {
      angle: -26,
      light: "#ffb454",
      mid: "#d6402a",
      mode: "diagonal",
      shadow: "#3b0a0a",
      streak: "#ffdcaa",
    },
  },
];

/** A preset applied on top of the defaults, keeping the current seed. */
export function applyPreset(preset: Preset, seed: number): StreakParams {
  return { ...DEFAULT_PARAMS, ...preset.params, seed };
}
