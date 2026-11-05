import { observeIntersections } from "@/lib/observe";
import { useEffect, useState } from "react";

const UPPER_THIRD_OF_SCREEN = "-35% 0px -60% 0px";

export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const sections = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);
    return observeIntersections(
      sections,
      (entry) => entry.isIntersecting && setActive(entry.target.id),
      { rootMargin: UPPER_THIRD_OF_SCREEN }
    );
  }, [ids]);
  return active;
}
