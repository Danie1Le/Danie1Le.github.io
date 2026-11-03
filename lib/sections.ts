/** The page's sections, in order: the nav links each one, and the one on screen is marked active. */
export const NAV_SECTIONS = [
  { id: "highlights", label: "Highlights" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

/** Every section id, the hero (above the nav links) included. */
export const SECTION_IDS = ["hero", ...NAV_SECTIONS.map((s) => s.id)];

/** Height of the fixed nav bar (h-16, the same 4rem as the sections' scroll margin). */
export const NAV_HEIGHT = 64;
