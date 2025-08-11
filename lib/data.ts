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
    title: "Software Developer Intern",
    company: "ResVR",
    period: "May 2025 - Aug 2025",
    location: "Remote",
    description: "Built an AI-powered virtual tour system using LLMs and real-time video streaming.",
    details: [
      "Developed an AI-powered virtual tour system converting natural language to real-time video responses using AI avatars and Gemma3 LLM.",
      "Developed backend model to interpret user commands and a frontend model to generate natural language responses used as video scripts.",
      "Integrated 3D avatar video generation using HeyGen to deliver dynamic, lifelike responses based on LLM output.",
      "Implemented real-time video streaming with asynchronous generation, status polling, and dynamic video switching for seamless user experience.",
      "Created a responsive web interface with speech recognition, optimized video processing (rate limiting, error handling), and an interactive demo page to showcase the system to teammates."
    ],
    skills: ["AI", "LLM", "HeyGen","Python"],
    side: "right",
    current: true,
  },
  {
    title: "Machine Learning Researcher",
    company: "CognitiveABM",
    period: "Jan 2024 - May 2025",
    location: "Portland, Oregon",
    description: "Helped develop AI agents to simulate animal behavior using .NET and C#.",
    details: [
      "Helped develop an AI project using .NET and C#, with the goal to create AI agents that emulate behavioral patterns of animals to replicate brain functions of real life organisms.",
      "Created varied simulated landscapes to evaluate agent behavior across multiple dynamic and challenging environments.",
      "Built multiple different landscapes to dynamically deploy different environments on agents to assess performance in varying simulated environments.",
      "Developed a real-time system to classify agents by elevation behavior as Climbers, Descenders, or Collectors.",
      "Contributed to weekly scrum meetings to develop new ideas for bug fixes and optimizations.",
      "Presented project goals, technical development, and research findings on Founder's Day."
    ],
    skills: [".NET", "C#", "AI", "Simulation", "Agile"],
    side: "left",
    current: false,
  },
];

export const projects: Project[] = [
  {
    title: "NBA Prediction Model",
    description: "AI-powered NBA game predictor using XGBoost and team statistics, achieving 80%+ accuracy with interactive web interface.",
    image: getImagePath("/NBA_predict.png"),
    tech: ["Python", "XGBoost", "Scikit-learn", "Streamlit", "Plotly", "Pandas", "NumPy"],
    github: "https://github.com/Danie1Le/NBA-Predict",
    live: "https://nba-predict.streamlit.app/",
  },
  {
    title: "AI ChatBot",
    description: "AI chatbot for nursing students to practice diagnostic skills, using real-time chat and LLM-powered responses.",
    image: getImagePath("/Ai chatBot.png"),
    tech: ["JavaScript", "HTML", "CSS", "LangChain", "DocArray", "Jest"],
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
    "Python", "JavaScript", "Java", "C#", "C", "HTML/CSS"
  ],
  technologies: [
    "React", "Next.js", "Tailwind CSS", ".NET", "FastAPI", 
    "LangChain", "Ollama", "Jest", "Java Swing"
  ],
  developmentTools: [
    "Visual Studio", "VS Code", "Android Studio", "Git", "Arduino", "Unix/Linux"
  ],
  interests: [
    "Artificial Intelligence", "Machine Learning", "Web Development", "Software Engineering"
  ]
};
