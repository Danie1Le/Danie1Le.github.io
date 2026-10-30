"use client"

import ImagePreviewModal from "@/components/imagePreviewModal"
import { jobs } from "@/lib/data"
import { Eye, Plus } from "lucide-react"
import { useRef, useState } from "react"

const NAV = 80; // keep rows clear of the fixed nav bar

export default function ExperienceSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const rows = useRef<(HTMLLIElement | null)[]>([]);

  // Scroll so a row of the given final height sits dead centre (or just under the nav if it is taller than the screen).
  // `lift` is how far the row will rise because a role above it is closing at the same time.
  const centre = (li: HTMLElement, height: number, lift = 0) => {
    const target = Math.max(NAV, (window.innerHeight - height) / 2);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollBy({ top: li.getBoundingClientRect().top - lift - target, behavior: reduce ? "auto" : "smooth" });
  };

  const toggle = (index: number) => {
    const li = rows.current[index]!;
    const head = li.firstElementChild as HTMLElement;
    if (openIdx === index) {
      setOpenIdx(null);
      if (li.getBoundingClientRect().top < NAV) centre(li, head.offsetHeight); // closed from far down: bring the title back
      return;
    }
    const content = li.querySelector<HTMLElement>("[data-details] > div > div")!; // natural height, even while collapsed
    const lift = openIdx !== null && openIdx < index
      ? rows.current[openIdx]!.querySelector<HTMLElement>("[data-details]")!.offsetHeight
      : 0;
    setOpenIdx(index);
    centre(li, head.offsetHeight + content.offsetHeight, lift);
  };

  return (
    <section id="experience" className="frame pt-24 md:pt-32">
      <h2 data-reveal className="t-head font-semibold mb-10">Experience</h2>

      {/* overflow-anchor off: we place the scroll ourselves while rows open and close. */}
      <ol className="[overflow-anchor:none]">
        {jobs.map((job, index) => {
          const open = openIdx === index;
          return (
            <li
              key={index}
              ref={(el) => { rows.current[index] = el; }}
              data-reveal
              style={{ "--i": index % 3 } as React.CSSProperties}
              className={`group transition-colors duration-500 ${open ? "bg-[var(--surface)]" : "hover:bg-[var(--surface)]"}`}
            >
              <div className="relative grid md:grid-cols-12 gap-x-8 gap-y-1 px-4 md:px-6 py-5">
                {/* The whole row is the toggle; the poster button sits above it. */}
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  aria-expanded={open}
                  aria-controls={`job-${index}`}
                  aria-label={`${job.title}, ${job.company}`}
                  className="absolute inset-0 w-full"
                />
                <span className="md:col-span-3 t-small text-[var(--dim)]">
                  {job.period}
                  {job.current && <span className="ml-3 text-[var(--brand)]">Current</span>}
                  <span className="block">{job.location}</span>
                </span>
                <span className="md:col-span-8">
                  <span className="block t-lead font-medium">
                    {job.title}
                    {job.previewImage && (
                      <button
                        type="button"
                        onClick={() => setPreviewImage(job.previewImage!)}
                        aria-label="View the research poster"
                        title="View the research poster"
                        className="relative z-10 p-3.5 -my-3.5 -ml-1.5 align-middle text-[var(--dim)] hover:text-[var(--brand)] transition-colors active:scale-90"
                      >
                        <Eye className="w-5 h-5" aria-hidden="true" />
                      </button>
                    )}
                  </span>
                  <span className="block mt-1 text-[var(--dim)]">{job.company} · {job.description}</span>
                </span>
                <Plus
                  aria-hidden="true"
                  className={`hidden md:block md:col-span-1 justify-self-end w-5 h-5 transition-transform duration-500 ease-expo ${open ? "rotate-45" : "group-hover:rotate-90"}`}
                />
              </div>

              <div id={`job-${index}`} data-details className={`grid transition-[grid-template-rows,opacity] duration-700 ease-expo ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                <div className="overflow-hidden" {...(!open && { inert: "" as any })}>
                  {/* Clicking anywhere in the details closes them (unless the reader is selecting text). */}
                  <div
                    className="grid md:grid-cols-12 gap-x-8 px-4 md:px-6 pb-6 cursor-pointer"
                    onClick={(e) => {
                      if ((e.target as HTMLElement).closest("a, button") || window.getSelection()?.toString()) return;
                      toggle(index);
                    }}
                  >
                    <div className="md:col-span-9 md:col-start-4 md:pr-11">
                      <ul className="space-y-3 list-disc pl-5 marker:text-[var(--brand)]">
                        {job.details.map((point, i) => (
                          <li key={i}>{point}</li>
                        ))}
                      </ul>
                      <p className="mt-6 t-small text-[var(--dim)]">{job.skills.join(" · ")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <ImagePreviewModal src={previewImage} onClose={() => setPreviewImage(null)} />
    </section>
  );
}
