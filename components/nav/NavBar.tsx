"use client"

import { sectionHref } from "@/lib/sections";
import { site } from "@/lib/site";
import { useState } from "react";
import DesktopLinks from "./DesktopLinks";
import MobileMenu, { MenuButton } from "./MobileMenu";
import ThemeToggle from "./ThemeToggle";
import { useHideOnScroll } from "./useHideOnScroll";

interface NavBarProps {
  activeSection: string;
  onResume: () => void;
}

export default function NavBar({ activeSection, onResume }: NavBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const scrolledAway = useHideOnScroll();
  const hidden = scrolledAway && !menuOpen;
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav
      className={`fixed top-0 w-full z-50 bg-[var(--bg)] transition-[transform,background-color] duration-500 ease-expo ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="frame flex h-16 items-center justify-between gap-6">
        <a href={sectionHref("hero")} onClick={closeMenu} className="font-bold tracking-tight whitespace-nowrap">
          {site.name}
        </a>
        <DesktopLinks active={activeSection} onResume={onResume} />
        <div className="flex md:hidden items-center gap-5">
          <ThemeToggle compact />
          <MenuButton open={menuOpen} onToggle={() => setMenuOpen(!menuOpen)} />
        </div>
      </div>
      <MobileMenu open={menuOpen} active={activeSection} onClose={closeMenu} onResume={onResume} />
    </nav>
  );
}
