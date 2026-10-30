// "Numbers from the work": each role's figures, shown over a pixel picture of that work (see components/pixel-art).

/** Which pixel picture a role is drawn as: Framatome's pages, the EEG signal, the ResVR render, the ABM fitness landscape. */
export type Art = "pages" | "signal" | "render" | "fitness";

export interface Metric { value: number; unit: string; label: string } // value is a percentage, 0-100
export interface Highlight { where: string; art: Art; metrics: Metric[] }

export const highlights: Highlight[] = [
  {
    where: "Framatome", art: "pages",
    metrics: [
      { value: 95, unit: "%", label: "of page-number errors caught before engineering documents are submitted" },
      { value: 99, unit: "%", label: "of unmarked blank pages detected from OCR signals" },
      { value: 55, unit: "%", label: "less deployment setup time with automated Docker releases" },
      { value: 60, unit: "%", label: "less time to find active checks in the review UI" },
    ],
  },
  {
    where: "EEG research", art: "signal",
    metrics: [
      { value: 94, unit: "%", label: "accuracy telling audio from visual attention in unseen subjects" },
      { value: 52, unit: "%", label: "less steering flicker from a real-time averaging predictor" },
      { value: 85, unit: "%", label: "leave-one-sitting-out accuracy, up from 81% after fixing feature scaling" },
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
