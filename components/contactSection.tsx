"use client"

import { contact } from "@/lib/data";
import { Check, Copy, Github, Linkedin, Mail } from "lucide-react";
import { useState } from "react";

// The page ends on a panel shaped like Skills: the heading on the left, the ways to reach me on the right.
export default function ContactSection() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {} // clipboard blocked: the address is still on screen to select
  };

  return (
    <section id="contact" className="frame pt-24 md:pt-32 pb-16 md:pb-24">
      <div className="bg-[var(--surface)] transition-colors duration-500 grid md:grid-cols-12 gap-x-8 gap-y-10 p-6 md:p-12">
        <h2 data-reveal className="md:col-span-5 t-head font-semibold max-w-[12ch]">Let’s work together</h2>

        <div className="md:col-span-6 md:col-start-7 flex flex-col gap-8">
          <div data-reveal style={{ "--i": 1 } as React.CSSProperties}>
            <p className="t-small text-[var(--dim)]">Email</p>
            <div className="mt-1 flex flex-wrap items-center gap-x-5 gap-y-1">
              <a href={contact.gmail} target="_blank" rel="noopener noreferrer" className="link t-lead font-medium">
                {contact.email}
              </a>
              <button
                onClick={copy}
                className="inline-flex items-center gap-1.5 min-h-11 t-small text-[var(--dim)] hover:text-[var(--brand)] transition-colors active:scale-95"
              >
                {copied ? <Check className="w-4 h-4" aria-hidden="true" /> : <Copy className="w-4 h-4" aria-hidden="true" />}
                <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
          </div>

          <div data-reveal style={{ "--i": 2 } as React.CSSProperties} className="flex flex-wrap gap-3 t-small font-medium">
            <a href={contact.gmail} target="_blank" rel="noopener noreferrer" className="btn-brand min-h-11 px-5 w-full sm:w-auto">
              <Mail className="w-4 h-4" aria-hidden="true" /> Email me
            </a>
            <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="btn-quiet bg-[var(--raised)] flex-1 sm:flex-none">
              <Linkedin className="w-4 h-4" aria-hidden="true" /> LinkedIn
            </a>
            <a href={contact.github} target="_blank" rel="noopener noreferrer" className="btn-quiet bg-[var(--raised)] flex-1 sm:flex-none">
              <Github className="w-4 h-4" aria-hidden="true" /> GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
