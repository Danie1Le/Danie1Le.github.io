import { prefersReducedMotion } from "@/lib/media";
import { useEffect, useState } from "react";

export function useReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => setReduce(prefersReducedMotion()), []);
  return reduce;
}
