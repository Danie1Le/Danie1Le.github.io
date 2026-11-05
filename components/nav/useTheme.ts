import { getTheme, subscribeTheme, switchTheme, type Theme } from "@/lib/theme";
import type { MouseEvent } from "react";
import { useSyncExternalStore } from "react";

const SERVER_THEME = (): Theme => "dark";

export function useTheme() {
  const theme = useSyncExternalStore(subscribeTheme, getTheme, SERVER_THEME);
  const isLight = theme === "light";
  const toggle = (e: MouseEvent) => switchTheme(isLight ? "dark" : "light", e.clientX, e.clientY);
  return { isLight, toggle };
}
