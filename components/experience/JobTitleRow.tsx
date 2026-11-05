import type { Job } from "@/lib/content";
import { Plus } from "lucide-react";
import { forwardRef } from "react";
import PosterButton from "./PosterButton";

interface JobTitleRowProps {
  job: Job;
  open: boolean;
  detailsId: string;
  onToggle: () => void;
  onPoster: (src: string) => void;
}

const JobTitleRow = forwardRef<HTMLDivElement, JobTitleRowProps>(function JobTitleRow({ job, open, detailsId, onToggle, onPoster }, ref) {
  return (
    <div ref={ref} className="relative grid md:grid-cols-12 gap-x-8 gap-y-1 px-4 md:px-6 py-5">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={detailsId}
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
          {job.poster && <PosterButton src={job.poster} onOpen={onPoster} />}
        </span>
        <span className="block mt-1 text-[var(--dim)]">{job.company} · {job.description}</span>
      </span>
      <Plus
        aria-hidden="true"
        className={`hidden md:block md:col-span-1 justify-self-end w-5 h-5 transition-transform duration-500 ease-expo ${open ? "rotate-45" : "group-hover:rotate-90"}`}
      />
    </div>
  );
});

export default JobTitleRow;
