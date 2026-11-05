import { NAV_SECTIONS, sectionHref } from "@/lib/sections";
import { activeTextNoHover, DIM_TEXT_HOVER_INK } from "@/lib/styles";
import { Menu, X } from "lucide-react";
import Collapse from "../ui/Collapse";

export function MenuButton({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  const Icon = open ? X : Menu;
  return (
    <button
      className={`p-2 -m-2 ${DIM_TEXT_HOVER_INK} transition-colors`}
      onClick={onToggle}
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
    >
      <Icon className="w-6 h-6" />
    </button>
  );
}

interface MobileMenuProps {
  open: boolean;
  active: string;
  onClose: () => void;
  onResume: () => void;
}

export default function MobileMenu({ open, active, onClose, onResume }: MobileMenuProps) {
  const openResume = () => {
    onClose();
    onResume();
  };

  return (
    <Collapse open={open} className="md:hidden duration-500 ease-expo">
      <div className="frame pb-6 flex flex-col gap-1">
        {NAV_SECTIONS.map((section) => (
          <a
            key={section.id}
            href={sectionHref(section.id)}
            onClick={onClose}
            className={`py-2 t-lead ${activeTextNoHover(active === section.id)}`}
          >
            {section.label}
          </a>
        ))}
        <button onClick={openResume} className="text-left py-2 t-lead text-[var(--brand)]">
          Resume
        </button>
      </div>
    </Collapse>
  );
}
