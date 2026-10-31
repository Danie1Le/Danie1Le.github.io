"use client"

import { useActiveSection } from "@/hooks/useActiveSection"
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll"
import { resume } from "@/lib/content"
import { SECTION_IDS } from "@/lib/sections"
import { useState } from "react"
import AboutSection from "./aboutSection"
import ContactSection from "./contactSection"
import ExperienceSection from "./experienceSection"
import HeroSection from "./heroSection"
import HighlightsSection from "./highlightsSection"
import Navigation from "./navBar"
import ProjectsSection from "./projectsSection"
import ImagePreviewModal from "./ui/ImagePreviewModal"

// The page: nav, the sections in order, and the resume preview any "Resume" button opens.
export default function Portfolio() {
  const activeSection = useActiveSection(SECTION_IDS)
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false)
  const handleResumeClick = () => setIsResumeModalOpen(true)
  useRevealOnScroll()

  return (
    <div className="min-h-[100svh]">
      <div className="read-progress" aria-hidden="true" />
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:px-4 focus:py-2 focus:bg-[var(--brand-fill)] focus:text-[var(--brand-ink)]">
        Skip to content
      </a>
      <Navigation activeSection={activeSection} handleResumeClick={handleResumeClick} />

      <main id="main">
        <HeroSection handleResumeClick={handleResumeClick} />
        <HighlightsSection />
        <ExperienceSection />
        <ProjectsSection />
        <AboutSection handleResumeClick={handleResumeClick} />
        <ContactSection />
      </main>

      <ImagePreviewModal
        src={isResumeModalOpen ? resume.image : null}
        onClose={() => setIsResumeModalOpen(false)}
        download={{ href: resume.pdf, filename: resume.filename }}
      />
    </div>
  )
}
