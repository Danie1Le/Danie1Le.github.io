"use client"

import { skills, story } from "@/lib/content";
import { revealOrder } from "@/lib/motion";
import { joinAnd } from "@/lib/text";
import Panel from "../ui/Panel";
import { PageSection, SectionHeading } from "../ui/Section";
import Toolbox from "./Toolbox";

export default function AboutSection({ onResume }: { onResume: () => void }) {
  return (
    <PageSection id="about">
      <Panel className="gap-y-12">
        <div className="md:col-span-7">
          <SectionHeading className="max-w-[14ch]">Skills</SectionHeading>
          <Toolbox />
        </div>

        <div className="md:col-span-4 md:col-start-9 flex flex-col gap-12 md:pt-2">
          {story.map(({ heading, text }, i) => (
            <div key={heading} data-reveal style={revealOrder(i + 1)}>
              <h3 className="t-lead">{heading}</h3>
              <p className="mt-4">{text}</p>
            </div>
          ))}
          <div data-reveal style={revealOrder(story.length + 1)}>
            <p className="text-[var(--dim)]">Interested in {joinAnd(skills.interests)}.</p>
            <button onClick={onResume} className="btn-brand mt-6">View my resume</button>
          </div>
        </div>
      </Panel>
    </PageSection>
  );
}
