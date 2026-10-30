import { rnd } from "../../math";

// Diamond-square, the terrain generator the research used: corner heights, then each square's centre and each
// edge's midpoint, with a random nudge that shrinks level by level, so the ground is rough at every scale.
const DS = 129; // a (2^7 + 1)² grid of heights
const DIAMOND_SQUARE = (() => {
  const h = new Float32Array(DS * DS), at = (x: number, y: number) => h[y * DS + x];
  let seed = 1;
  const jitter = () => rnd(seed++ * 0.731 + 0.17) - 0.5;
  const AMP = [0.08, 0.15, 0.9, 1, 0.6, 0.18, 0.06]; // per level, coarse to fine: strongest at the size of a mountain, so peaks spread evenly
  for (const i of [0, DS - 1, DS * (DS - 1), DS * DS - 1]) h[i] = jitter() * AMP[0];
  for (let step = DS - 1, lvl = 0; step > 1; step /= 2, lvl++) {
    const half = step / 2, amp = AMP[lvl];
    for (let y = half; y < DS; y += step) for (let x = half; x < DS; x += step) // diamond: each square's centre
      h[y * DS + x] = (at(x - half, y - half) + at(x + half, y - half) + at(x - half, y + half) + at(x + half, y + half)) / 4 + jitter() * amp;
    for (let y = 0; y < DS; y += half) for (let x = (y / half) % 2 ? 0 : half; x < DS; x += step) { // square: each edge's midpoint
      let sum = 0, cnt = 0;
      for (const [dx, dy] of [[-half, 0], [half, 0], [0, -half], [0, half]])
        if (x + dx >= 0 && x + dx < DS && y + dy >= 0 && y + dy < DS) { sum += at(x + dx, y + dy); cnt++; }
      h[y * DS + x] = sum / cnt + jitter() * amp;
    }
  }
  return h;
})();
export const fractal = (x: number, z: number) => { // the grid, sampled smoothly; the map shows a 3:1 band of it
  const u = ((x + 4) / 8) * (DS - 1), v = 43 + ((z + 1.3) / 2.6) * 41.6;
  const i = Math.min(DS - 2, Math.floor(u)), j = Math.min(DS - 2, Math.floor(v)), fu = u - i, fv = v - j, at = (a: number, b: number) => DIAMOND_SQUARE[b * DS + a];
  return at(i, j) * (1 - fu) * (1 - fv) + at(i + 1, j) * fu * (1 - fv) + at(i, j + 1) * (1 - fu) * fv + at(i + 1, j + 1) * fu * fv;
};
