import type { ReactNode } from 'react'

import { ColorField } from '@/components/color-field'
import { SliderField } from '@/components/slider-field'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { applyPreset, PRESETS } from '@/lib/presets'
import type { StreakMode, StreakParams } from '@/lib/streaks'
import { cn } from '@/lib/utils'

type ControlsPanelProps = {
  params: StreakParams
  onChange: (patch: Partial<StreakParams>) => void
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="grid gap-4 border-b p-5 last:border-b-0">
      <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  )
}

const percent = (v: number) => `${Math.round(v * 100)}%`

export function ControlsPanel({ params, onChange }: ControlsPanelProps) {
  const radial = params.mode === 'radial'

  return (
    <div className="rounded-xl border bg-card">
      <Section title="Palette">
        <div className="grid grid-cols-2 gap-2">
          {PRESETS.map((preset) => {
            const next = applyPreset(preset, params.seed)
            const active =
              next.mode === params.mode &&
              next.shadow === params.shadow &&
              next.mid === params.mid &&
              next.light === params.light &&
              next.streak === params.streak
            return (
              <button
                key={preset.id}
                type="button"
                aria-pressed={active}
                onClick={() =>
                  onChange({
                    mode: next.mode,
                    shadow: next.shadow,
                    mid: next.mid,
                    light: next.light,
                    streak: next.streak,
                    angle: next.angle,
                  })
                }
                className={cn(
                  'overflow-hidden rounded-lg border text-left transition-shadow outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
                  active && 'ring-2 ring-foreground',
                )}
              >
                <span
                  className="block h-9"
                  style={{
                    background: `linear-gradient(110deg, ${next.shadow}, ${next.mid} 55%, ${next.light})`,
                  }}
                />
                <span className="block px-2.5 py-1.5 text-sm font-medium">
                  {preset.name}
                </span>
              </button>
            )
          })}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <ColorField label="Shadow" value={params.shadow} onChange={(shadow) => onChange({ shadow })} />
          <ColorField label="Midtone" value={params.mid} onChange={(mid) => onChange({ mid })} />
          <ColorField label="Highlight" value={params.light} onChange={(light) => onChange({ light })} />
          <ColorField label="Streaks" value={params.streak} onChange={(streak) => onChange({ streak })} />
        </div>
      </Section>

      <Section title="Direction">
        <ToggleGroup
          type="single"
          aria-label="Streak layout"
          value={params.mode}
          onValueChange={(mode) => mode && onChange({ mode: mode as StreakMode })}
          className="w-full"
        >
          <ToggleGroupItem value="diagonal" className="flex-1">
            Diagonal
          </ToggleGroupItem>
          <ToggleGroupItem value="radial" className="flex-1">
            Radial
          </ToggleGroupItem>
        </ToggleGroup>
        <SliderField
          label="Angle"
          value={params.angle}
          min={-60}
          max={60}
          disabled={radial}
          format={(v) => `${v}°`}
          onChange={(angle) => onChange({ angle })}
        />
        <SliderField
          label="Spread"
          value={params.fan}
          min={0}
          max={24}
          disabled={radial}
          format={(v) => `${v}°`}
          onChange={(fan) => onChange({ fan })}
        />
      </Section>

      <Section title="Streaks">
        <SliderField
          label="Amount"
          value={params.count}
          min={10}
          max={300}
          onChange={(count) => onChange({ count })}
        />
        <SliderField
          label="Brightness"
          value={params.intensity}
          min={0.2}
          max={2}
          step={0.05}
          format={percent}
          onChange={(intensity) => onChange({ intensity })}
        />
        <SliderField
          label="Thickness"
          value={params.thickness}
          min={0.4}
          max={2.5}
          step={0.05}
          format={(v) => `${v.toFixed(2)}×`}
          onChange={(thickness) => onChange({ thickness })}
        />
        <SliderField
          label="Glow"
          value={params.glow}
          min={0}
          max={2}
          step={0.05}
          format={percent}
          onChange={(glow) => onChange({ glow })}
        />
      </Section>

      <Section title="Texture">
        <SliderField
          label="Grain"
          value={params.grain}
          min={0}
          max={100}
          onChange={(grain) => onChange({ grain })}
        />
      </Section>
    </div>
  )
}
