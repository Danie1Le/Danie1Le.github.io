"use client"

import { skills } from "@/lib/content";

interface AboutSectionProps {
  handleResumeClick: () => void;
}

const toolbox = [
  { title: "Languages", items: skills.programmingLanguages },
  { title: "Frameworks", items: skills.technologies },
  { title: "Tools", items: skills.developmentTools },
];

export default function AboutSection({ handleResumeClick }: AboutSectionProps) {
  return (
    <section id="about" className="frame pt-24 md:pt-32">
      <div className="bg-[var(--surface)] transition-colors duration-500 grid md:grid-cols-12 gap-x-8 gap-y-12 p-6 md:p-12">
        <div className="md:col-span-7">
          <h2 data-reveal className="t-head font-semibold max-w-[14ch]">Skills</h2>

          <div className="mt-10 md:mt-14 grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-8">
            {toolbox.map((group, i) => (
              <div key={group.title} data-reveal style={{ "--i": i + 1 } as React.CSSProperties}>
                <h3 className="font-medium">{group.title}</h3>
                <ul className="mt-3 space-y-1 text-[var(--dim)]">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-4 md:col-start-9 flex flex-col gap-12 md:pt-2">
          <div data-reveal style={{ "--i": 1 } as React.CSSProperties}>
            <h3 className="t-lead">How I got here</h3>
            <p className="mt-4">
              I’m a Computer Science student at the University of Portland. I started out curious and unsure which career
              I wanted. Projects in AI, machine learning and web development turned that curiosity into a drive to build
              applications that solve real problems.
            </p>
          </div>
          <div data-reveal style={{ "--i": 2 } as React.CSSProperties}>
            <h3 className="t-lead">Off the clock</h3>
            <p className="mt-4">
              You’ll find me exploring new technologies, at the gym, playing video games or picking up a new hobby.
              I want to keep learning and work on projects that help other people as well as me.
            </p>
          </div>
          <div data-reveal style={{ "--i": 3 } as React.CSSProperties}>
            <p className="text-[var(--dim)]">Interested in {skills.interests.join(", ").replace(/, ([^,]*)$/, " and $1")}.</p>
            <button onClick={handleResumeClick} className="btn-brand mt-6">View my resume</button>
          </div>
        </div>
      </div>
    </section>
  );
}
