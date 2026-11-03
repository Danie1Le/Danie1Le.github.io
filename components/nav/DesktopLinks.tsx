import { NAV_SECTIONS } from "@/lib/sections";
import ThemeToggle from "./ThemeToggle";

/** The bar's right side on desktop: a link per section (the one on screen marked), Resume, and the theme toggle. */
export default function DesktopLinks({ active, onResume }: { active: string; onResume: () => void }) {
  return (
    <div className="hidden md:flex items-center gap-7 t-small">
      {NAV_SECTIONS.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          aria-current={active === item.id ? "true" : undefined}
          className={`link transition-colors duration-300 ${
            active === item.id ? "text-[var(--ink)]" : "text-[var(--dim)] hover:text-[var(--ink)]"
          }`}
        >
          {item.label}
        </a>
      ))}
      <button onClick={onResume} className="link text-[var(--brand)] font-medium">Resume</button>
      <ThemeToggle />
    </div>
  );
}
