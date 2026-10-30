import assert from "node:assert/strict";
import { test } from "node:test";
import { joinAnd } from "./text.ts";
import { topTools } from "./tools.ts";
import { highlights } from "./content/highlights.ts";
import { projects } from "./content/projects.ts";

test("joinAnd reads like a sentence", () => {
  assert.equal(joinAnd(["a"]), "a");
  assert.equal(joinAnd(["a", "b"]), "a and b");
  assert.equal(joinAnd(["a", "b", "c"]), "a, b and c");
});

test("topTools counts, drops one-offs, sorts and limits", () => {
  const list = [{ tech: ["A", "B", "C"] }, { tech: ["A", "B"] }, { tech: ["A"] }];
  assert.deepEqual(topTools(list), [["A", 3], ["B", 2]]);
  assert.deepEqual(topTools(list, 1), [["A", 3]]);
});

test("the real projects give filters that each match more than one project", () => {
  for (const [tool, n] of topTools(projects)) assert.equal(projects.filter((p) => p.tech.includes(tool)).length, n);
});

test("content: every project has a picture, every figure is a percentage", () => {
  for (const p of projects) assert.ok(p.images.length > 0, p.title);
  for (const h of highlights) for (const m of h.metrics) assert.ok(m.value >= 0 && m.value <= 100, `${h.where}: ${m.label}`);
});
