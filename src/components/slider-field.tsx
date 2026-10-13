import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'

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
  return (
    <div className="grid gap-2.5" data-disabled={disabled || undefined}>
      <div className="flex items-baseline justify-between">
        <span className={cn('text-sm font-medium', disabled && 'opacity-50')}>
          {label}
        </span>
        <span className="font-mono text-xs text-muted-foreground tabular-nums">
          {format(value)}
        </span>
      </div>
      <Slider
        aria-label={label}
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
