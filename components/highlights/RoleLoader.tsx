import { ROLE_MS } from "./pixel-art/constants";
import ProgressTrack from "./ProgressTrack";

export default function RoleLoader({ running, onDone }: { running: boolean; onDone: () => void }) {
  return (
    <ProgressTrack
      as="div"
      tint="faint"
      className="mx-6 md:mx-8"
      fillClassName="origin-left"
      fillStyle={{ animation: `fill-x ${ROLE_MS}ms linear both`, animationPlayState: running ? "running" : "paused" }}
      onFillEnd={onDone}
    />
  );
}
