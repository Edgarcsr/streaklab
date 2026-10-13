import { useId } from 'react'

import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'

type SliderFieldProps = {
  label: string
  value: number
  min: number
  max: number
  step?: number
  disabled?: boolean
  format?: (value: number) => string
  onChange: (value: number) => void
}

export function SliderField({
  label,
  value,
  min,
  max,
  step = 1,
  disabled,
  format = String,
  onChange,
}: SliderFieldProps) {
  const id = useId()

  return (
    <div className="grid gap-2.5" data-disabled={disabled || undefined}>
      <div className="flex items-baseline justify-between">
        <Label htmlFor={id} className={disabled ? 'opacity-50' : undefined}>
          {label}
        </Label>
        <output
          htmlFor={id}
          className="font-mono text-xs text-muted-foreground tabular-nums"
        >
          {format(value)}
        </output>
      </div>
      <Slider
        id={id}
        value={[value]}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        onValueChange={([next]) => onChange(next)}
      />
    </div>
  )
}
