import { NAV_SECTIONS, sectionHref } from "@/lib/sections";
import { activeText } from "@/lib/styles";
import ThemeToggle from "./ThemeToggle";

export default function DesktopLinks({ active, onResume }: { active: string; onResume: () => void }) {
  return (
    <div className="hidden md:flex items-center gap-7 t-small">
      {NAV_SECTIONS.map((section) => (
        <a
          key={section.id}
          href={sectionHref(section.id)}
          aria-current={active === section.id ? "true" : undefined}
          className={`link transition-colors duration-300 ${activeText(active === section.id)}`}
        >
          {section.label}
        </a>
      ))}
      <button onClick={onResume} className="link text-[var(--brand)] font-medium">Resume</button>
      <ThemeToggle />
    </div>
  );
}
