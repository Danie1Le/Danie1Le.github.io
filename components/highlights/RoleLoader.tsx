import { ROLE_MS } from "./pixel-art/constants";

/** A red bar that fills over one role, then calls `onDone`. Holds still while `running` is false. Remount to restart. */
export default function RoleLoader({ running, onDone }: { running: boolean; onDone: () => void }) {
  return (
    <div className="mx-6 md:mx-8 h-[3px] bg-[color-mix(in_srgb,var(--ink)_12%,transparent)]" aria-hidden="true">
      <span
        className="block h-full bg-[var(--brand)] origin-left"
        style={{ animation: `load ${ROLE_MS}ms linear both`, animationPlayState: running ? "running" : "paused" }}
        onAnimationEnd={onDone}
      />
    </div>
  );
}
