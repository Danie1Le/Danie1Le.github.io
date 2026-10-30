import { type RefObject, useEffect, useState } from "react";

/** Whether at least `threshold` of the element is on screen now (`visible`), and whether it ever has been (`seen`). */
export function useInView(ref: RefObject<Element>, threshold: number) {
  const [visible, setVisible] = useState(false);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      setVisible(e.isIntersecting);
      if (e.isIntersecting) setSeen(true);
    }, { threshold });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [ref, threshold]);
  return { visible, seen };
}
