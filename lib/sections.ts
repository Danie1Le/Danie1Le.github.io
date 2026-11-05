export const NAV_SECTIONS = [
  { id: "highlights", label: "Highlights" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

export const SECTION_IDS = ["hero", ...NAV_SECTIONS.map((section) => section.id)];

export const sectionHref = (id: string) => `#${id}`;

export const NAV_HEIGHT = 64;

export const NAV_CLEARANCE = NAV_HEIGHT + 16;
