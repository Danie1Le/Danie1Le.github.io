import { activeText } from "@/lib/styles";

interface FilterButtonProps {
  label: string;
  count: number;
  chosen: boolean;
  onPick: () => void;
}

const markerStyle = (chosen: boolean) => (chosen ? "bg-[var(--brand)] scale-100 opacity-100" : "scale-50 opacity-0");

export default function FilterButton({ label, count, chosen, onPick }: FilterButtonProps) {
  return (
    <button
      onClick={onPick}
      aria-pressed={chosen}
      className={`flex items-baseline gap-2 whitespace-nowrap transition-colors duration-300 active:scale-95 ${activeText(chosen)}`}
    >
      <span className={`inline-block w-2 h-2 self-center transition-[transform,opacity] duration-500 ${markerStyle(chosen)}`} aria-hidden="true" />
      {label}
      <span className="t-small tabular-nums">{count}</span>
    </button>
  );
}
