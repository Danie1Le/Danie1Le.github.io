import { prefersReducedMotion } from "@/lib/motion";
import { useEffect, useState } from "react";

/** Whether the visitor asked for less motion, for rendering decisions. False on the server and first paint. */
export function useReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => setReduce(prefersReducedMotion()), []);
  return reduce;
}
