import { flushSync } from "react-dom";
import { prefersReducedMotion } from "./motion";

// The theme lives on <html data-theme> (restored before paint by the boot script in app/layout.tsx).
// This module is its one writer, and tells subscribers when it changes, so every toggle stays in step.

export type Theme = "light" | "dark";

const listeners = new Set<() => void>();

export const getTheme = (): Theme => (document.documentElement.dataset.theme === "light" ? "light" : "dark");

export const subscribeTheme = (onChange: () => void) => {
  listeners.add(onChange);
  return () => { listeners.delete(onChange); };
};

function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem("theme", theme); } catch {} // private mode: the choice just isn't remembered
  listeners.forEach((fn) => fn());
}

/** Switch theme. The new one opens as a circle from (x, y), like a light switched on in the room. */
export function switchTheme(theme: Theme, x: number, y: number) {
  const apply = () => setTheme(theme);
  const doc = document as Document & { startViewTransition?: (update: () => void) => { ready: Promise<void> } };
  if (!doc.startViewTransition || prefersReducedMotion()) return apply();

  const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  doc.startViewTransition(() => flushSync(apply)).ready.then(() => {
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
      { duration: 800, easing: "cubic-bezier(0.7, 0, 0.2, 1)", pseudoElement: "::view-transition-new(root)" }
    );
  });
}
