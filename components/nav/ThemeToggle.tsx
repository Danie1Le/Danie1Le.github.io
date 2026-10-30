import { Moon, Sun } from "lucide-react";
import { useTheme } from "./useTheme";

/** "Lights on" / "Lights off". `compact` is the phone version: the icon alone, with a 44px target. */
export default function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { isLight, toggle } = useTheme();
  const label = isLight ? "Lights off" : "Lights on";
  const Icon = isLight ? Moon : Sun;
  const ariaLabel = `${label}: switch to ${isLight ? "dark" : "light"} theme`;

  if (compact) {
    return (
      <button onClick={toggle} aria-label={ariaLabel} className="p-2.5 -m-2.5 text-[var(--dim)] hover:text-[var(--ink)] transition-colors active:scale-90">
        <Icon className="w-5 h-5" />
      </button>
    );
  }
  return (
    <button onClick={toggle} aria-label={ariaLabel} className="inline-flex items-center gap-2 text-[var(--dim)] hover:text-[var(--ink)] transition-colors active:scale-95">
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}
