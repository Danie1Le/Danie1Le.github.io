"use client"

import { animDelay } from "@/lib/motion";
import { site } from "@/lib/site";
import { ICON } from "@/lib/styles";
import { FileText } from "lucide-react";
import { EmailButton, QUIET_BUTTON, SocialLinks } from "../ui/ContactLinks";
import AnimatedName from "./AnimatedName";
import Portrait from "./Portrait";

export default function HeroSection({ onResume }: { onResume: () => void }) {
  return (
    <section id="hero" className="frame min-h-[100svh] flex flex-col justify-center pt-28 pb-16">
      <div className="grid md:grid-cols-12 gap-x-8 gap-y-10 items-center">
        <div className="md:order-2 md:col-span-5 md:col-start-8 flex justify-center md:justify-end">
          <Portrait />
        </div>

        <div className="md:order-1 md:col-span-7 text-center md:text-left">
          <AnimatedName />
          <p className="rise t-lead mt-4 text-[var(--dim)]" style={animDelay(0.45)}>
            {site.role}
          </p>
          <div className="rise mt-10 flex flex-wrap justify-center md:justify-start gap-3 t-small font-medium" style={animDelay(0.6)}>
            <button onClick={onResume} className={QUIET_BUTTON}>
              <FileText className={ICON} aria-hidden="true" /> Resume
            </button>
            <SocialLinks />
            <EmailButton>Get in touch</EmailButton>
          </div>
        </div>
      </div>
    </section>
  );
}
