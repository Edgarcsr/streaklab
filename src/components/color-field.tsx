import {
  ColorPicker,
  ColorPickerEyeDropper,
  ColorPickerFormat,
  ColorPickerHue,
  ColorPickerOutput,
  ColorPickerSelection,
} from '@/components/ui/color-picker'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

type ColorFieldProps = {
  label: string
  value: string
  onChange: (hex: string) => void
}

export function ColorField({ label, value, onChange }: ColorFieldProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2.5 rounded-lg border bg-card p-1.5 pr-3 text-left transition-colors outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <span
            className="size-8 shrink-0 rounded-md border border-black/10"
            style={{ backgroundColor: value }}
          />
          <span className="min-w-0 leading-tight">
            <span className="block text-sm font-medium">{label}</span>
            <span className="block font-mono text-xs text-muted-foreground">
              {value}
            </span>
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72">
        <ColorPicker value={value} onChange={onChange}>
          <ColorPickerSelection />
          <div className="flex items-center gap-3">
            <ColorPickerEyeDropper />
            <ColorPickerHue />
          </div>
          <div className="flex items-center gap-2">
            <ColorPickerOutput />
            <ColorPickerFormat />
          </div>
        </ColorPicker>
      </PopoverContent>
    </Popover>
  )
}
