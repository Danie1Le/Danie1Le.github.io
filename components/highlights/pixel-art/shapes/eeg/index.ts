import { toPixelCount } from "../../surfaces";
import type { Shape } from "../../types";
import { brainPoints, moveBrain } from "./brain";
import { carPoints, moveCar } from "./car";
import { decisionAt } from "./decision";
import { moveSignal, signalPoints } from "./signal";

export function eeg(): Shape {
  return {
    points: toPixelCount([...brainPoints(), ...signalPoints(), ...carPoints()]),
    yaw: () => 0,
    tilt: () => 0.2,
    halfWidth: 4.55,
    halfHeight: 1.05,
    move: (p, t) => {
      const decision = decisionAt(t);
      if (p.part === "wave" || p.part === "arrow") return moveSignal(p, t, decision);
      if (p.part === "brain") return moveBrain(p, t);
      return moveCar(p, t, decision);
    },
  };
}
