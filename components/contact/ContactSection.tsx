"use client"

import { contact } from "@/lib/content";
import { revealOrder } from "@/lib/motion";
import { EmailButton, SocialLinks } from "../ui/ContactLinks";
import ExternalLink from "../ui/ExternalLink";
import Panel from "../ui/Panel";
import { PageSection, SectionHeading } from "../ui/Section";
import CopyButton from "./CopyButton";

export default function ContactSection() {
  return (
    <PageSection id="contact" className="pb-16 md:pb-24">
      <Panel className="gap-y-10">
        <SectionHeading className="md:col-span-5 max-w-[12ch]">Let’s work together</SectionHeading>

        <div className="md:col-span-6 md:col-start-7 flex flex-col gap-8">
          <div data-reveal style={revealOrder(1)}>
            <p className="t-small text-[var(--dim)]">Email</p>
            <div className="mt-1 flex flex-wrap items-center gap-x-5 gap-y-1">
              <ExternalLink href={contact.gmail} className="link t-lead font-medium">
                {contact.email}
              </ExternalLink>
              <CopyButton text={contact.email} />
            </div>
          </div>

          <div data-reveal style={revealOrder(2)} className="flex flex-wrap gap-3 t-small font-medium">
            <EmailButton>Email me</EmailButton>
            <SocialLinks className="bg-[var(--raised)]" />
          </div>
        </div>
      </Panel>
    </PageSection>
  );
}
