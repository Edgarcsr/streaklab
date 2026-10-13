import { Monitor, Moon, Sun } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { THEME_MODES, type ThemeMode } from "@/lib/theme";

const THEME_LABELS: Record<ThemeMode, string> = {
  dark: "Escuro",
  light: "Claro",
  system: "Sistema",
};

const THEME_ICONS: Record<ThemeMode, typeof Sun> = {
  dark: Moon,
  light: Sun,
  system: Monitor,
};

interface ThemeSelectProps {
  onChange: (mode: ThemeMode) => void;
  value: ThemeMode;
}

export function ThemeSelect({ value, onChange }: ThemeSelectProps) {
  return (
    <Select onValueChange={(next) => onChange(next as ThemeMode)} value={value}>
      <Tooltip>
        <TooltipTrigger asChild>
          <SelectTrigger aria-label="Tema" size="sm">
            <SelectValue />
          </SelectTrigger>
        </TooltipTrigger>
        <TooltipContent>Tema</TooltipContent>
      </Tooltip>
      <SelectContent>
        {THEME_MODES.map((mode) => {
          const Icon = THEME_ICONS[mode];
          return (
            <SelectItem key={mode} value={mode}>
              <Icon aria-hidden className="size-4" />
              {THEME_LABELS[mode]}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
