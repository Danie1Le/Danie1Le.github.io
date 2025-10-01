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
    title: "Computer Science Grader",
    company: "University of Portland",
    period: "Sept 2025 - Present",
    location: "Portland, OR",
    description: "Grading and mentoring students in data structures course.",
    details: [
      "Maintained 100% on-time grading delivery by evaluating 25-30 weekly data structures assignments",
      "Mentored 25 students through code review feedback and debugging sessions, improving programming skills"
    ],
    skills: ["Data Structures", "Mentoring", "Code Review", "Debugging"],
    side: "right",
    current: true,
  },
  {
    title: "Software Developer Intern",
    company: "ResVR",
    period: "May 2025 - Aug 2025",
    location: "Remote",
    description: "Enhanced 3D avatar rendering and video conversion systems with seamless API integration.",
    details: [
      "Improved 3D avatar rendering system by 62% through seamless API integration, enhancing user engagement by allowing natural conversations with AI avatars",
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
    company: "CognitiveABM",
    period: "Jan 2024 - May 2025",
    location: "Portland, OR",
    description: "Optimized AI agent behavioral patterns and developed analytics systems for organism simulation.",
    details: [
      "Optimized AI agent behavioral fitness scores by 30% using advanced algorithms in C#/.NET to replicate behavioral patterns of living organisms",
      "Identified 3 behavioral patterns, boosting stability across 4 newly built environments with 100+ generations",
      "Accelerated analysis workflows by 40% by creating a Python-based classification system with real-time analytics",
      "Designed a metrics framework elevating reward discovery by 12% while reducing computational overhead"
    ],
    skills: ["C#", ".NET", "Python", "Machine Learning", "Real-time Analytics", "Algorithm Optimization"],
    side: "right",
    current: false,
  },
];

export const projects: Project[] = [
  {
    title: "DinnaSwipe",
    description: "Group restaurant recommendation app using agile methodologies with React Native and TypeScript, serving 500+ restaurants with location-based search and voting system.",
    image: getImagePath("/DinnaSwipe.png"),
    tech: ["React Native", "TypeScript", "Supabase", "PostgreSQL", "Overpass API"],
    github: "https://github.com/Matttran7/Food-Finder",
    live: "",
  },
  {
    title: "NBA Game Predictor",
    description: "Machine learning prediction model using XGBoost and PyTorch achieving 79% accuracy and 0.84 AUC. Full-stack application with Docker deployment and automated CI/CD pipeline.",
    image: getImagePath("/NBA_predict.png"),
    tech: ["Python", "XGBoost", "PyTorch", "TensorFlow", "React", "Docker"],
    github: "https://github.com/Danie1Le/NBA-Predict",
    live: "https://nba-predict.vercel.app//",
  },
  {
    title: "AI ChatBot",
    description: "Medical training chatbot using Flask and JavaScript to help nurses practice diagnostic skills. Enhanced contextual accuracy by 85% through retrieval augmented generation (RAG).",
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
    "React", "Flask", "LangChain", "Pandas", "PyTorch", "TensorFlow", "scikit-learn", "XGBoost", 
    "React Native", "Next.js", "Tailwind CSS", ".NET", "Supabase", "PostgreSQL"
  ],
  developmentTools: [
    "Git", "Linux", "VS Code", "GitHub Actions", "Docker", "Render", "Vercel", "Jest", "CI/CD"
  ],
  interests: [
    "Artificial Intelligence", "Machine Learning", "Web Development", "Software Engineering"
  ]
};
