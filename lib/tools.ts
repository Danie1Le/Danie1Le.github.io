/**
 * Every tool used by more than one project, with how many projects use each, listed A to Z: the project filters.
 * A to Z keeps related tools (React, React Native) together. A tool used by only one project is left out
 * (filtering to a single row is no help).
 */
export function sharedTools(projects: { tech: string[] }[]): [tool: string, count: number][] {
  const counts = new Map<string, number>();
  projects.forEach((p) => p.tech.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)));
  return Array.from(counts).filter(([, n]) => n > 1).sort(([a], [b]) => a.localeCompare(b));
}
