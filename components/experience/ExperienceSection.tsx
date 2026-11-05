"use client"

import { jobs } from "@/lib/content"
import { useRef, useState } from "react"
import ImagePreviewModal from "../ui/ImagePreviewModal"
import { PageSection, SectionHeading } from "../ui/Section"
import { centreRow, keepTitleOnScreen, type RowHandle } from "./centre"
import JobRow from "./JobRow"

export default function ExperienceSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [poster, setPoster] = useState<string | null>(null);
  const rows = useRef<(RowHandle | null)[]>([]);

  const rowAt = (index: number) => rows.current[index]!;

  const riseFromRowAboveClosing = (index: number) =>
    openIndex !== null && openIndex < index ? rowAt(openIndex).currentDetailsHeight() : 0;

  const close = (row: RowHandle) => {
    setOpenIndex(null);
    keepTitleOnScreen(row.el, row.titleRowHeight());
  };

  const open = (index: number, row: RowHandle) => {
    const rise = riseFromRowAboveClosing(index);
    setOpenIndex(index);
    centreRow(row.el, row.titleRowHeight() + row.openDetailsHeight(), rise);
  };

  const toggle = (index: number) => (openIndex === index ? close(rowAt(index)) : open(index, rowAt(index)));

  return (
    <PageSection id="experience">
      <SectionHeading className="mb-10">Experience</SectionHeading>

      <ol className="[overflow-anchor:none]">
        {jobs.map((job, index) => (
          <JobRow
            key={index}
            job={job}
            index={index}
            open={openIndex === index}
            onToggle={() => toggle(index)}
            onPoster={setPoster}
            rowRef={(row) => { rows.current[index] = row; }}
          />
        ))}
      </ol>

      <ImagePreviewModal src={poster} onClose={() => setPoster(null)} />
    </PageSection>
  );
}
