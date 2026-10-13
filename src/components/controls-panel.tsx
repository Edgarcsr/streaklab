import {
  Aperture,
  Compass,
  Layers,
  type LucideIcon,
  Palette,
  Slash,
  Sparkles,
} from "lucide-react";
import type { ReactNode } from "react";

import { ColorField } from "@/components/color-field";
import { SliderField } from "@/components/slider-field";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { applyPreset, PRESETS } from "@/lib/presets";
import type { StreakMode, StreakParams } from "@/lib/streaks";
import { cn } from "@/lib/utils";

interface ControlsPanelProps {
  onChange: (patch: Partial<StreakParams>) => void;
  params: StreakParams;
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
}) {
  return (
    <section className="grid gap-4 border-b p-5 last:border-b-0">
      <h2 className="flex items-center gap-2 font-semibold text-sm tracking-tight">
        <Icon aria-hidden className="size-4 text-muted-foreground" />
        {title}
      </h2>
      {children}
    </section>
  );
}

const percent = (v: number) => `${Math.round(v * 100)}%`;

export function ControlsPanel({ params, onChange }: ControlsPanelProps) {
  const radial = params.mode === "radial";

  return (
    <div className="rounded-xl border bg-card">
      <Section icon={Palette} title="Palette">
        <div className="grid grid-cols-2 gap-2">
          {PRESETS.map((preset) => {
            const next = applyPreset(preset, params.seed);
            const active =
              next.mode === params.mode &&
              next.shadow === params.shadow &&
              next.mid === params.mid &&
              next.light === params.light &&
              next.streak === params.streak;
            return (
              <button
                aria-pressed={active}
                className={cn(
                  "overflow-hidden rounded-lg border text-left outline-none transition-shadow focus-visible:ring-[3px] focus-visible:ring-ring/50",
                  active && "ring-2 ring-foreground"
                )}
                key={preset.id}
                onClick={() =>
                  onChange({
                    angle: next.angle,
                    light: next.light,
                    mid: next.mid,
                    mode: next.mode,
                    shadow: next.shadow,
                    streak: next.streak,
                  })
                }
                type="button"
              >
                <span
                  className="block h-9"
                  style={{
                    background: `linear-gradient(110deg, ${next.shadow}, ${next.mid} 55%, ${next.light})`,
                  }}
                />
                <span className="block px-2.5 py-1.5 font-medium text-sm">
                  {preset.name}
                </span>
              </button>
            );
          })}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <ColorField
            label="Shadow"
            onChange={(shadow) => onChange({ shadow })}
            value={params.shadow}
          />
          <ColorField
            label="Midtone"
            onChange={(mid) => onChange({ mid })}
            value={params.mid}
          />
          <ColorField
            label="Highlight"
            onChange={(light) => onChange({ light })}
            value={params.light}
          />
          <ColorField
            label="Streaks"
            onChange={(streak) => onChange({ streak })}
            value={params.streak}
          />
        </div>
      </Section>

      <Section icon={Compass} title="Direction">
        <ToggleGroup
          aria-label="Streak layout"
          className="w-full"
          onValueChange={(mode) =>
            mode && onChange({ mode: mode as StreakMode })
          }
          type="single"
          value={params.mode}
        >
          <ToggleGroupItem className="flex-1" value="diagonal">
            <Slash aria-hidden className="size-4" />
            Diagonal
          </ToggleGroupItem>
          <ToggleGroupItem className="flex-1" value="radial">
            <Aperture aria-hidden className="size-4" />
            Radial
          </ToggleGroupItem>
        </ToggleGroup>
        <SliderField
          disabled={radial}
          format={(v) => `${v}°`}
          hint="Inclinação das streaks em graus (desativado no modo radial)"
          label="Angle"
          max={60}
          min={-60}
          onChange={(angle) => onChange({ angle })}
          value={params.angle}
        />
        <SliderField
          disabled={radial}
          format={(v) => `${v}°`}
          hint="Abertura do leque de streaks em graus (desativado no modo radial)"
          label="Spread"
          max={24}
          min={0}
          onChange={(fan) => onChange({ fan })}
          value={params.fan}
        />
      </Section>

      <Section icon={Sparkles} title="Streaks">
        <SliderField
          label="Amount"
          max={300}
          min={10}
          onChange={(count) => onChange({ count })}
          value={params.count}
        />
        <SliderField
          format={percent}
          label="Brightness"
          max={2}
          min={0.2}
          onChange={(intensity) => onChange({ intensity })}
          step={0.05}
          value={params.intensity}
        />
        <SliderField
          format={(v) => `${v.toFixed(2)}×`}
          hint="Espessura de todas as streaks"
          label="Thickness"
          max={2.5}
          min={0.4}
          onChange={(thickness) => onChange({ thickness })}
          step={0.05}
          value={params.thickness}
        />
        <SliderField
          format={percent}
          hint="Halo luminoso em volta das streaks"
          label="Glow"
          max={2}
          min={0}
          onChange={(glow) => onChange({ glow })}
          step={0.05}
          value={params.glow}
        />
      </Section>

      <Section icon={Layers} title="Texture">
        <SliderField
          hint="Granulação de filme sobreposta ao fundo"
          label="Grain"
          max={100}
          min={0}
          onChange={(grain) => onChange({ grain })}
          value={params.grain}
        />
      </Section>
    </div>
  );
}
