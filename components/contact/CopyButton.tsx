import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { ICON } from "@/lib/styles";
import { Check, Copy } from "lucide-react";

export default function CopyButton({ text }: { text: string }) {
  const { copied, copy } = useCopyToClipboard(text);
  const Icon = copied ? Check : Copy;
  return (
    <button
      onClick={copy}
      className="inline-flex items-center gap-1.5 min-h-11 t-small text-[var(--dim)] hover:text-[var(--brand)] transition-colors active:scale-95"
    >
      <Icon className={ICON} aria-hidden="true" />
      <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}
