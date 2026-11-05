import { DIM_TEXT_HOVER_INK, ICON } from "@/lib/styles";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./useTheme";

const PHONE_STYLE = `p-2.5 -m-2.5 ${DIM_TEXT_HOVER_INK} transition-colors active:scale-90`;
const DESKTOP_STYLE = `inline-flex items-center gap-2 ${DIM_TEXT_HOVER_INK} transition-colors active:scale-95`;

export default function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { isLight, nextTheme, toggle } = useTheme();
  const label = isLight ? "Lights off" : "Lights on";
  const Icon = isLight ? Moon : Sun;

  return (
    <button onClick={toggle} aria-label={`${label}: switch to ${nextTheme} theme`} className={compact ? PHONE_STYLE : DESKTOP_STYLE}>
      <Icon className={compact ? "w-5 h-5" : ICON} />
      {!compact && label}
    </button>
  );
}
