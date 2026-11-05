import { contact } from "@/lib/content";
import { ICON } from "@/lib/styles";
import { Github, Linkedin, Mail } from "lucide-react";
import type { ReactNode } from "react";
import ExternalLink from "./ExternalLink";

export const QUIET_BUTTON = "btn-quiet flex-1 sm:flex-none";

export function EmailButton({ children }: { children: ReactNode }) {
  return (
    <ExternalLink href={contact.gmail} className="btn-brand min-h-11 px-5 w-full sm:w-auto">
      <Mail className={ICON} aria-hidden="true" /> {children}
    </ExternalLink>
  );
}

export function SocialLinks({ className = "" }: { className?: string }) {
  const style = `${QUIET_BUTTON} ${className}`.trim();
  return (
    <>
      <ExternalLink href={contact.linkedin} className={style}>
        <Linkedin className={ICON} aria-hidden="true" /> LinkedIn
      </ExternalLink>
      <ExternalLink href={contact.github} className={style}>
        <Github className={ICON} aria-hidden="true" /> GitHub
      </ExternalLink>
    </>
  );
}
