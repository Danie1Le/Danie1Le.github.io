import { flushSync } from "react-dom";
import { THEME_STORAGE_KEY } from "./boot";
import { prefersReducedMotion } from "./media";

export type Theme = "light" | "dark";

const SWITCH_MS = 800;
const SWITCH_EASING = "cubic-bezier(0.7, 0, 0.2, 1)";

const listeners = new Set<() => void>();

export const getTheme = (): Theme => (document.documentElement.dataset.theme === "light" ? "light" : "dark");

export const subscribeTheme = (onChange: () => void) => {
  listeners.add(onChange);
  return () => { listeners.delete(onChange); };
};

function rememberTheme(theme: Theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {}
}

function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  rememberTheme(theme);
  listeners.forEach((notify) => notify());
}

const distanceToFarthestCorner = (x: number, y: number) =>
  Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

function growCircleFrom(x: number, y: number) {
  const radius = distanceToFarthestCorner(x, y);
  document.documentElement.animate(
    { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
    { duration: SWITCH_MS, easing: SWITCH_EASING, pseudoElement: "::view-transition-new(root)" }
  );
}

type DocumentWithViewTransitions = Document & {
  startViewTransition?: (update: () => void) => { ready: Promise<void> };
};

export function switchTheme(theme: Theme, x: number, y: number) {
  const apply = () => setTheme(theme);
  const doc = document as DocumentWithViewTransitions;
  if (!doc.startViewTransition || prefersReducedMotion()) return apply();
  doc.startViewTransition(() => flushSync(apply)).ready.then(() => growCircleFrom(x, y));
}
