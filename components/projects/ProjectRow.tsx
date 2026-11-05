import type { Project } from "@/lib/content";
import Collapse from "../ui/Collapse";
import ProjectLinks from "./ProjectLinks";
import ProjectThumbnail from "./ProjectThumbnail";

export default function ProjectRow({ project, shown }: { project: Project; shown: boolean }) {
  return (
    <Collapse as="li" open={shown} aria-hidden={!shown} className="duration-700 ease-expo">
      <article data-reveal className="group grid sm:grid-cols-9 gap-x-6 gap-y-3 pb-8">
        <ProjectThumbnail project={project} />
        <div className="sm:col-span-6 flex flex-col">
          <h3 className="t-lead font-medium">{project.title}</h3>
          <p className="mt-1.5 text-[var(--dim)]">{project.description}</p>
          <p className="mt-2 t-small text-[var(--dim)]">{project.tech.join(" · ")}</p>
          <ProjectLinks project={project} />
        </div>
      </article>
    </Collapse>
  );
}
