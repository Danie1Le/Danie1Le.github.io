export interface Project {
  title: string;
  description: string;
  images: string[]; // shown side by side in the thumbnail
  alt?: string; // default: "Screenshot of {title}"
  focus?: string; // CSS object-position of the crop; default "top"
  tech: string[];
  github?: string;
  live?: string; // a demo site, or an .mp4 to watch
}

export const projects: Project[] = [
  {
    title: "Dr. Mole",
    description: "AI-powered mobile app for detecting skin cancer over time. Placed 3rd in Health & Wellness track and 6th overall at HackUP.",
    images: ["/Dr_Mole.png"],
    focus: "50% 28%",
    tech: ["React Native", "FastAPI", "Python", "PyTorch", "Groq", "Hugging Face"],
    github: "https://github.com/chengenli9/HackUP/tree/main",
    live: "https://devpost.com/software/mr-mole#updates",
  },
  {
    title: "Job Application Tracker",
    description: "Web application to track job applications faster and stay organized.",
    images: ["/Job Application Tracker.png"],
    tech: ["React", "TypeScript", "PostgreSQL", "Google Auth"],
    live: "https://job-application-tracker-delta-eight.vercel.app/dashboard",
  },
  {
    title: "DinnaSwipe",
    description: "Group restaurant recommendation app with a location-based search with 500+ restaurants and player voting system.",
    images: ["/DinnaSwipe.png"],
    tech: ["React Native", "TypeScript", "PostgreSQL", "Overpass API"],
    github: "https://github.com/Matttran7/Food-Finder",
  },
  {
    title: "NBA Game Predictor",
    description: "Machine-learning application that analyzes more than 1,000 NBA games to predict game outcomes.",
    images: ["/NBA_predict.png"],
    tech: ["Python", "XGBoost", "PyTorch", "TensorFlow", "React", "Docker"],
    github: "https://github.com/Danie1Le/NBA-Predict",
    live: "https://nba-predict.vercel.app/",
  },
  {
    title: "AI ChatBot",
    description: "Medical training chatbot that helps nursing students practice diagnostic skills using retrieval-augmented generation.",
    images: ["/Ai chatBot.png"],
    tech: ["Flask", "JavaScript", "HTML", "CSS", "LangChain", "GitHub Actions", "Jest"],
  },
  {
    title: "Expense Tracker",
    description: "Web app to manage and visualize expenses, with real-time sync and interactive charts.",
    images: ["/Expense budget.png"],
    tech: ["JavaScript", "HTML", "CSS", "Firebase"],
    live: "https://danie1le.github.io/Expense-Budget/",
  },
  {
    title: "Type Racer",
    description: "Typing speed game with real-time feedback and customizable word lists.",
    images: ["/Type Racer.png"],
    tech: ["JavaScript", "HTML", "CSS"],
    live: "https://danie1le.github.io/Type-Racer/",
  },
  {
    title: "Up the River Down the River",
    description: "Android card game with dynamic scorekeeping and team collaboration.",
    images: ["/UptheRiverDowntheRiver.png"],
    tech: ["Java", "Android Studio"],
    github: "https://github.com/divPak9876/UpDownRiver",
  },
  {
    title: "Wind Turbine Project",
    description: "Arduino-powered wind turbine model with LED indicators for wind speed.",
    images: ["/turbine1.jpg", "/turbine2.jpg"],
    alt: "Arduino wind turbine model",
    focus: "center",
    tech: ["C++", "Arduino"],
    live: "/Media1.mp4",
  },
];
