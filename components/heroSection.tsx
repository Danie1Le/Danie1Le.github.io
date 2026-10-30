"use client"

import { contact } from "@/lib/content";
import { getImagePath } from "@/lib/utils";
import { FileText, Github, Linkedin, Mail } from "lucide-react";
import { useEffect, useRef } from "react";

interface HeroSectionProps {
  handleResumeClick: () => void;
}

const quiet = "btn-quiet flex-1 sm:flex-none";

const delay = (s: number) => ({ "--d": `${s}s` }) as React.CSSProperties;

export default function HeroSection({ handleResumeClick }: HeroSectionProps) {
  const portrait = useRef<HTMLDivElement>(null);

  // The portrait drifts a little slower than the page as you scroll away.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (portrait.current) portrait.current.style.transform = `translateY(${Math.min(window.scrollY, 900) * 0.12}px)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(frame); };
  }, []);

  return (
    <section id="hero" className="frame min-h-[100svh] flex flex-col justify-center pt-28 pb-16">
      <div className="grid md:grid-cols-12 gap-x-8 gap-y-10 items-center">
        {/* The portrait stands in an arched alcove, the one lit exhibit on the first screen. */}
        <div className="md:order-2 md:col-span-5 md:col-start-8 flex justify-center md:justify-end">
          <div ref={portrait} className="w-[min(64vw,300px)] md:w-[min(30vw,380px)] arch ring-up bg-[var(--brand)] p-[3px]">
            <div className="arch arch-inner aspect-[4/5] overflow-hidden">
              <img
                src={getImagePath("/Profile_Picture.png")}
                alt="Portrait of Daniel Le"
                width={1024}
                height={1024}
                fetchPriority="high"
                className="lights-up w-full h-full object-cover"
                style={{ objectPosition: "center 20%" }}
              />
            </div>
          </div>
        </div>

        <div className="md:order-1 md:col-span-7 text-center md:text-left">
          <h1 aria-label="Daniel Le" className="font-semibold tracking-[-0.035em] leading-[1.05] text-[clamp(3rem,2rem+3.6vw,5.5rem)] overflow-hidden pb-[0.08em]">
            {Array.from("Daniel Le").map((ch, i) => (
              <span key={i} aria-hidden="true" className="letter" style={delay(0.25 + i * 0.045)}>
                {ch === " " ? "\u00a0" : ch}
              </span>
            ))}
          </h1>
          <p className="rise t-lead mt-4 text-[var(--dim)]" style={delay(0.45)}>
            Software Engineer
          </p>
          <div className="rise mt-10 flex flex-wrap justify-center md:justify-start gap-3 t-small font-medium" style={delay(0.6)}>
            <button onClick={handleResumeClick} className={quiet}>
              <FileText className="w-4 h-4" aria-hidden="true" /> Resume
            </button>
            <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className={quiet}>
              <Linkedin className="w-4 h-4" aria-hidden="true" /> LinkedIn
            </a>
            <a href={contact.github} target="_blank" rel="noopener noreferrer" className={quiet}>
              <Github className="w-4 h-4" aria-hidden="true" /> GitHub
            </a>
            <a href={contact.gmail} target="_blank" rel="noopener noreferrer" className="btn-brand min-h-11 px-5 w-full sm:w-auto">
              <Mail className="w-4 h-4" aria-hidden="true" /> Get in touch
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
