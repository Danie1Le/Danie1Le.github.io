import type { Project } from "@/lib/content";

export default function ProjectThumbnail({ project }: { project: Project }) {
  const width = `${100 / project.images.length}%`;
  const alt = project.alt ?? `Screenshot of ${project.title}`;
  return (
    <div className="sm:col-span-3 aspect-[16/10] overflow-hidden bg-[var(--surface)] flex">
      {project.images.map((src) => (
        <img
          key={src}
          src={src}
          alt={alt}
          loading="lazy"
          className="h-full object-cover exhibit group-hover:scale-105"
          style={{ width, objectPosition: project.objectPosition ?? "top" }}
        />
      ))}
    </div>
  );
}
