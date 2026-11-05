import type { Job } from "@/lib/content";
import { forwardRef, type MouseEvent } from "react";
import Collapse from "../ui/Collapse";

interface JobDetailsProps {
  id: string;
  job: Job;
  open: boolean;
  onClose: () => void;
}

const isOnControl = (e: MouseEvent) => (e.target as HTMLElement).closest("a, button") !== null;
const isSelectingText = () => Boolean(window.getSelection()?.toString());

const JobDetails = forwardRef<HTMLDivElement, JobDetailsProps>(function JobDetails({ id, job, open, onClose }, ref) {
  const closeOnPlainClick = (e: MouseEvent) => {
    if (isOnControl(e) || isSelectingText()) return;
    onClose();
  };

  return (
    <Collapse id={id} open={open} className="duration-700 ease-expo">
      <div ref={ref} className="grid md:grid-cols-12 gap-x-8 px-4 md:px-6 pb-6 cursor-pointer" onClick={closeOnPlainClick}>
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
  );
});

export default JobDetails;
