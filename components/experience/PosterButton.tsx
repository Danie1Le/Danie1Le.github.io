import { Eye } from "lucide-react";

export default function PosterButton({ src, onOpen }: { src: string; onOpen: (src: string) => void }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(src)}
      aria-label="View the poster"
      title="View the poster"
      className="relative z-10 p-3.5 -my-3.5 -ml-1.5 align-middle text-[var(--dim)] hover:text-[var(--brand)] transition-colors active:scale-90"
    >
      <Eye className="w-5 h-5" aria-hidden="true" />
    </button>
  );
}
