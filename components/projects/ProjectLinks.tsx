import { isVideo, type Project } from "@/lib/content";
import { ICON } from "@/lib/styles";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import ExternalLink from "../ui/ExternalLink";

function OutLink({ href, className = "", children }: { href: string; className?: string; children: ReactNode }) {
  return (
    <ExternalLink href={href} className={`link inline-flex items-center gap-1 ${className}`}>
      {children} <ArrowUpRight className={ICON} aria-hidden="true" />
    </ExternalLink>
  );
}

export default function ProjectLinks({ project }: { project: Project }) {
  return (
    <div className="mt-3 flex gap-6 t-small">
      {project.live && (
        <OutLink href={project.live} className="text-[var(--brand)]">
          {isVideo(project.live) ? "Watch video" : "Live demo"}
        </OutLink>
      )}
      {project.github && <OutLink href={project.github}>Code</OutLink>}
    </div>
  );
}
