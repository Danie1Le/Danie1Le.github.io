/** One button per role; the chosen one is underlined in red. */
export default function RoleTabs({ roles, active, onPick }: { roles: string[]; active: number; onPick: (i: number) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-1 t-small">
      <div className="flex flex-wrap gap-x-5 gap-y-1" role="group" aria-label="Choose a role">
        {roles.map((role, i) => (
          <button
            key={role}
            aria-pressed={i === active}
            onClick={() => onPick(i)}
            className={`link min-h-11 transition-colors ${i === active ? "text-[var(--ink)] underline decoration-[var(--brand)]" : "text-[var(--dim)] hover:text-[var(--ink)]"}`}
          >
            {role}
          </button>
        ))}
      </div>
    </div>
  );
}
