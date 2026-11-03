import assert from "node:assert/strict";
import { test } from "node:test";
import { joinAnd } from "./text.ts";
import { sharedTools } from "./tools.ts";
import { highlights } from "./content/highlights.ts";
import { projects } from "./content/projects.ts";

test("joinAnd reads like a sentence", () => {
  assert.equal(joinAnd(["a"]), "a");
  assert.equal(joinAnd(["a", "b"]), "a and b");
  assert.equal(joinAnd(["a", "b", "c"]), "a, b and c");
});

test("sharedTools counts, drops one-offs and lists them A to Z", () => {
  const list = [{ tech: ["Z", "B", "C"] }, { tech: ["Z", "B"] }, { tech: ["Z"] }];
  assert.deepEqual(sharedTools(list), [["B", 2], ["Z", 3]]);
});

test("the real projects give filters that each match more than one project", () => {
  for (const [tool, n] of sharedTools(projects)) assert.equal(projects.filter((p) => p.tech.includes(tool)).length, n);
});

test("content: every project has a picture, every figure is a percentage", () => {
  for (const p of projects) assert.ok(p.images.length > 0, p.title);
  for (const h of highlights) for (const m of h.metrics) assert.ok(m.value >= 0 && m.value <= 100, `${h.where}: ${m.label}`);
});
