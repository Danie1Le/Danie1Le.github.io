"use client"

import { useEffect, useState } from "react"
import AboutSection from "./aboutSection"
import ContactSection from "./contactSection"
import ExperienceSection from "./experienceSection"
import HeroSection from "./heroSection"
import Navigation from "./navBar"
import ProjectsSection from "./projectsSection"

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("hero")
  const [expandedJob, setExpandedJob] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false)
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())

  const handleEmailClick = (e: React.MouseEvent) => {
    // Open Gmail compose with pre-filled email
    const gmailUrl = 'https://mail.google.com/mail/?view=cm&to=danielle8262005@gmail.com'
    window.open(gmailUrl, '_blank')
  }

  useEffect(() => {
    // Trigger initial load animation
    setIsLoaded(true)
    
    const handleScroll = () => {
      const sections = ["hero", "about", "experience", "projects", "contact"]
      const scrollPosition = window.scrollY + 100

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i])
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i])
          break
        }
      }
    }

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => {
              const newSet = new Set(prev)
              newSet.add(entry.target.id)
              return newSet
            })
          }
        })
      },
      { threshold: 0.1, rootMargin: "-50px" }
    )

    // Observe all sections
    const sections = ["hero", "about", "experience", "projects", "contact"]
    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId)
      if (element) observer.observe(element)
    })

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
      observer.disconnect()
    }
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offset = 60
      const elementPosition = element.offsetTop - offset
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth"
      })
    }
  }

  const handleCardClick = (index: number) => {
    if (expandedJob === index) {
      // Hide the card
      setExpandedJob(null);
    } else {
      // Show the card
      setExpandedJob(index);
      
      // Scroll to the expanded card after a short delay to allow animation to start
      setTimeout(() => {
        const cardElement = document.querySelector(`[data-job-index="${index}"]`);
        if (cardElement) {
          cardElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      }, 100);
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Navigation 
        activeSection={activeSection} 
        scrollToSection={scrollToSection} 
      />
      
      <HeroSection 
        isLoaded={isLoaded} 
        handleEmailClick={handleEmailClick} 
      />
      
      <AboutSection 
        visibleSections={visibleSections} 
      />
      
      <ExperienceSection 
        visibleSections={visibleSections}
        expandedJob={expandedJob}
        handleCardClick={handleCardClick}
      />
      
      <ProjectsSection 
        visibleSections={visibleSections} 
      />
      
      <ContactSection 
        handleEmailClick={handleEmailClick} 
      />
    </div>
  )
}
