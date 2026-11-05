export const ICON = "w-4 h-4";

export const SURFACE = "bg-[var(--surface)] transition-colors duration-500";

export const DIM_TEXT_HOVER_INK = "text-[var(--dim)] hover:text-[var(--ink)]";

export const activeText = (active: boolean) => (active ? "text-[var(--ink)]" : DIM_TEXT_HOVER_INK);
