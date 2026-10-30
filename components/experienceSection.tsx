"use client"

import { jobs } from "@/lib/content"
import { useRef, useState } from "react"
import { centreRow, keepTitleOnScreen } from "./experience/centre"
import JobRow from "./experience/JobRow"
import ImagePreviewModal from "./ui/ImagePreviewModal"

// Every role starts closed. Opening one closes any other and brings it to the centre of the screen.
export default function ExperienceSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const rows = useRef<(HTMLLIElement | null)[]>([]);

  const toggle = (index: number) => {
    const li = rows.current[index]!;
    const head = li.firstElementChild as HTMLElement;
    if (openIdx === index) {
      setOpenIdx(null);
      keepTitleOnScreen(li, head.offsetHeight);
      return;
    }
    const content = li.querySelector<HTMLElement>("[data-details] > div > div")!; // natural height, even while collapsed
    const lift = openIdx !== null && openIdx < index // a role above is closing, so this one will rise
      ? rows.current[openIdx]!.querySelector<HTMLElement>("[data-details]")!.offsetHeight
      : 0;
    setOpenIdx(index);
    centreRow(li, head.offsetHeight + content.offsetHeight, lift);
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
            rowRef={(el) => { rows.current[index] = el; }}
          />
        ))}
      </ol>

      <ImagePreviewModal src={previewImage} onClose={() => setPreviewImage(null)} />
    </section>
  );
}
