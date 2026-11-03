"use client"

import { projects } from "@/lib/content"
import { scrollPageBy } from "@/lib/motion"
import { useState } from "react"
import ProjectRow from "./projects/ProjectRow"
import ToolFilters from "./projects/ToolFilters"

const LIST_TOP = 96; // where the list's start lands after a filter is picked: under the nav, with breathing room

// A sticky rail (the heading and the tool filters) beside the list of projects.
export default function ProjectsSection() {
  const [tool, setTool] = useState<string | null>(null);

  // Picking a tool brings the start of the list back under the nav, so the results are what you see.
  const pick = (value: string | null) => {
    setTool(value);
    const top = document.querySelector("#projects > div")!.getBoundingClientRect().top; // not the heading: it is sticky
    if (Math.abs(top - LIST_TOP) > 8) scrollPageBy(top - LIST_TOP);
  };

  return (
    <section id="projects" className="frame pt-24 md:pt-32">
      <div className="md:grid md:grid-cols-12 md:gap-x-8">
        <div className="md:col-span-3">
          <div className="md:sticky md:top-24">
            <h2 data-reveal className="t-head font-semibold">Projects</h2>
            <ToolFilters tool={tool} onPick={pick} />
          </div>
        </div>

        <ul className="mt-10 md:mt-0 md:col-span-9 dim-others [overflow-anchor:none]">
          {projects.map((project) => (
            <ProjectRow key={project.title} project={project} shown={!tool || project.tech.includes(tool)} />
          ))}
        </ul>
      </div>
    </section>
  );
}
