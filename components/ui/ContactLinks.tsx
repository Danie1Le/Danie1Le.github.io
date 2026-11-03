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

/** LinkedIn then GitHub, as a pair of buttons styled by `className`. */
export function SocialLinks({ className }: { className: string }) {
  return (
    <>
      <ExternalLink href={contact.linkedin} className={className}>
        <Linkedin className="w-4 h-4" aria-hidden="true" /> LinkedIn
      </ExternalLink>
      <ExternalLink href={contact.github} className={className}>
        <Github className="w-4 h-4" aria-hidden="true" /> GitHub
      </ExternalLink>
    </>
  );
}
