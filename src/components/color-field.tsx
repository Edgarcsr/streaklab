import {
  ColorPicker,
  ColorPickerEyeDropper,
  ColorPickerFormat,
  ColorPickerHue,
  ColorPickerOutput,
  ColorPickerSelection,
} from "@/components/ui/color-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ColorFieldProps {
  label: string;
  onChange: (hex: string) => void;
  value: string;
}

export function ColorField({ label, value, onChange }: ColorFieldProps) {
  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <button
              className="flex items-center gap-2.5 rounded-lg border bg-card p-1.5 pr-3 text-left outline-none transition-colors hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50"
              type="button"
            >
              <span
                className="size-8 shrink-0 rounded-md border border-black/10"
                style={{ backgroundColor: value }}
              />
              <span className="min-w-0 leading-tight">
                <span className="block font-medium text-sm">{label}</span>
                <span className="block font-mono text-muted-foreground text-xs">
                  {value}
                </span>
              </span>
            </button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>Editar cor</TooltipContent>
      </Tooltip>
      <PopoverContent align="start" className="w-72">
        <ColorPicker onChange={onChange} value={value}>
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
  );
}
