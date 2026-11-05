import type { Job } from "@/lib/content";
import type { MouseEvent, Ref } from "react";
import Collapse from "../ui/Collapse";

interface JobDetailsProps {
  id: string;
  job: Job;
  open: boolean;
  onClose: () => void;
  collapseRef: Ref<HTMLElement>;
  contentRef: Ref<HTMLDivElement>;
}

const isOnControl = (e: MouseEvent) => (e.target as HTMLElement).closest("a, button") !== null;
const isSelectingText = () => Boolean(window.getSelection()?.toString());

export default function JobDetails({ id, job, open, onClose, collapseRef, contentRef }: JobDetailsProps) {
  const closeOnPlainClick = (e: MouseEvent) => {
    if (isOnControl(e) || isSelectingText()) return;
    onClose();
  };

  return (
    <Collapse ref={collapseRef} id={id} open={open} className="duration-700 ease-expo">
      <div ref={contentRef} className="grid md:grid-cols-12 gap-x-8 px-4 md:px-6 pb-6 cursor-pointer" onClick={closeOnPlainClick}>
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
}
