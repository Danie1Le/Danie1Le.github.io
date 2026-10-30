// Shapes are described in model units: y up, z away from the viewer, about ±1 tall.

/** The moving parts of the EEG scene. */
export type Part = "brain" | "wave" | "arrow" | "car" | "wheel" | "tip";

/** Where one pixel rests, and how it is drawn. */
export type Pt = {
  x: number; y: number; z: number;
  red?: boolean; // drawn in the accent red, a little larger
  spin?: boolean; // turns with the camera's yaw (flat overlays don't)
  flag?: boolean; // shape-specific mark (Framatome: a page with a numbering error)
  a?: number; // brightness; above 1 is a contour, drawn a little larger
  n?: number[]; // outward surface direction, so the pixel is lit live as the shape turns
  g?: Part; // part name, for shapes that move their parts separately
  w?: number; // index within that part (a wheel, a channel)
};

/** What an under/over hook gets to draw with, each frame. */
export type Draw = {
  ctx: CanvasRenderingContext2D; W: number; H: number; t: number;
  settle: number; // 0 → 1 once the pixels have formed the shape; overlays fade in with it
  sx: Float32Array; sy: Float32Array; // where each pixel landed on screen this frame
  project: (x: number, y: number, z: number) => number[]; // model → [screen x, screen y, perspective, depth]
  ink: string; red: string; size: number;
};

/** One role's picture: its N pixels, how the camera moves, and anything drawn around them. */
export type Shape = {
  points: Pt[];
  yaw: (t: number) => number; // turn about the vertical axis; t = ms since the role began
  tilt: number | ((t: number) => number); // look-down angle
  span: number; // half-width in model units, so narrow screens can shrink the shape to fit
  half?: number; // half-height in model units (default 1), so tall shapes keep a margin
  glow?: number; // hologram bloom, 0-1
  hill?: boolean; // `a` is hillshade light, so a light ground shows it as printed shadow
  live?: (p: Pt, i: number, t: number) => Pt; // per-frame movement
  under?: (d: Draw) => void; // drawn behind the pixels
  over?: (d: Draw) => void; // drawn on top of them
};
