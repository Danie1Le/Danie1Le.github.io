import { average, seededRandom } from "../../math";

const SIZE = 129;
const AMPLITUDE_BY_LEVEL = [0.08, 0.15, 0.9, 1, 0.6, 0.18, 0.06];
const NEIGHBOUR_OFFSETS = (half: number) => [[-half, 0], [half, 0], [0, -half], [0, half]];

function diamondSquare() {
  const heights = new Float32Array(SIZE * SIZE);
  const at = (x: number, y: number) => heights[y * SIZE + x];
  const set = (x: number, y: number, value: number) => { heights[y * SIZE + x] = value; };
  const inside = (x: number, y: number) => x >= 0 && x < SIZE && y >= 0 && y < SIZE;
  let seed = 1;
  const jitter = () => seededRandom(seed++ * 0.731 + 0.17) - 0.5;

  const setCorners = () => {
    for (const i of [0, SIZE - 1, SIZE * (SIZE - 1), SIZE * SIZE - 1]) heights[i] = jitter() * AMPLITUDE_BY_LEVEL[0];
  };

  const diamondStep = (step: number, amplitude: number) => {
    const half = step / 2;
    for (let y = half; y < SIZE; y += step)
      for (let x = half; x < SIZE; x += step) {
        const corners = [at(x - half, y - half), at(x + half, y - half), at(x - half, y + half), at(x + half, y + half)];
        set(x, y, average(corners) + jitter() * amplitude);
      }
  };

  const squareStep = (step: number, amplitude: number) => {
    const half = step / 2;
    for (let y = 0; y < SIZE; y += half)
      for (let x = (y / half) % 2 ? 0 : half; x < SIZE; x += step) {
        const neighbours = NEIGHBOUR_OFFSETS(half).filter(([dx, dy]) => inside(x + dx, y + dy)).map(([dx, dy]) => at(x + dx, y + dy));
        set(x, y, average(neighbours) + jitter() * amplitude);
      }
  };

  setCorners();
  for (let step = SIZE - 1, level = 0; step > 1; step /= 2, level++) {
    diamondStep(step, AMPLITUDE_BY_LEVEL[level]);
    squareStep(step, AMPLITUDE_BY_LEVEL[level]);
  }
  return heights;
}

const HEIGHTS = diamondSquare();
const generatedHeight = (i: number, j: number) => HEIGHTS[j * SIZE + i];

export const fractal = (x: number, z: number) => {
  const u = ((x + 4) / 8) * (SIZE - 1), v = 43 + ((z + 1.3) / 2.6) * 41.6;
  const i = Math.min(SIZE - 2, Math.floor(u)), j = Math.min(SIZE - 2, Math.floor(v)), fu = u - i, fv = v - j;
  return generatedHeight(i, j) * (1 - fu) * (1 - fv) + generatedHeight(i + 1, j) * fu * (1 - fv) + generatedHeight(i, j + 1) * (1 - fu) * fv + generatedHeight(i + 1, j + 1) * fu * fv;
};
