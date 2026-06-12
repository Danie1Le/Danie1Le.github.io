"use client"

import { projects } from "@/lib/data"
import { getImagePath } from "@/lib/utils"
import { ExternalLink, Github } from "lucide-react"

interface ProjectsSectionProps {
  visibleSections: Set<string>;
}

export default function ProjectsSection({ visibleSections }: ProjectsSectionProps) {
  const isVisible = visibleSections.has("projects");

  return (
    <section
      id="projects"
      className="min-h-screen py-24 px-6 bg-gray-900 flex items-center
        bg-[radial-gradient(1100px_520px_at_80%_-8%,rgba(129,140,248,0.10),transparent_60%),radial-gradient(900px_480px_at_0%_108%,rgba(56,189,248,0.07),transparent_55%)]"
    >
      <div className="container mx-auto w-full max-w-6xl">
        {/* Header */}
        <div
          className={`mb-14 text-center transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-3">
            Projects
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => {
            const hasLinks = Boolean(project.live || project.github);
            const row = Math.floor(index / 3);
            return (
              <div
                key={index}
                style={{
                  transitionDelay: `${row * 180}ms`,
                  transitionDuration: `${700 + row * 350}ms`,
                }}
                className={`transition-all ease-out ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
              <div
                className="group relative flex h-full flex-col rounded-2xl border border-white/[0.07] bg-[#10131a] overflow-hidden
                  transition-all duration-300 ease-out
                  hover:-translate-y-1.5 hover:border-indigo-400/50
                  hover:shadow-[0_22px_50px_-22px_rgba(0,0,0,0.8),0_0_60px_-30px_rgba(129,140,248,0.55)]"
              >
                {/* top accent bar */}
                <span className="absolute top-0 left-0 right-0 h-0.5 z-[3] origin-left scale-x-0 bg-gradient-to-r from-indigo-400 to-sky-400 transition-transform duration-500 group-hover:scale-x-100" />

                {/* media */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#0c0f15]">
                  {project.image === "turbine" ? (
                    <div className="flex w-full h-full">
                      <img
                        src={getImagePath("/turbine1.jpg")}
                        alt="Wind turbine"
                        className="w-1/2 h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-[0.55]"
                      />
                      <img
                        src={getImagePath("/turbine2.jpg")}
                        alt="Wind turbine"
                        className="w-1/2 h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-[0.55]"
                      />
                    </div>
                  ) : (
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-[0.55] ${
                        project.title === "Dr. Mole" ? "object-[50%_28%]" : "object-center"
                      }`}
                    />
                  )}

                  {hasLinks && (
                    <div className="absolute inset-x-0 bottom-0 z-[2] flex gap-2.5 p-4 opacity-0 translate-y-3 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                      {project.live && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-400 to-indigo-500 px-3.5 py-2 text-[13px] font-semibold text-gray-950 transition-transform duration-200 hover:-translate-y-0.5"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                        </a>
                      )}
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-gray-950/70 px-3.5 py-2 text-[13px] font-semibold text-gray-100 backdrop-blur transition-transform duration-200 hover:-translate-y-0.5"
                        >
                          <Github className="w-3.5 h-3.5" /> Code
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {/* body */}
                <div className="flex flex-1 flex-col gap-2.5 p-5">
                  <h3 className="text-lg font-bold tracking-tight text-white transition-colors duration-300 group-hover:text-indigo-200">
                    {project.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-400 line-clamp-3">
                    {project.description}
                  </p>
                  <div className="mt-auto flex flex-wrap gap-1.5 pt-1.5">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11.5px] font-medium text-gray-300 transition-colors duration-300 group-hover:border-indigo-400/30"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}