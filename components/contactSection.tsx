"use client"

import { contact } from "@/lib/data";
import { Github, Linkedin } from "lucide-react";

// The page ends here, on a raised shade of the ground rather than a light band.
export default function ContactSection() {
  const [user, domain] = contact.email.split("@");
  return (
    <section id="contact" className="mt-24 md:mt-32 bg-[var(--surface)] transition-colors duration-500">
      <div className="frame py-20 md:py-28">
        <h2 data-reveal className="t-head font-semibold">Let’s work together</h2>

        <a
          data-reveal
          style={{ "--i": 1 } as React.CSSProperties}
          href={contact.gmail}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-block mt-10 md:mt-14 font-medium leading-tight tracking-tight text-[clamp(1.75rem,1rem+3.4vw,4rem)] hover:text-[var(--brand)] transition-colors duration-300"
        >
          <span className="block sm:inline">{user}@</span>
          <span className="block sm:inline">{domain}</span>
          <span className="block h-[3px] mt-2 bg-current origin-left scale-x-0 transition-transform duration-700 ease-expo group-hover:scale-x-100" aria-hidden="true" />
        </a>

        <div data-reveal style={{ "--i": 2 } as React.CSSProperties} className="mt-10 md:mt-14 flex gap-3 t-small font-medium">
          <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="btn-quiet bg-[var(--raised)] flex-1 sm:flex-none">
            <Linkedin className="w-4 h-4" aria-hidden="true" /> LinkedIn
          </a>
          <a href={contact.github} target="_blank" rel="noopener noreferrer" className="btn-quiet bg-[var(--raised)] flex-1 sm:flex-none">
            <Github className="w-4 h-4" aria-hidden="true" /> GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
