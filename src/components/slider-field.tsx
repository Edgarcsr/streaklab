import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface SliderFieldProps {
  disabled?: boolean;
  format?: (value: number) => string;
  /** Tooltip text explaining a control whose meaning isn't obvious. */
  hint?: string;
  label: string;
  max: number;
  min: number;
  onChange: (value: number) => void;
  step?: number;
  value: number;
}

export function SliderField({
  label,
  value,
  min,
  max,
  step = 1,
  disabled,
  format = String,
  hint,
  onChange,
}: SliderFieldProps) {
  const labelText = (
    <span className={cn("font-medium text-sm", disabled && "opacity-50")}>
      {label}
    </span>
  );

  return (
    <div className="grid gap-2.5" data-disabled={disabled || undefined}>
      <div className="flex items-baseline justify-between">
        {hint ? (
          <Tooltip>
            <TooltipTrigger asChild>{labelText}</TooltipTrigger>
            <TooltipContent>{hint}</TooltipContent>
          </Tooltip>
        ) : (
          labelText
        )}
        <span className="font-mono text-muted-foreground text-xs tabular-nums">
          {format(value)}
        </span>
      </div>
      <Slider
        aria-label={label}
        disabled={disabled}
        max={max}
        min={min}
        onValueChange={([next]) => onChange(next)}
        step={step}
        value={[value]}
      />
    </div>
  );
}
