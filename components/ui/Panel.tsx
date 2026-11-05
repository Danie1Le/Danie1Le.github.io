import { SURFACE } from "@/lib/styles";
import type { ReactNode } from "react";

export default function Panel({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`${SURFACE} grid md:grid-cols-12 gap-x-8 p-6 md:p-12 ${className}`}>{children}</div>;
}
