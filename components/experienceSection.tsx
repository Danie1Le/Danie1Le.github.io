"use client"

import { jobs } from "@/lib/content"
import { useRef, useState } from "react"
import { centreRow, keepTitleOnScreen, type RowHandle } from "./experience/centre"
import JobRow from "./experience/JobRow"
import ImagePreviewModal from "./ui/ImagePreviewModal"

// Every role starts closed. Opening one closes any other and brings it to the centre of the screen.
export default function ExperienceSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const rows = useRef<(RowHandle | null)[]>([]);

  const toggle = (index: number) => {
    const row = rows.current[index]!;
    if (openIdx === index) {
      setOpenIdx(null);
      keepTitleOnScreen(row.el, row.headHeight());
      return;
    }
    const lift = openIdx !== null && openIdx < index // a role above is closing, so this one will rise
      ? rows.current[openIdx]!.detailsHeight()
      : 0;
    setOpenIdx(index);
    centreRow(row.el, row.headHeight() + row.contentHeight(), lift);
  };

  return (
    <section id="experience" className="frame pt-24 md:pt-32">
      <h2 data-reveal className="t-head font-semibold mb-10">Experience</h2>

      {/* overflow-anchor off: we place the scroll ourselves while rows open and close. */}
      <ol className="[overflow-anchor:none]">
        {jobs.map((job, index) => (
          <JobRow
            key={index}
            job={job}
            index={index}
            open={openIdx === index}
            onToggle={() => toggle(index)}
            onPreview={setPreviewImage}
            rowRef={(row) => { rows.current[index] = row; }}
          />
        ))}
      </ol>

      <ImagePreviewModal src={previewImage} onClose={() => setPreviewImage(null)} />
    </section>
  );
}
