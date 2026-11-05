"use client"

import { useActiveSection } from "@/hooks/useActiveSection"
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll"
import { resume } from "@/lib/content"
import { SECTION_IDS } from "@/lib/sections"
import { useState } from "react"
import AboutSection from "./about/AboutSection"
import ContactSection from "./contact/ContactSection"
import ExperienceSection from "./experienceSection"
import HeroSection from "./hero/HeroSection"
import HighlightsSection from "./highlights/HighlightsSection"
import NavBar from "./nav/NavBar"
import ProjectsSection from "./projectsSection"
import ImagePreviewModal from "./ui/ImagePreviewModal"

export default function Portfolio() {
  const activeSection = useActiveSection(SECTION_IDS)
  const [resumeOpen, setResumeOpen] = useState(false)
  const openResume = () => setResumeOpen(true)
  useRevealOnScroll()

  return (
    <div className="min-h-[100svh]">
      <div className="read-progress" aria-hidden="true" />
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:px-4 focus:py-2 focus:bg-[var(--brand-fill)] focus:text-[var(--brand-ink)]">
        Skip to content
      </a>
      <NavBar activeSection={activeSection} onResume={openResume} />

      <main id="main">
        <HeroSection onResume={openResume} />
        <HighlightsSection />
        <ExperienceSection />
        <ProjectsSection />
        <AboutSection onResume={openResume} />
        <ContactSection />
      </main>

      <ImagePreviewModal
        src={resumeOpen ? resume.image : null}
        onClose={() => setResumeOpen(false)}
        download={{ href: resume.pdf, filename: resume.filename }}
      />
    </div>
  )
}
