import { ROLE_MS } from "../constants";
import { fit } from "../surfaces";
import type { Pt, Shape } from "../types";

// Framatome: five engineering documents; a scan runs down them and the pages with page-number errors flag red.
export function pages(): Shape {
  const pts: Pt[] = [], w = 1.1, h = 1.44;
  for (let p = 0; p < 5; p++) {
    const cx = (p - 2) * 1.55, flagged = p === 1 || p === 3;
    for (let j = 0; j < 90; j++) { // page outline
      let d = (j / 90) * 2 * (w + h), x, y;
      if (d < w) [x, y] = [-w / 2 + d, h / 2];
      else if ((d -= w) < h) [x, y] = [w / 2, h / 2 - d];
      else if ((d -= h) < w) [x, y] = [w / 2 - d, -h / 2];
      else [x, y] = [-w / 2, -h / 2 + d - w];
      pts.push({ x: cx + x, y, z: 0, spin: true });
    }
    for (let j = 0; j < 160; j++) { // eight lines of text
      const l = Math.floor(j / 20), len = 0.8 - (l % 3) * 0.16;
      pts.push({ x: cx - 0.4 + ((j % 20) / 19) * len, y: 0.5 - l * 0.13, z: 0, spin: true });
    }
    for (let j = 0; j < 30; j++) // the page number
      pts.push({ x: cx - 0.1 + (j % 10) * 0.022, y: -0.6 + Math.floor(j / 10) * 0.03, z: 0, spin: true, flag: flagged });
  }
  return {
    points: fit(pts),
    yaw: (t) => 0.24 * Math.sin(t / 1800),
    tilt: 0.1,
    span: 4.7, // room for the nearest page, which grows in perspective as the stack turns toward the viewer
    // The scan line passes the page numbers about two-thirds of the way through the role, then runs off the page.
    live: (p, _i, t) => {
      const scan = 0.8 - 1.75 * Math.min(1, t / (ROLE_MS * 0.75));
      return { ...p, red: (p.flag && scan < -0.55) || Math.abs(p.y - scan) < 0.035 };
    },
  };
}
