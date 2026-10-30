import { getTheme, subscribeTheme, switchTheme, type Theme } from "@/lib/theme";
import { useSyncExternalStore } from "react";

/** The current theme and a click handler that switches it (the new theme opens as a circle from the click). */
export function useTheme() {
  const theme = useSyncExternalStore(subscribeTheme, getTheme, (): Theme => "dark");
  const isLight = theme === "light";
  const toggle = (e: React.MouseEvent) => switchTheme(isLight ? "dark" : "light", e.clientX, e.clientY);
  return { isLight, toggle };
}
