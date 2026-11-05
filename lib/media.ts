const matches = (query: string) => window.matchMedia(query).matches;

export const prefersReducedMotion = () => matches("(prefers-reduced-motion: reduce)");

export const isDesktop = () => matches("(min-width: 768px)");
