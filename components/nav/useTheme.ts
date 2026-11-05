import { getTheme, subscribeTheme, switchTheme, type Theme } from "@/lib/theme";
import type { MouseEvent } from "react";
import { useSyncExternalStore } from "react";

const SERVER_THEME = (): Theme => "dark";

export function useTheme() {
  const theme = useSyncExternalStore(subscribeTheme, getTheme, SERVER_THEME);
  const isLight = theme === "light";
  const nextTheme: Theme = isLight ? "dark" : "light";
  const toggle = (e: MouseEvent) => switchTheme(nextTheme, e.clientX, e.clientY);
  return { isLight, nextTheme, toggle };
}
