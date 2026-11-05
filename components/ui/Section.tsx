import type { ReactNode } from "react";

export function PageSection({ id, className = "", children }: { id: string; className?: string; children: ReactNode }) {
  return (
    <section id={id} className={`frame pt-24 md:pt-32 ${className}`}>
      {children}
    </section>
  );
}

export function SectionHeading({ className = "", children }: { className?: string; children: ReactNode }) {
  return (
    <h2 data-reveal className={`t-head font-semibold ${className}`}>
      {children}
    </h2>
  );
}
