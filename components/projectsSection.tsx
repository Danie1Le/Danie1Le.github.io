"use client"

import { projects } from "@/lib/content"
import { ArrowUpRight } from "lucide-react"
import { useState } from "react"

// The tools used most across projects become the filters, with how many projects use each.
const counts = new Map<string, number>()
projects.forEach((p) => p.tech.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)))
const filters = Array.from(counts).filter(([, n]) => n > 1).sort((a, b) => b[1] - a[1]).slice(0, 6)

export default function ProjectsSection() {
  const [tool, setTool] = useState<string | null>(null);

  // Picking a tool brings the start of the list back under the nav, so the results are what you see.
  const pick = (value: string | null) => {
    setTool(value);
    const top = document.querySelector("#projects > div")!.getBoundingClientRect().top; // not the heading: it is sticky
    if (Math.abs(top - 96) > 8) { // 96 = nav bar + breathing room
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollBy({ top: top - 96, behavior: reduce ? "auto" : "smooth" });
    }
  };

  const filterButton = (label: string, n: number, value: string | null) => (
    <button
      key={label}
      onClick={() => pick(value)}
      aria-pressed={tool === value}
      className={`flex items-baseline gap-2 whitespace-nowrap transition-colors duration-300 active:scale-95 ${
        tool === value ? "text-[var(--ink)]" : "text-[var(--dim)] hover:text-[var(--ink)]"
      }`}
    >
      <span className={`inline-block w-2 h-2 self-center transition-[transform,opacity] duration-500 ${tool === value ? "bg-[var(--brand)] scale-100 opacity-100" : "scale-50 opacity-0"}`} aria-hidden="true" />
      {label}
      <span className="t-small tabular-nums">{n}</span>
    </button>
  );

  return (
    <section id="projects" className="frame pt-24 md:pt-32">
      <div className="md:grid md:grid-cols-12 md:gap-x-8">
        {/* Rail: section name and the tool filters (a scrolling line on phones). */}
        <div className="md:col-span-3">
          <div className="md:sticky md:top-24">
            <h2 data-reveal className="t-head font-semibold">Projects</h2>
            <div
              data-reveal
              style={{ "--i": 2 } as React.CSSProperties}
              className="mt-6 flex flex-wrap md:flex-col gap-x-6 gap-y-3"
              aria-label="Filter projects by tool"
            >
              {filterButton("All", projects.length, null)}
              {filters.map(([t, n]) => filterButton(t, n, t))}
            </div>
          </div>
        </div>

        <ul className="mt-10 md:mt-0 md:col-span-9 dim-others [overflow-anchor:none]">
          {projects.map((project, index) => {
            const on = !tool || project.tech.includes(tool);
            return (
              <li
                key={project.title}
                aria-hidden={!on}
                className={`grid transition-[grid-template-rows,opacity] duration-700 ease-expo ${on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
              >
                <div className="overflow-hidden">
                  <article data-reveal className="group grid sm:grid-cols-9 gap-x-6 gap-y-3 pb-8">
                    <div className="sm:col-span-3 aspect-[16/10] overflow-hidden bg-[var(--surface)] flex">
                      {project.images.map((src) => (
                        <img
                          key={src}
                          src={src}
                          alt={project.alt ?? `Screenshot of ${project.title}`}
                          loading="lazy"
                          className="h-full object-cover exhibit group-hover:scale-105"
                          style={{ width: `${100 / project.images.length}%`, objectPosition: project.focus ?? "top" }}
                        />
                      ))}
                    </div>

                    <div className="sm:col-span-6 flex flex-col">
                      <h3 className="t-lead font-medium">{project.title}</h3>
                      <p className="mt-1.5 text-[var(--dim)]">{project.description}</p>
                      <p className="mt-2 t-small text-[var(--dim)]">{project.tech.join(" · ")}</p>
                      <div className="mt-3 flex gap-6 t-small">
                        {project.live && (
                          <a href={project.live} target="_blank" rel="noopener noreferrer" tabIndex={on ? 0 : -1} className="link inline-flex items-center gap-1 text-[var(--brand)]">
                            {project.live.endsWith(".mp4") ? "Watch video" : "Live demo"} <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                          </a>
                        )}
                        {project.github && (
                          <a href={project.github} target="_blank" rel="noopener noreferrer" tabIndex={on ? 0 : -1} className="link inline-flex items-center gap-1">
                            Code <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
