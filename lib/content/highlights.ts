export type Art = "pages" | "signal" | "render" | "fitness";

type Percent = number;

export interface Metric { value: Percent; unit: string; label: string }
export interface Highlight { where: string; art: Art; metrics: Metric[] }

export const highlights: Highlight[] = [
  {
    where: "Framatome", art: "pages",
    metrics: [
      { value: 95, unit: "%", label: "accuracy flagging compliance errors in engineering documents, including scanned and rotated pages" },
      { value: 86, unit: "%", label: "pytest coverage on check logic, measured against a 300-document regression suite" },
      { value: 55, unit: "%", label: "less deployment setup time with automated Docker releases" },
      { value: 60, unit: "%", label: "less time to find active checks in the review UI" },
    ],
  },
  {
    where: "EEG research", art: "signal",
    metrics: [
      { value: 85, unit: "%", label: "accuracy on unseen sessions telling whether a driver is focusing on sound or sight" },
      { value: 64, unit: "%", label: "less steering jitter from a real-time averaging predictor" },
      { value: 100, unit: "%", label: "pytest coverage on the real-time predictor" },
    ],
  },
  {
    where: "ResVR", art: "render",
    metrics: [
      { value: 62, unit: "%", label: "less time to render AI avatar videos" },
      { value: 95, unit: "%", label: "video completion rate with rate-limit handling and retries" },
    ],
  },
  {
    where: "Cognitive ABM", art: "fitness",
    metrics: [
      { value: 30, unit: "%", label: "higher agent fitness from evolved perceptron models" },
      { value: 12, unit: "%", label: "more reward discovery from a redesigned fitness function" },
      { value: 40, unit: "%", label: "less analysis time with a live Python dashboard" },
    ],
  },
];
