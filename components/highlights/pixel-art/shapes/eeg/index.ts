import { toPixelCount } from "../../surfaces";
import type { Shape } from "../../types";
import { brainPoints, moveBrain } from "./brain";
import { carPoints, moveCar } from "./car";
import { moveSignal, signalPoints } from "./signal";

const DECISION_MS = 1400;

export function eeg(): Shape {
  return {
    points: toPixelCount([...brainPoints(), ...signalPoints(), ...carPoints()]),
    yaw: () => 0,
    tilt: () => 0.2,
    halfWidth: 4.55,
    halfHeight: 1.05,
    move: (p, t) => {
      const decisionProgress = (t % DECISION_MS) / DECISION_MS;
      const decisionsSoFar = Math.floor(t / DECISION_MS);
      if (p.part === "wave" || p.part === "arrow") return moveSignal(p, t, decisionProgress);
      if (p.part === "brain") return moveBrain(p, t);
      return moveCar(p, t, decisionsSoFar, decisionProgress);
    },
  };
}
