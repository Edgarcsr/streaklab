import type { StreakParams } from '@/lib/streaks'

export const DEFAULT_PARAMS: StreakParams = {
  mode: 'diagonal',
  shadow: '#08331a',
  mid: '#1c9a42',
  light: '#62d86c',
  streak: '#aaff96',
  angle: -24,
  fan: 7,
  count: 120,
  intensity: 1.2,
  thickness: 1,
  glow: 1,
  grain: 40,
  seed: 7,
}

export type Preset = {
  id: string
  name: string
  params: Partial<StreakParams>
}

export const PRESETS: Preset[] = [
  {
    id: 'moss',
    name: 'Moss',
    params: {},
  },
  {
    id: 'lagoon',
    name: 'Lagoon',
    params: {
      mode: 'diagonal',
      shadow: '#0b5a68',
      mid: '#12c4c0',
      light: '#45ead8',
      streak: '#c8fff8',
      angle: -30,
    },
  },
  {
    id: 'ultraviolet',
    name: 'Ultraviolet',
    params: {
      mode: 'radial',
      shadow: '#150b80',
      mid: '#3320d4',
      light: '#4a2be0',
      streak: '#a5b9ff',
      count: 130,
      intensity: 1.2,
    },
  },
  {
    id: 'ember',
    name: 'Ember',
    params: {
      mode: 'diagonal',
      shadow: '#3b0a0a',
      mid: '#d6402a',
      light: '#ffb454',
      streak: '#ffdcaa',
      angle: -26,
    },
  },
]

/** A preset applied on top of the defaults, keeping the current seed. */
export function applyPreset(preset: Preset, seed: number): StreakParams {
  return { ...DEFAULT_PARAMS, ...preset.params, seed }
}
