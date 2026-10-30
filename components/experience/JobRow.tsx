import type { Job } from "@/lib/content";
import { revealOrder } from "@/lib/motion";
import { Eye, Plus } from "lucide-react";
import type { Ref } from "react";
import Collapse from "../ui/Collapse";

interface JobRowProps {
  job: Job;
  index: number;
  open: boolean;
  onToggle: () => void;
  onPreview: (src: string) => void;
  rowRef: Ref<HTMLLIElement>;
}

/**
 * One role: dates and place, title and company, and a + that turns into ×. The whole row toggles its bullets;
 * clicking anywhere in the open bullets closes them again (unless the reader is selecting text).
 */
export default function JobRow({ job, index, open, onToggle, onPreview, rowRef }: JobRowProps) {
  return (
    <li
      ref={rowRef}
      data-reveal
      style={revealOrder(index % 3)}
      className={`group transition-colors duration-500 ${open ? "bg-[var(--surface)]" : "hover:bg-[var(--surface)]"}`}
    >
      <div className="relative grid md:grid-cols-12 gap-x-8 gap-y-1 px-4 md:px-6 py-5">
        {/* The whole row is the toggle; the poster button sits above it. */}
        <button
          type="button"
          onClick={onToggle}
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
                onClick={() => onPreview(job.previewImage!)}
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

      <Collapse id={`job-${index}`} data-details="" open={open} className="duration-700 ease-expo">
        <div
          className="grid md:grid-cols-12 gap-x-8 px-4 md:px-6 pb-6 cursor-pointer"
          onClick={(e) => {
            if ((e.target as HTMLElement).closest("a, button") || window.getSelection()?.toString()) return;
            onToggle();
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
      </Collapse>
    </li>
  );
}
