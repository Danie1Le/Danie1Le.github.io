import type { Art } from "@/lib/content";
import type { Shape } from "../types";
import { eeg } from "./eeg";
import { head } from "./head";
import { pages } from "./pages";
import { terrain } from "./terrain";

export const SHAPES: Record<Art, Shape> = { pages: pages(), signal: eeg(), render: head(), fitness: terrain() };
