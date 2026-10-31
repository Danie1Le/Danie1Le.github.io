import { fit } from "../../surfaces";
import type { Shape } from "../../types";
import { brainPoints, moveBrain } from "./brain";
import { carPoints, moveCar } from "./car";
import { moveSignal, signalPoints } from "./signal";

// EEG research: the brain, seen from the side, wears eight electrodes. Their channels stream right and funnel into an
// arrow that drives the team's RC car: each pulse down the arrow is one decision, and the car's front wheels steer.

const PULSE = 1400; // ms per decision

export function eeg(): Shape {
  return {
    points: fit([...brainPoints(), ...signalPoints(), ...carPoints()]),
    yaw: () => 0, // the scene stays put; the brain and the car each turn on their own spot
    tilt: 0.2,
    span: 4.55,
    half: 1.05,
    live: (p, _i, t) => {
      const beat = (t % PULSE) / PULSE, n = Math.floor(t / PULSE);
      if (p.g === "wave" || p.g === "arrow") return moveSignal(p, t, beat);
      if (p.g === "brain") return moveBrain(p, t);
      return moveCar(p, t, n, beat);
    },
  };
}
