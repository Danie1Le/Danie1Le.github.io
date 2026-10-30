import { getImagePath } from "./utils";

export interface Job {
  title: string;
  company: string;
  period: string;
  location: string;
  description: string;
  details: string[];
  skills: string[];
  side: "left" | "right";
  current: boolean;
  previewImage?: string;
}

export interface Project {
  title: string;
  description: string;
  image: string;
  tech: string[];
  github: string;
  live: string;
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
    side: "left",
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
    side: "right",
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
    side: "left",
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
    side: "right",
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
    side: "left",
    current: false,
    previewImage: getImagePath("/ML_Research.png"),
  },
];

export const projects: Project[] = [
  {
    title: "Dr. Mole",
    description: "AI-powered mobile app for detecting skin cancer over time. Placed 3rd in Health & Wellness track and 6th overall at HackUP.",
    image: getImagePath("/Dr_Mole.png"),
    tech: ["React Native", "FastAPI", "Python", "PyTorch", "Groq", "Hugging Face"],
    github: "https://github.com/chengenli9/HackUP/tree/main",
    live: "https://devpost.com/software/mr-mole#updates",
  },
  {
    title: "Job Application Tracker",
    description: "Web application to track job applications faster and stay organized.",
    image: getImagePath("/Job Application Tracker.png"),
    tech: ["React", "TypeScript", "PostgreSQL", "Google Auth"],
    github: "",
    live: "https://job-application-tracker-delta-eight.vercel.app/dashboard",
  },
  {
    title: "DinnaSwipe",
    description: "Group restaurant recommendation app with a location-based search with 500+ restaurants and player voting system.",
    image: getImagePath("/DinnaSwipe.png"),
    tech: ["React Native", "TypeScript", "PostgreSQL", "Overpass API"],
    github: "https://github.com/Matttran7/Food-Finder",
    live: "",
  },
  {
    title: "NBA Game Predictor",
    description: "Machine-learning application that analyzes more than 1,000 NBA games to predict game outcomes.",
    image: getImagePath("/NBA_predict.png"),
    tech: ["Python", "XGBoost", "PyTorch", "TensorFlow", "React", "Docker"],
    github: "https://github.com/Danie1Le/NBA-Predict",
    live: "https://nba-predict.vercel.app/",
  },
  {
    title: "AI ChatBot",
    description: "Medical training chatbot that helps nursing students practice diagnostic skills using retrieval-augmented generation.",
    image: getImagePath("/Ai chatBot.png"),
    tech: ["Flask", "JavaScript", "HTML", "CSS", "LangChain", "GitHub Actions", "Jest"],
    github: "",
    live: "",
  },
  {
    title: "Expense Tracker",
    description: "Web app to manage and visualize expenses, with real-time sync and interactive charts.",
    image: getImagePath("/Expense budget.png"),
    tech: ["JavaScript", "HTML", "CSS", "Firebase"],
    github: "",
    live: "https://danie1le.github.io/Expense-Budget/",
  },
  {
    title: "Type Racer",
    description: "Typing speed game with real-time feedback and customizable word lists.",
    image: getImagePath("/Type Racer.png"),
    tech: ["JavaScript", "HTML", "CSS"],
    github: "",
    live: "https://danie1le.github.io/Type-Racer/",
  },
  {
    title: "Up the River Down the River",
    description: "Android card game with dynamic scorekeeping and team collaboration.",
    image: getImagePath("/UptheRiverDowntheRiver.png"),
    tech: ["Java", "Android Studio"],
    github: "https://github.com/divPak9876/UpDownRiver",
    live: "",
  },
  {
    title: "Wind Turbine Project",
    description: "Arduino-powered wind turbine model with LED indicators for wind speed.",
    image: "turbine",
    tech: ["C++", "Arduino"],
    github: "",
    live: getImagePath("/Media1.mp4"),
  },
];

export const skills = {
  programmingLanguages: [
    "Python", "Java", "C", "C#", "JavaScript", "TypeScript", "HTML/CSS", "SQL"
  ],
  technologies: [
    "React", "Node.js", "Next.js","Flask", "LangChain", "Pandas", "PyTorch", "TensorFlow", "scikit-learn", "XGBoost", 
    "React Native", "Tailwind CSS", ".NET", "PostgreSQL"
  ],
  developmentTools: [
    "Git", "Linux", "VS Code", "GitHub Actions", "Docker", "Render", "Vercel", "Jest", "CI/CD"
  ],
  interests: [
    "Software Engineering", "Artificial Intelligence", "Machine Learning", "Web Development"
  ]
};

export const contact = {
  email: "le.daniel412@gmail.com",
  gmail: "https://mail.google.com/mail/?view=cm&to=le.daniel412@gmail.com",
  linkedin: "https://www.linkedin.com/in/danie1-le/",
  github: "https://github.com/Danie1Le",
};

// "Numbers from the work": each role's metrics rotate over a drawing of that work (see highlightsSection).
export const highlights = [
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
