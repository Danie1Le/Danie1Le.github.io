const DECISION_MS = 1400;

export type Decision = { count: number; progress: number };

export const decisionAt = (t: number): Decision => ({ count: Math.floor(t / DECISION_MS), progress: (t % DECISION_MS) / DECISION_MS });
