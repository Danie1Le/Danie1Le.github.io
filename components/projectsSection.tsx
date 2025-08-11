"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { projects } from "@/lib/data"
import { getImagePath } from "@/lib/utils"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

interface ProjectsSectionProps {
  visibleSections: Set<string>;
}

export default function ProjectsSection({ visibleSections }: ProjectsSectionProps) {
  return (
    <section id="projects" className={`min-h-screen py-20 px-6 bg-gray-900 flex items-center transition-all duration-1000 ${
      visibleSections.has('projects') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
    }`}>
      <div className="container mx-auto w-full">
        <h2 className={`text-4xl font-bold text-center mb-16 transition-all duration-1000 delay-200 ${
          visibleSections.has('projects') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          Projects
        </h2>
        <div className={`transition-all duration-1000 delay-400 ${
          visibleSections.has('projects') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <ProjectCarousel />
        </div>
      </div>
    </section>
  );
}

function ProjectCarousel() {
  const [startIndex, setStartIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const canGoNext = startIndex + 3 < projects.length
  const canGoPrev = startIndex > 0

  const handlePrevious = () => {
    if (canGoPrev && !isAnimating) {
      setIsAnimating(true)
      setStartIndex(Math.max(0, startIndex - 1))
      setTimeout(() => {
        setIsAnimating(false)
      }, 300)
    }
  }

  const handleNext = () => {
    if (canGoNext && !isAnimating) {
      setIsAnimating(true)
      setStartIndex(Math.min(projects.length - 3, startIndex + 1))
      setTimeout(() => {
        setIsAnimating(false)
      }, 300)
    }
  }

  // Mobile vertical carousel with 3 complete cards
  const MobileVerticalCarousel = () => {
    const mobileCanGoNext = startIndex + 1 < projects.length - 2
    const mobileCanGoPrev = startIndex > 0

    const handleMobilePrevious = () => {
      if (mobileCanGoPrev && !isAnimating) {
        setIsAnimating(true)
        setStartIndex(Math.max(0, startIndex - 1))
        setTimeout(() => {
          setIsAnimating(false)
        }, 300)
      }
    }

    const handleMobileNext = () => {
      if (mobileCanGoNext && !isAnimating) {
        setIsAnimating(true)
        setStartIndex(Math.min(projects.length - 3, startIndex + 1))
        setTimeout(() => {
          setIsAnimating(false)
        }, 300)
      }
    }

    return (
      <div className="relative max-w-md mx-auto md:hidden">
        {/* Mobile Navigation */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 z-10 -translate-y-16">
          <button
            onClick={handleMobilePrevious}
            disabled={!mobileCanGoPrev || isAnimating}
            className={`w-12 h-12 rounded-full border border-gray-800 bg-gray-950/80 flex items-center justify-center ${
              mobileCanGoPrev ? "text-gray-400 hover:text-white" : "text-gray-700 opacity-50"
            }`}
          >
            <ChevronDown className="w-5 h-5 rotate-180" />
          </button>
        </div>

        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 z-10 translate-y-16">
          <button
            onClick={handleMobileNext}
            disabled={!mobileCanGoNext || isAnimating}
            className={`w-12 h-12 rounded-full border border-gray-800 bg-gray-950/80 flex items-center justify-center ${
              mobileCanGoNext ? "text-gray-400 hover:text-white" : "text-gray-700 opacity-50"
            }`}
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Projects Vertical Carousel */}
        <div className="relative overflow-hidden h-[1300px]">
          <div className={`flex flex-col gap-6 transition-all duration-300 ease-out ${
            isAnimating ? 'transform scale-98 opacity-95' : 'transform scale-100 opacity-100'
          }`} style={{ 
            transform: `translateY(-${startIndex * 450}px)`,
            transition: 'transform 300ms ease-out, opacity 300ms ease-out, transform 300ms ease-out'
          }}>
            {projects.map((project, index) => {
              const link = project.live || project.github || null;
              const cardContent = (
                <>
                  <div className="aspect-video bg-gray-800 relative overflow-hidden">
                    {project.image === "turbine" ? (
                      <div className="w-full h-full flex">
                        <img
                          src={getImagePath("/turbine1.jpg")}
                          alt="Turbine 1"
                          className="w-1/2 h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <img
                          src={getImagePath("/turbine2.jpg")}
                          alt="Turbine 2"
                          className="w-1/2 h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <img
                        src={project.image || "/placeholder.svg"}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white text-lg">{project.title}</CardTitle>
                    <CardDescription className="text-gray-400 text-sm">{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-1">
                      {project.tech.map((tech) => (
                        <Badge key={tech} variant="outline" className="border-gray-600 text-gray-300 text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </>
              );

              if (link) {
                return (
                  <a
                    key={index}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group flex-shrink-0 w-full h-[420px]"
                  >
                    <Card className="bg-gray-950 border-gray-800 overflow-hidden hover:border-gray-600 transition-colors cursor-pointer h-full">
                      {cardContent}
                    </Card>
                  </a>
                );
              } else {
                return (
                  <Card
                    key={index}
                    className="bg-gray-950 border-gray-800 overflow-hidden group hover:border-gray-600 transition-colors h-[420px] flex-shrink-0 w-full"
                  >
                    {cardContent}
                  </Card>
                );
              }
            })}
          </div>
        </div>

        {/* Mobile Progress Dots */}
        <div className="flex justify-center mt-8">
          <div className="flex items-center space-x-4">
            <span className="text-gray-400 text-sm">
              {startIndex === 0 ? "1-3" : 
               startIndex === 1 ? "2-4" : 
               startIndex === 2 ? "3-5" : 
               startIndex === 3 ? "4-6" : "5-7"}
            </span>
            <div className="flex space-x-2">
              {Array.from({ length: projects.length - 2 }).map((_, i) => {
                const isActive = startIndex === i;
                return (
                  <div
                    key={i}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      isActive ? "bg-white w-8" : "bg-gray-700 w-2"
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <MobileVerticalCarousel />
      <div className="relative max-w-6xl mx-auto hidden md:block">
        {/* Navigation */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 -translate-x-16">
          <button
            onClick={handlePrevious}
            disabled={!canGoPrev || isAnimating}
            className={`w-12 h-12 rounded-full border border-gray-800 bg-gray-950/80 flex items-center justify-center ${
              canGoPrev ? "text-gray-400 hover:text-white" : "text-gray-700 opacity-50"
            }`}
          >
            <ChevronDown className="w-5 h-5 rotate-90" />
          </button>
        </div>

        <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 translate-x-16">
          <button
            onClick={handleNext}
            disabled={!canGoNext || isAnimating}
            className={`w-12 h-12 rounded-full border border-gray-800 bg-gray-950/80 flex items-center justify-center ${
              canGoNext ? "text-gray-400 hover:text-white" : "text-gray-700 opacity-50"
            }`}
          >
            <ChevronDown className="w-5 h-5 -rotate-90" />
          </button>
        </div>

        {/* Projects Grid */}
        <div className="relative overflow-hidden">
          <div className={`flex gap-6 transition-all duration-300 ease-out ${
            isAnimating ? 'transform scale-98 opacity-95' : 'transform scale-100 opacity-100'
          }`} style={{ transform: `translateX(-${startIndex * (100/3)}%)` }}>
            {projects.map((project, index) => {
              const link = project.live || project.github || null;
              const cardContent = (
                <>
                  <div className="aspect-video bg-gray-800 relative overflow-hidden">
                    {project.image === "turbine" ? (
                      <div className="w-full h-full flex">
                        <img
                          src={getImagePath("/turbine1.jpg")}
                          alt="Turbine 1"
                          className="w-1/2 h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <img
                          src={getImagePath("/turbine2.jpg")}
                          alt="Turbine 2"
                          className="w-1/2 h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <img
                        src={project.image || "/placeholder.svg"}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white text-lg">{project.title}</CardTitle>
                    <CardDescription className="text-gray-400 text-sm line-clamp-3">{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-1">
                      {project.tech.map((tech) => (
                        <Badge key={tech} variant="outline" className="border-gray-600 text-gray-300 text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </>
              );

              if (link) {
                return (
                  <a
                    key={index}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group flex-shrink-0 w-full md:w-[calc(33.333%-1rem)] lg:w-[calc(33.333%-1rem)]"
                  >
                    <Card className="bg-gray-950 border-gray-800 overflow-hidden hover:border-gray-600 transition-colors cursor-pointer h-[420px]">
                      {cardContent}
                    </Card>
                  </a>
                );
              } else {
                return (
                  <Card
                    key={index}
                    className="bg-gray-950 border-gray-800 overflow-hidden group hover:border-gray-600 transition-colors h-[420px] flex-shrink-0 w-full md:w-[calc(33.333%-1rem)] lg:w-[calc(33.333%-1rem)]"
                  >
                    {cardContent}
                  </Card>
                );
              }
            })}
          </div>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center mt-8">
          <div className="flex items-center space-x-4">
            <span className="text-gray-400 text-sm">
              {startIndex === 0 ? "1-3" : 
               startIndex === 1 ? "2-4" : 
               startIndex === 2 ? "3-5" : "4-6"}
            </span>
            <div className="flex space-x-2">
              {Array.from({ length: projects.length - 3 + 1 }).map((_, i) => {
                const isActive = startIndex === i;
                return (
                  <div
                    key={i}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      isActive ? "bg-white w-8" : "bg-gray-700 w-2"
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
