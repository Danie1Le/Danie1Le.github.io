import { observeIntersections } from "@/lib/observe";
import { type RefObject, useEffect, useState } from "react";

export function useInView(ref: RefObject<Element>, threshold: number) {
  const [visible, setVisible] = useState(false);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    return observeIntersections([ref.current], (entry) => {
      setVisible(entry.isIntersecting);
      if (entry.isIntersecting) setSeen(true);
    }, { threshold });
  }, [ref, threshold]);
  return { visible, seen };
}
