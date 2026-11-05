import type { Vec3 } from "./math";
import type { Screen } from "./types";

const PERSPECTIVE_DISTANCE = 4;

export function makeCamera(width: number, height: number, scale: number, yaw: number, tilt: number) {
  const cosYaw = Math.cos(yaw), sinYaw = Math.sin(yaw), cosTilt = Math.cos(tilt), sinTilt = Math.sin(tilt);

  const toView = (x: number, y: number, z: number): Vec3 => {
    const turnedX = x * cosYaw + z * sinYaw, turnedZ = -x * sinYaw + z * cosYaw;
    return [turnedX, y * cosTilt + turnedZ * sinTilt, -y * sinTilt + turnedZ * cosTilt];
  };

  const project = (x: number, y: number, z: number): Screen => {
    const [viewX, viewY, depth] = toView(x, y, z);
    const perspective = PERSPECTIVE_DISTANCE / (PERSPECTIVE_DISTANCE + depth);
    return { x: width / 2 + viewX * scale * perspective, y: height / 2 - viewY * scale * perspective, perspective, depth };
  };

  const view = ([nx, ny, nz]: Vec3) => toView(nx, ny, nz);

  return { project, view };
}
