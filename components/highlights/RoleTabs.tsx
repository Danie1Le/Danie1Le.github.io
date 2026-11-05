import { activeText } from "@/lib/styles";

interface RoleTabsProps {
  roles: string[];
  active: number;
  onPick: (index: number) => void;
}

const underlinedWhen = (active: boolean) => (active ? "underline decoration-[var(--brand)]" : "");

export default function RoleTabs({ roles, active, onPick }: RoleTabsProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-1 t-small">
      <div className="flex flex-wrap gap-x-5 gap-y-1" role="group" aria-label="Choose a role">
        {roles.map((role, i) => (
          <button
            key={role}
            aria-pressed={i === active}
            onClick={() => onPick(i)}
            className={`link min-h-11 transition-colors ${activeText(i === active)} ${underlinedWhen(i === active)}`}
          >
            {role}
          </button>
        ))}
      </div>
    </div>
  );
}
