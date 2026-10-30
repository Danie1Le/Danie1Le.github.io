"use client"

import { useState } from "react";
import DesktopLinks from "./nav/DesktopLinks";
import MobileMenu, { MenuButton } from "./nav/MobileMenu";
import ThemeToggle from "./nav/ThemeToggle";
import { useHideOnScroll } from "./nav/useHideOnScroll";

interface NavigationProps {
  activeSection: string;
  handleResumeClick: () => void;
}

// The fixed bar: wordmark on the left; section links, Resume and the theme toggle on desktop; a menu on phones.
// Links are real #anchors: CSS smooth-scrolls them (scroll-margin clears the bar) and the URL shows the section.
export default function Navigation({ activeSection, handleResumeClick }: NavigationProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const hidden = useHideOnScroll() && !menuOpen; // never hide the bar while the menu is open
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav
      className={`fixed top-0 w-full z-50 bg-[var(--bg)] transition-[transform,background-color] duration-500 ease-expo ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="frame flex h-16 items-center justify-between gap-6">
        <a href="#hero" onClick={closeMenu} className="font-bold tracking-tight whitespace-nowrap">
          Daniel Le
        </a>
        <DesktopLinks active={activeSection} onResume={handleResumeClick} />
        <div className="flex md:hidden items-center gap-5">
          <ThemeToggle compact />
          <MenuButton open={menuOpen} onToggle={() => setMenuOpen(!menuOpen)} />
        </div>
      </div>
      <MobileMenu open={menuOpen} active={activeSection} onClose={closeMenu} onResume={handleResumeClick} />
    </nav>
  );
}
