import * as React from 'react'
import { Slider as SliderPrimitive } from 'radix-ui'
import { Pipette } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  hexToRgb,
  hsvToRgb,
  rgbToHex,
  rgbToHsl,
  rgbToHsv,
  type HSV,
} from '@/lib/color'
import { cn } from '@/lib/utils'

/*
 * Color picker with the compound-component API of the shadcn.io one:
 *
 *   <ColorPicker value={hex} onChange={setHex}>
 *     <ColorPickerSelection />
 *     <ColorPickerEyeDropper />
 *     <ColorPickerHue />
 *     <ColorPickerOutput />
 *     <ColorPickerFormat />
 *   </ColorPicker>
 *
 * Values are opaque `#rrggbb` strings. State is kept as HSV internally so the
 * hue does not jump when saturation or brightness hit zero.
 */

declare global {
  interface Window {
    EyeDropper?: new () => { open: () => Promise<{ sRGBHex: string }> }
  }
}

type Format = 'hex' | 'rgb' | 'hsl'

type ColorPickerContextValue = {
  hsv: HSV
  hex: string
  setHsv: (next: Partial<HSV>) => void
  setHex: (hex: string) => boolean
  format: Format
  setFormat: (format: Format) => void
}

const ColorPickerContext = React.createContext<ColorPickerContextValue | null>(
  null,
)

function useColorPicker() {
  const ctx = React.useContext(ColorPickerContext)
  if (!ctx) throw new Error('ColorPicker parts must be used inside <ColorPicker>')
  return ctx
}

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n))

type ColorPickerProps = Omit<React.ComponentProps<'div'>, 'onChange'> & {
  value?: string
  defaultValue?: string
  onChange?: (hex: string) => void
}

function ColorPicker({
  value,
  defaultValue = '#3420d6',
  onChange,
  className,
  ...props
}: ColorPickerProps) {
  const [hsv, setHsvState] = React.useState<HSV>(() =>
    rgbToHsv(hexToRgb(value ?? defaultValue) ?? [0, 0, 0]),
  )
  const [syncedValue, setSyncedValue] = React.useState(value)
  const [format, setFormat] = React.useState<Format>('hex')
  const hsvRef = React.useRef(hsv)

  const hex = rgbToHex(hsvToRgb(hsv))

  // Follow external changes (e.g. picking a preset) without fighting our own.
  if (value !== undefined && value !== syncedValue) {
    setSyncedValue(value)
    const rgb = hexToRgb(value)
    if (rgb && value.toLowerCase() !== hex) {
      setHsvState(rgbToHsv(rgb))
    }
  }

  React.useEffect(() => {
    hsvRef.current = hsv
  }, [hsv])

  const setHsv = React.useCallback(
    (partial: Partial<HSV>) => {
      const next = { ...hsvRef.current, ...partial }
      hsvRef.current = next
      setHsvState(next)
      onChange?.(rgbToHex(hsvToRgb(next)))
    },
    [onChange],
  )

  const setHex = React.useCallback(
    (input: string) => {
      const rgb = hexToRgb(input)
      if (!rgb) return false
      setHsv(rgbToHsv(rgb))
      return true
    },
    [setHsv],
  )

  const ctx = React.useMemo(
    () => ({ hsv, hex, setHsv, setHex, format, setFormat }),
    [hsv, hex, setHsv, setHex, format],
  )

  return (
    <ColorPickerContext.Provider value={ctx}>
      <div
        data-slot="color-picker"
        className={cn('flex flex-col gap-3', className)}
        {...props}
      />
    </ColorPickerContext.Provider>
  )
}

function ColorPickerSelection({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const { hsv, hex, setHsv } = useColorPicker()
  const ref = React.useRef<HTMLDivElement>(null)
  const dragging = React.useRef(false)

  const update = (clientX: number, clientY: number) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const x = clamp((clientX - rect.left) / rect.width, 0, 1)
    const y = clamp((clientY - rect.top) / rect.height, 0, 1)
    setHsv({ s: x * 100, v: (1 - y) * 100 })
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 1
    const moves: Record<string, Partial<HSV>> = {
      ArrowLeft: { s: clamp(hsv.s - step, 0, 100) },
      ArrowRight: { s: clamp(hsv.s + step, 0, 100) },
      ArrowUp: { v: clamp(hsv.v + step, 0, 100) },
      ArrowDown: { v: clamp(hsv.v - step, 0, 100) },
    }
    const move = moves[e.key]
    if (move) {
      e.preventDefault()
      setHsv(move)
    }
  }

  return (
    <div
      ref={ref}
      data-slot="color-picker-selection"
      role="slider"
      tabIndex={0}
      aria-label="Saturation and brightness"
      aria-valuetext={`Saturation ${Math.round(hsv.s)}%, brightness ${Math.round(hsv.v)}%`}
      aria-valuenow={Math.round(hsv.s)}
      className={cn(
        'relative h-36 w-full cursor-crosshair touch-none rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
        className,
      )}
      style={{
        background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent), hsl(${hsv.h} 100% 50%)`,
      }}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId)
        dragging.current = true
        update(e.clientX, e.clientY)
      }}
      onPointerMove={(e) => dragging.current && update(e.clientX, e.clientY)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
      onKeyDown={onKeyDown}
      {...props}
    >
      <div
        className="pointer-events-none absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgb(0_0_0/0.35)]"
        style={{
          left: `${hsv.s}%`,
          top: `${100 - hsv.v}%`,
          backgroundColor: hex,
        }}
      />
    </div>
  )
}

function ColorPickerHue({
  className,
  ...props
}: Omit<React.ComponentProps<typeof SliderPrimitive.Root>, 'value' | 'onValueChange'>) {
  const { hsv, setHsv } = useColorPicker()

  return (
    <SliderPrimitive.Root
      data-slot="color-picker-hue"
      aria-label="Hue"
      min={0}
      max={360}
      step={1}
      value={[Math.round(hsv.h)]}
      onValueChange={([h]) => setHsv({ h })}
      className={cn('relative flex h-4 w-full touch-none items-center', className)}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-3 w-full grow rounded-full bg-[linear-gradient(90deg,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)]">
        <SliderPrimitive.Range className="absolute h-full" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block size-4 rounded-full border-2 border-white shadow-[0_0_0_1px_rgb(0_0_0/0.35)] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50" />
    </SliderPrimitive.Root>
  )
}

function ColorPickerEyeDropper({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { setHex } = useColorPicker()
  if (typeof window === 'undefined' || !window.EyeDropper) return null

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label="Pick a color from the screen"
      className={cn('size-8 shrink-0', className)}
      onClick={async () => {
        try {
          const { sRGBHex } = await new window.EyeDropper!().open()
          setHex(sRGBHex)
        } catch {
          // Cancelled with Escape.
        }
      }}
      {...props}
    >
      <Pipette />
    </Button>
  )
}

function formatColor(hex: string, format: Format) {
  const rgb = hexToRgb(hex) ?? [0, 0, 0]
  if (format === 'rgb') return `rgb(${rgb.map(Math.round).join(', ')})`
  if (format === 'hsl') {
    const { h, s, l } = rgbToHsl(rgb)
    return `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`
  }
  return hex
}

function ColorPickerOutput({
  className,
  ...props
}: Omit<React.ComponentProps<'input'>, 'value' | 'onChange'>) {
  const { hex, format, setHex } = useColorPicker()
  const [draft, setDraft] = React.useState<string | null>(null)
  const editable = format === 'hex'

  const commit = () => {
    if (draft !== null) setHex(draft)
    setDraft(null)
  }

  return (
    <input
      data-slot="color-picker-output"
      aria-label={`Color value (${format})`}
      spellCheck={false}
      readOnly={!editable}
      value={draft ?? formatColor(hex, format)}
      onFocus={(e) => {
        if (editable) setDraft(hex)
        else e.currentTarget.select()
      }}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === 'Enter') e.currentTarget.blur()
        if (e.key === 'Escape') {
          setDraft(null)
          e.currentTarget.blur()
        }
      }}
      className={cn(
        'h-8 min-w-0 flex-1 rounded-md border bg-card px-2.5 font-mono text-xs outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
        className,
      )}
      {...props}
    />
  )
}

function ColorPickerFormat({ className }: { className?: string }) {
  const { format, setFormat } = useColorPicker()

  return (
    <ToggleGroup
      type="single"
      aria-label="Color format"
      value={format}
      onValueChange={(next) => next && setFormat(next as Format)}
      className={className}
    >
      {(['hex', 'rgb', 'hsl'] as const).map((f) => (
        <ToggleGroupItem key={f} value={f} className="h-7 px-2 font-mono text-xs">
          {f}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

export {
  ColorPicker,
  ColorPickerSelection,
  ColorPickerHue,
  ColorPickerEyeDropper,
  ColorPickerOutput,
  ColorPickerFormat,
}
