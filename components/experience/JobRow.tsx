import type { Job } from "@/lib/content";
import { revealOrder } from "@/lib/motion";
import { useImperativeHandle, useRef, type Ref } from "react";
import type { RowHandle } from "./centre";
import JobDetails from "./JobDetails";
import JobTitleRow from "./JobTitleRow";

interface JobRowProps {
  job: Job;
  index: number;
  open: boolean;
  onToggle: () => void;
  onPoster: (src: string) => void;
  rowRef: Ref<RowHandle>;
}

const REVEAL_GROUP_SIZE = 3;

export default function JobRow({ job, index, open, onToggle, onPoster, rowRef }: JobRowProps) {
  const row = useRef<HTMLLIElement>(null);
  const titleRow = useRef<HTMLDivElement>(null);
  const detailsCollapse = useRef<HTMLElement>(null);
  const detailsContent = useRef<HTMLDivElement>(null);
  const detailsId = `job-${index}`;

  useImperativeHandle(rowRef, () => ({
    el: row.current!,
    titleRowHeight: () => titleRow.current!.offsetHeight,
    openDetailsHeight: () => detailsContent.current!.offsetHeight,
    currentDetailsHeight: () => detailsCollapse.current!.offsetHeight,
  }), []);

  return (
    <li
      ref={row}
      data-reveal
      style={revealOrder(index % REVEAL_GROUP_SIZE)}
      className={`group transition-colors duration-500 ${open ? "bg-[var(--surface)]" : "hover:bg-[var(--surface)]"}`}
    >
      <JobTitleRow ref={titleRow} job={job} open={open} detailsId={detailsId} onToggle={onToggle} onPoster={onPoster} />
      <JobDetails
        id={detailsId}
        job={job}
        open={open}
        onClose={onToggle}
        collapseRef={detailsCollapse}
        contentRef={detailsContent}
      />
    </li>
  );
}
