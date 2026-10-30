/**
 * The camera for one frame: turned by `yaw` about the vertical axis, looking down by `tilt`, with gentle perspective,
 * centred in a W × H canvas at `scale` pixels per model unit.
 */
export function makeCamera(W: number, H: number, scale: number, yaw: number, tilt: number) {
  const cy = Math.cos(yaw), syw = Math.sin(yaw), ct = Math.cos(tilt), st = Math.sin(tilt);
  /** Model point → [screen x, screen y, perspective, depth]. Flat overlays (spin false) face the viewer unturned. */
  const project = (x: number, y: number, z: number, spin = true) => {
    if (spin) [x, z] = [x * cy + z * syw, -x * syw + z * cy];
    else z = 0;
    const y2 = y * ct + z * st, z2 = -y * st + z * ct, persp = 4 / (4 + z2); // positive tilt looks down from above
    return [W / 2 + x * scale * persp, H / 2 - y2 * scale * persp, persp, z2];
  };
  /** A surface direction as the camera sees it: [right, up, away]. */
  const view = ([nx, ny, nz]: number[]) => {
    [nx, nz] = [nx * cy + nz * syw, -nx * syw + nz * cy];
    return [nx, ny * ct + nz * st, -ny * st + nz * ct];
  };
  return { project, view };
}
