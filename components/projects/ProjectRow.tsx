import type { Project } from "@/lib/content";
import { ArrowUpRight } from "lucide-react";
import Collapse from "../ui/Collapse";
import ExternalLink from "../ui/ExternalLink";

/** One project: its thumbnail, what it is, its tools and links. Folds away when the filter leaves it out. */
export default function ProjectRow({ project, shown }: { project: Project; shown: boolean }) {
  return (
    <Collapse as="li" open={shown} aria-hidden={!shown} className="duration-700 ease-expo">
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
              <ExternalLink href={project.live} className="link inline-flex items-center gap-1 text-[var(--brand)]">
                {project.live.endsWith(".mp4") ? "Watch video" : "Live demo"} <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </ExternalLink>
            )}
            {project.github && (
              <ExternalLink href={project.github} className="link inline-flex items-center gap-1">
                Code <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </ExternalLink>
            )}
          </div>
        </div>
      </article>
    </Collapse>
  );
}
