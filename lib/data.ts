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
    description: "AI and Automations Team",
    details: ["To be updated"],
    skills: [],
    side: "left",
    current: true,
  },
  {
    title: "Computer Science Grader",
    company: "University of Portland",
    period: "Sept 2025 - Dec 2025",
    location: "Portland, OR",
    description: "Graded assignments in data structures course",
    details: [
      "Maintained 100% on-time grading delivery by evaluating 25-30 weekly data structures assignments",
      "Improved programming skills for 25 students by providing targeted code review and debugging support"

    ],
    skills: ["Data Structures", "Code Review", "Debugging", "C"],
    side: "right",
    current: false,
  },
  {
    title: "Software Engineer Intern",
    company: "ResVR",
    period: "May 2025 - Aug 2025",
    location: "Canada (Remote)",
    description: "Conversational AI & Avatar Systems",
    details: [
      "Improved 3D avatar rendering system by 62% by integrating HeyGen API with Python and Gemma 3B LLM, enhancing user engagement by allowing natural conversations with AI avatars",
      "Achieved 100% script-to-video conversion through a dual-model backend pipeline and frontend integration",
      "Increased video completion rate to 95% by optimizing backend stability and error handling mechanisms",
      "Enhanced user experience through real-time status updates using WebSocket polling for video rendering progress"
    ],
    skills: ["AI", "LLM", "Python", "API Integration", "WebSocket", "3D Rendering", "Backend Development", "HeyGen"],
    side: "left",
    current: false,
  },
  {
    title: "Machine Learning Researcher",
    company: "University of Portland",
    period: "Jan 2024 - May 2025",
    location: "Portland, OR",
    description: "Cognitive AI & Agent Simulation",
    details: [
      "Optimized AI agent behavioral fitness scores by 30% using advanced algorithms in C#/.NET to replicate behavioral patterns of living organisms",
      "Identified 3 behavioral patterns, boosting stability across 4 newly built environments over 100+ generations",
      "Accelerated analysis workflows by 40% by creating a Python-based classification system with real-time analytics",
      "Designed a metrics framework elevating reward discovery by 12% while reducing computational overhead"
    ],
    skills: ["C#", ".NET", "Python", "Machine Learning", "Algorithm Optimization"],
    side: "right",
    current: false,
    previewImage: getImagePath("/ML_Research.png"),
  },
];

export const projects: Project[] = [
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
    description: "Machine learning model that analyzes over 1000 games to predicts NBA game results.",
    image: getImagePath("/NBA_predict.png"),
    tech: ["Python", "XGBoost", "PyTorch", "TensorFlow", "React", "Docker"],
    github: "https://github.com/Danie1Le/NBA-Predict",
    live: "https://nba-predict.vercel.app/",
  },
  {
    title: "AI ChatBot",
    description: "Medical training chatbot nurses practice their diagnostic skill through retrieval augmented generation (RAG).",
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
