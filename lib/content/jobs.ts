export interface Job {
  title: string;
  company: string;
  period: string;
  location: string;
  description: string;
  details: string[];
  skills: string[];
  current: boolean;
  poster?: string;
}

export const jobs: Job[] = [
  {
    title: "Software Engineer Intern",
    company: "Framatome",
    period: "June 2026 - Present",
    location: "Lynchburg, VA",
    description: "AI & Automations Team",
    details: [
      "Flagged compliance errors in engineering documents, such as page numbering, with 95%+ accuracy across all checks, including scanned and rotated pages, by designing and building a Docling-based Python precheck with RapidOCR",
      "Measured check accuracy by building a 300-document JSON regression suite, with 86% pytest coverage on check logic",
      "Reduced deployment setup time by 55% via automated Docker releases to UAT and production in Azure DevOps",
      "Cut time to locate active checks by 60% through a review UI that surfaces them first using Vue/TypeScript",
      "Resolved UAT edge cases in page-number and blank-page checks by working directly with customers and engineers",
      "Eliminated redirect errors for signed-in users by fixing authentication defects in a C#/.NET document-upload API"
    ],
    skills: ["Python", "Docling", "RapidOCR", "pytest", "Docker", "Azure DevOps", "Vue.js", "TypeScript", "C#", ".NET"],
    current: true,
    poster: "/Intern_Project.png",
  },
  {
    title: "Undergraduate Machine Learning Researcher",
    company: "University of Portland",
    period: "Sept 2026 - Present",
    location: "Portland, OR",
    description: "EEG Brain-Computer Interface",
    details: [
      "Achieved 85% accuracy on unseen recording sessions detecting whether a driver is focusing on sound or sight to steer the team's brain-controlled RC car by training a Keras CNN on 8-channel OpenBCI EEG signals",
      "Exposed data leakage behind a reported 98.5% accuracy by re-scoring it with leave-one-sitting-out cross-validation",
      "Fixed an input-scaling bug that dropped a held-out sitting to chance by comparing per-electrode and shared scaling",
      "Lowered steering jitter 64% on unseen sessions via a real-time averaging Python predictor at 100% pytest coverage"
    ],
    skills: ["Python", "Keras", "NumPy", "Deep Learning", "EEG", "pytest"],
    current: true,
    poster: "/ML_EEG_Research.png",
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
    poster: "/ML_Research.png",
  },
];
