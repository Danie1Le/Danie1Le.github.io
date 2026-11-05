export const ICON = "w-4 h-4";

export const SURFACE = "bg-[var(--surface)] transition-colors duration-500";

const INK_TEXT = "text-[var(--ink)]";

const DIM_TEXT = "text-[var(--dim)]";

export const DIM_TEXT_HOVER_INK = "text-[var(--dim)] hover:text-[var(--ink)]";

export const activeText = (active: boolean) => (active ? INK_TEXT : DIM_TEXT_HOVER_INK);

export const activeTextNoHover = (active: boolean) => (active ? INK_TEXT : DIM_TEXT);
