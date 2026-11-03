import { contact } from "@/lib/content";
import { Github, Linkedin, Mail } from "lucide-react";
import type { ReactNode } from "react";
import ExternalLink from "./ExternalLink";

/** The red primary button that opens a new Gmail message to me. */
export function EmailButton({ children }: { children: ReactNode }) {
  return (
    <ExternalLink href={contact.gmail} className="btn-brand min-h-11 px-5 w-full sm:w-auto">
      <Mail className="w-4 h-4" aria-hidden="true" /> {children}
    </ExternalLink>
  );
}

/** The quiet button style: shares a row on phones, sizes to its label from sm up. */
export const QUIET_BUTTON = "btn-quiet flex-1 sm:flex-none";

/** LinkedIn then GitHub, as a pair of quiet buttons; `className` adds to their shared style (e.g. a background). */
export function SocialLinks({ className = "" }: { className?: string }) {
  const style = `${QUIET_BUTTON} ${className}`.trim();
  return (
    <>
      <ExternalLink href={contact.linkedin} className={style}>
        <Linkedin className="w-4 h-4" aria-hidden="true" /> LinkedIn
      </ExternalLink>
      <ExternalLink href={contact.github} className={style}>
        <Github className="w-4 h-4" aria-hidden="true" /> GitHub
      </ExternalLink>
    </>
  );
}
