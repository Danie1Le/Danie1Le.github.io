"use client"

import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface NavigationProps {
  activeSection: string;
  scrollToSection: (sectionId: string) => void;
}

export default function Navigation({ activeSection, scrollToSection }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const isDesktop = () => window.matchMedia("(min-width: 768px)").matches;

    const update = () => {
      const currentY = window.scrollY;
      const previousY = lastScrollY.current;

      // Hide on desktop
      if (!isDesktop()) {
        setIsHidden(false);
      } else if (currentY < 100) {
        // Show when cursor is near the top
        setIsHidden(false);
      } else if (currentY > previousY + 4) {
        // Hide when scrolling down
        setIsHidden(true);
      } else if (currentY < previousY - 4) {
        // Show when scrolling up
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
      if (isDesktop() && e.clientY < 80) {
        setIsHidden(false);
      }
    };

    lastScrollY.current = window.scrollY;
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouseMove);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  // Never hide the bar while the mobile menu is open.
  const hidden = isHidden && !isMobileMenuOpen;

  const navItems = [
    { id: "hero", label: "Home" },
    { id: "about", label: "About" },
    { id: "experience", label: "Experience" },
    { id: "projects", label: "Projects" },
    { id: "contact", label: "Contact" },
  ];

  const handleNavClick = (sectionId: string) => {
    scrollToSection(sectionId);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 w-full bg-gray-950/80 backdrop-blur-sm border-b border-gray-800 z-50 transition-transform duration-300 ease-out ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Daniel Le</h1>

          {/* Desktop navigation */}
          <div className="hidden md:flex space-x-6 ml-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-2.5 py-1 rounded-full transition-all duration-300 ${
                  activeSection === item.id 
                    ? "bg-gray-800 text-white" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile hamburger button */}
          <button
            className="md:hidden text-gray-400 hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-gray-950/95 backdrop-blur-sm border-t border-gray-800 px-6 py-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`block w-full text-left px-4 py-3 rounded-lg transition-all duration-300 ${
                activeSection === item.id
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800/50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
