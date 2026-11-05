import { prefersReducedMotion } from "./media";

export const scrollPageBy = (top: number) =>
  window.scrollBy({ top, behavior: prefersReducedMotion() ? "auto" : "smooth" });

export function onScrollFrame(callback: () => void) {
  let frame = 0;
  const scheduleCallback = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(callback);
  };
  window.addEventListener("scroll", scheduleCallback, { passive: true });
  return () => {
    window.removeEventListener("scroll", scheduleCallback);
    cancelAnimationFrame(frame);
  };
}
