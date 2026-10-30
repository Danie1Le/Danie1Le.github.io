"use client"

import { useEffect, useState } from "react"
import AboutSection from "./aboutSection"
import ContactSection from "./contactSection"
import ExperienceSection from "./experienceSection"
import HeroSection from "./heroSection"
import HighlightsSection from "./highlightsSection"
import Navigation from "./navBar"
import ProjectsSection from "./projectsSection"
import ImagePreviewModal from "./imagePreviewModal"
import { SECTION_IDS } from "@/lib/sections"

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("hero")
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false)

  const handleResumeClick = () => setIsResumeModalOpen(true)

  useEffect(() => {
    ;(window as any).__revealed = true

    // Reveal each [data-reveal] once as it enters the viewport.
    const reveal = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.setAttribute("data-in", "") // an attribute React never rewrites, unlike className
          reveal.unobserve(entry.target)
        }
      }),
      { rootMargin: "0px 0px -8% 0px" }
    )
    document.querySelectorAll("[data-reveal]").forEach((el) => reveal.observe(el))

    // The section crossing the upper third of the screen is the active one.
    const spy = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && setActiveSection(entry.target.id)),
      { rootMargin: "-35% 0px -60% 0px" }
    )
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id)
      if (el) spy.observe(el)
    })

    return () => {
      reveal.disconnect()
      spy.disconnect()
    }
  }, [])


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
        src={isResumeModalOpen ? "/Daniel_Le_Resume.png" : null}
        onClose={() => setIsResumeModalOpen(false)}
        download={{ href: "/Daniel_Le_Resume.pdf", filename: "Daniel_Le_Resume.pdf" }}
      />
    </div>
  )
}
