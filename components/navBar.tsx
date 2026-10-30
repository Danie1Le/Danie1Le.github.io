"use client"

import { Menu, Moon, Sun, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

interface NavigationProps {
  activeSection: string;
  handleResumeClick: () => void;
}

const navItems = [
  { id: "highlights", label: "Highlights" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

export default function Navigation({ activeSection, handleResumeClick }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isLight, setIsLight] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    setIsLight(document.documentElement.dataset.theme === "light");
    const isDesktop = () => window.matchMedia("(min-width: 768px)").matches;

    const update = () => {
      const currentY = window.scrollY;
      const previousY = lastScrollY.current;

      if (!isDesktop() || currentY < 100) {
        setIsHidden(false);
      } else if (currentY > previousY + 4) {
        setIsHidden(true);
      } else if (currentY < previousY - 4) {
        setIsHidden(false);
      }

      lastScrollY.current = currentY;
      ticking.current = false;
    };

    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        window.requestAnimationFrame(update);
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      // Reveal when the cursor approaches the top edge (desktop only).
      if (isDesktop() && e.clientY < 80) setIsHidden(false);
    };

    lastScrollY.current = window.scrollY;
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouseMove);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  const toggleTheme = (e: React.MouseEvent) => {
    const next = isLight ? "dark" : "light";
    const apply = () => {
      document.documentElement.dataset.theme = next;
      try { localStorage.setItem("theme", next); } catch {}
      setIsLight(!isLight);
    };
    const doc = document as any;
    if (!doc.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return apply();

    // The new theme opens as a circle from the button, like a light switched on in the room.
    const { clientX: x, clientY: y } = e;
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    doc.startViewTransition(() => flushSync(apply)).ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 800, easing: "cubic-bezier(0.7, 0, 0.2, 1)", pseudoElement: "::view-transition-new(root)" }
      );
    });
  };

  // Never hide the bar while the mobile menu is open.
  const hidden = isHidden && !isMobileMenuOpen;

  // Real #links: CSS smooth-scrolls them (scroll-margin clears the bar); the URL shows the section.
  const closeMenu = () => setIsMobileMenuOpen(false);

  const themeLabel = isLight ? "Lights off" : "Lights on";

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

        <div className="hidden md:flex items-center gap-7 t-small">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={activeSection === item.id ? "true" : undefined}
              className={`link transition-colors duration-300 ${
                activeSection === item.id ? "text-[var(--ink)]" : "text-[var(--dim)] hover:text-[var(--ink)]"
              }`}
            >
              {item.label}
            </a>
          ))}
          <button onClick={handleResumeClick} className="link text-[var(--brand)] font-medium">Resume</button>
          <button
            onClick={toggleTheme}
            aria-label={`${themeLabel}: switch to ${isLight ? "dark" : "light"} theme`}
            className="inline-flex items-center gap-2 text-[var(--dim)] hover:text-[var(--ink)] transition-colors active:scale-95"
          >
            {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            {themeLabel}
          </button>
        </div>

        <div className="flex md:hidden items-center gap-5">
          <button
            onClick={toggleTheme}
            aria-label={`${themeLabel}: switch to ${isLight ? "dark" : "light"} theme`}
            className="p-2.5 -m-2.5 text-[var(--dim)] hover:text-[var(--ink)] transition-colors active:scale-90"
          >
            {isLight ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
          <button
            className="p-2 -m-2 text-[var(--dim)] hover:text-[var(--ink)] transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden grid transition-[grid-template-rows,opacity] duration-500 ease-expo ${
          isMobileMenuOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="frame pb-6 flex flex-col gap-1">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={closeMenu}
                tabIndex={isMobileMenuOpen ? 0 : -1}
                className={`py-2 t-lead ${activeSection === item.id ? "text-[var(--ink)]" : "text-[var(--dim)]"}`}
              >
                {item.label}
              </a>
            ))}
            <button
              onClick={() => { setIsMobileMenuOpen(false); handleResumeClick(); }}
              tabIndex={isMobileMenuOpen ? 0 : -1}
              className="text-left py-2 t-lead text-[var(--brand)]"
            >
              Resume
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
