"use client"

import { animDelay } from "@/lib/motion";
import { FileText } from "lucide-react";
import Portrait from "./hero/Portrait";
import { EmailButton, SocialLinks } from "./ui/ContactLinks";

interface HeroSectionProps {
  handleResumeClick: () => void;
}

const quiet = "btn-quiet flex-1 sm:flex-none";

// The first screen: name and role, the four ways in (Resume, LinkedIn, GitHub, Get in touch), and the portrait.
export default function HeroSection({ handleResumeClick }: HeroSectionProps) {
  return (
    <section id="hero" className="frame min-h-[100svh] flex flex-col justify-center pt-28 pb-16">
      <div className="grid md:grid-cols-12 gap-x-8 gap-y-10 items-center">
        <div className="md:order-2 md:col-span-5 md:col-start-8 flex justify-center md:justify-end">
          <Portrait />
        </div>

        <div className="md:order-1 md:col-span-7 text-center md:text-left">
          {/* The name's letters slide up in turn from behind a mask. */}
          <h1 aria-label="Daniel Le" className="font-semibold tracking-[-0.035em] leading-[1.05] text-[clamp(3rem,2rem+3.6vw,5.5rem)] overflow-hidden pb-[0.08em]">
            {Array.from("Daniel Le").map((ch, i) => (
              <span key={i} aria-hidden="true" className="letter" style={animDelay(0.25 + i * 0.045)}>
                {ch === " " ? "\u00a0" : ch}
              </span>
            ))}
          </h1>
          <p className="rise t-lead mt-4 text-[var(--dim)]" style={animDelay(0.45)}>
            Software Engineer
          </p>
          <div className="rise mt-10 flex flex-wrap justify-center md:justify-start gap-3 t-small font-medium" style={animDelay(0.6)}>
            <button onClick={handleResumeClick} className={quiet}>
              <FileText className="w-4 h-4" aria-hidden="true" /> Resume
            </button>
            <SocialLinks className={quiet} />
            <EmailButton>Get in touch</EmailButton>
          </div>
        </div>
      </div>
    </section>
  );
}
