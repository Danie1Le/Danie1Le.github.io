"use client"

import { projects, type Project } from "@/lib/content"
import { scrollPageBy } from "@/lib/scroll"
import { NAV_HEIGHT } from "@/lib/sections"
import { useRef, useState } from "react"
import { PageSection, SectionHeading } from "../ui/Section"
import ProjectRow from "./ProjectRow"
import ToolFilters from "./ToolFilters"

const LIST_TOP = NAV_HEIGHT + 32;
const CLOSE_ENOUGH = 8;

const usesTool = (project: Project, tool: string | null) => !tool || project.tech.includes(tool);

export default function ProjectsSection() {
  const [tool, setTool] = useState<string | null>(null);
  const columns = useRef<HTMLDivElement>(null);

  const bringListUnderNav = () => {
    const distance = columns.current!.getBoundingClientRect().top - LIST_TOP;
    if (Math.abs(distance) > CLOSE_ENOUGH) scrollPageBy(distance);
  };

  const pickTool = (value: string | null) => {
    setTool(value);
    bringListUnderNav();
  };

  return (
    <PageSection id="projects">
      <div ref={columns} className="md:grid md:grid-cols-12 md:gap-x-8">
        <div className="md:col-span-3">
          <div className="md:sticky md:top-24">
            <SectionHeading>Projects</SectionHeading>
            <ToolFilters tool={tool} onPick={pickTool} />
          </div>
        </div>

        <ul className="mt-10 md:mt-0 md:col-span-9 dim-others [overflow-anchor:none]">
          {projects.map((project) => (
            <ProjectRow key={project.title} project={project} shown={usesTool(project, tool)} />
          ))}
        </ul>
      </div>
    </PageSection>
  );
}
