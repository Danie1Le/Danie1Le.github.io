export interface Job {
  title: string;
  company: string;
  period: string;
  location: string;
  description: string;
  details: string[];
  skills: string[];
  current: boolean;
  previewImage?: string; // a poster, opened from the eye button beside the title
}

export const jobs: Job[] = [
  {
    title: "Software Engineer Intern",
    company: "Framatome",
    period: "June 2026 - Present",
    location: "Lynchburg, VA",
    description: "AI & Automations Team",
    details: [
      "Flagged page-number errors in engineering documents before submission with 95% accuracy by leading development of a Python precheck that validates PDFs against compliance standards using Docling",
      "Recovered page numbers from scanned and misoriented documents by building a rotation-aware OCR fallback using RapidOCR when sparse Docling output could not be validated reliably",
      "Detected unmarked blank pages with 99% accuracy by validating content and required notation using OCR signals",
      "Validated AI check output before deployment with a 300-document JSON regression suite and pytest unit tests",
      "Reduced deployment setup time by 55% via automated Docker releases to UAT and production using Azure DevOps",
      "Resolved UAT edge cases in page numbering and blank-page handling by partnering with stakeholders for feedback",
      "Cut time to locate active checks by 60% through a review UI that surfaces them first using Vue.js/TypeScript",
      "Eliminated redirect errors for signed-in users by fixing authentication defects in a C# document-upload API"
    ],
    skills: ["Python", "Docling", "RapidOCR", "pytest", "Docker", "Azure DevOps", "Vue.js", "TypeScript", "C#"],
    current: true,
  },
  {
    title: "Undergraduate Machine Learning Researcher",
    company: "University of Portland",
    period: "Sept 2026 - Present",
    location: "Portland, OR",
    description: "EEG Brain-Computer Interface",
    details: [
      "Achieved 94% accuracy on 2 held-out subjects classifying audio vs. visual attention for the team's brain-controlled RC car by training a Conv1D network on 8-channel EEG data using Keras",
      "Exposed random-split leakage inflating accuracy from 73% to 100% with leave-one-sitting-out validation in NumPy",
      "Improved leave-one-sitting-out accuracy from 81% to 85% by fixing a feature-scaling flaw via ablation studies",
      "Lowered replayed steering flicker by 52% with a real-time averaging predictor in Python, backed by 57 unit tests"
    ],
    skills: ["Python", "Keras", "NumPy", "Deep Learning", "EEG"],
    current: true,
  },
  {
    title: "Computer Science Grader",
    company: "University of Portland",
    period: "Sept 2025 - Dec 2025",
    location: "Portland, OR",
    description: "Graded assignments in Data Structures course",
    details: [
      "Maintained 100% on-time grading delivery by evaluating 25-30 weekly data structures assignments",
      "Improved programming skills for 25 students by providing targeted code review and debugging support"

    ],
    skills: ["Data Structures", "Code Review", "Debugging", "C"],
    current: false,
  },
  {
    title: "Software Engineer Intern",
    company: "ResVR",
    period: "May 2025 - Aug 2025",
    location: "Canada (Remote)",
    description: "Conversational AI & Avatar Systems",
    details: [
      "Decreased AI avatar render time by 62% through shorter Gemma 3 scripts and lower popup video resolution",
      "Automated script-to-video conversion by connecting a dual-model backend pipeline to the frontend",
      "Increased video completion rate to 95% through HeyGen rate-limit handling, request throttling, and retries",
      "Masked user-perceived render latency by looping an idle avatar during async HeyGen video generation"
    ],
    skills: ["AI", "LLM", "Gemma 3", "Python", "HeyGen", "API Integration", "Backend Development"],
    current: false,
  },
  {
    title: "Undergraduate Machine Learning Researcher",
    company: "University of Portland",
    period: "Jan 2024 - May 2025",
    location: "Portland, OR",
    description: "Cognitive AI & Agent Simulation",
    details: [
      "Optimized AI agent fitness scores by 30% using a genetic algorithm that evolves perceptron-based decision models in C#/.NET to replicate behavioral patterns of living organisms",
      "Expanded agent testing to 4 new terrains using recursive diamond-square and polar-coordinate generators",
      "Raised reward discovery by 12% through a fitness redesign using sliding-window momentum and proximity bonuses",
      "Trimmed analysis time by 40% with a live Python dashboard classifying agents as climbers, descenders, or collectors"
    ],
    skills: ["C#", ".NET", "Python", "Machine Learning", "Genetic Algorithms"],
    current: false,
    previewImage: "/ML_Research.png",
  },
];
