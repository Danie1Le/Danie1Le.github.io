import { skills } from "@/lib/content";
import { revealOrder } from "@/lib/motion";

const TOOLBOX = [
  { title: "Languages", items: skills.programmingLanguages },
  { title: "Frameworks", items: skills.technologies },
  { title: "Tools", items: skills.developmentTools },
];

export default function Toolbox() {
  return (
    <div className="mt-10 md:mt-14 grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-8">
      {TOOLBOX.map((group, i) => (
        <div key={group.title} data-reveal style={revealOrder(i + 1)}>
          <h3 className="font-medium">{group.title}</h3>
          <ul className="mt-3 space-y-1 text-[var(--dim)]">
            {group.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
