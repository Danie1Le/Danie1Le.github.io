import { NAV_SECTIONS } from "@/lib/sections";
import { Menu, X } from "lucide-react";
import Collapse from "../ui/Collapse";

/** The phone's menu button (hamburger, or X while open). */
export function MenuButton({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <button
      className="p-2 -m-2 text-[var(--dim)] hover:text-[var(--ink)] transition-colors"
      onClick={onToggle}
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
    >
      {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
    </button>
  );
}

/** The phone's menu: the section links and Resume, unfolding under the bar. Closed, it is inert (out of the tab order). */
export default function MobileMenu({ open, active, onClose, onResume }: { open: boolean; active: string; onClose: () => void; onResume: () => void }) {
  return (
    <Collapse open={open} className="md:hidden duration-500 ease-expo">
      <div className="frame pb-6 flex flex-col gap-1">
        {NAV_SECTIONS.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={onClose}
            className={`py-2 t-lead ${active === item.id ? "text-[var(--ink)]" : "text-[var(--dim)]"}`}
          >
            {item.label}
          </a>
        ))}
        <button onClick={() => { onClose(); onResume(); }} className="text-left py-2 t-lead text-[var(--brand)]">
          Resume
        </button>
      </div>
    </Collapse>
  );
}
