export interface Project {
  title: string;
  description: string;
  images: string[];
  alt?: string;
  objectPosition?: string;
  tech: string[];
  github?: string;
  live?: string;
}

export const isVideo = (url: string) => url.endsWith(".mp4");

export const projects: Project[] = [
  {
    title: "Rocket Telemetry Monitor",
    description: "Streaming pipeline that ingests 1,500 simulated rocket readings per second and autoscales its workers on Kubernetes.",
    images: ["/Telemetry_Monitor.png"],
    alt: "Chart of queue depth and worker replicas during a 10-minute load test",
    tech: ["Java", "Spring Boot", "Python", "AWS", "Kubernetes", "Terraform"],
    github: "https://github.com/Danie1Le/Telemetry-Monitor",
  },
  {
    title: "Dr. Mole",
    description: "AI-powered mobile app for detecting skin cancer over time. Placed 3rd in Health & Wellness track and 6th overall at HackUP.",
    images: ["/Dr_Mole.png"],
    objectPosition: "50% 28%",
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
    tech: ["Flask", "HTML/CSS/JS", "LangChain", "GitHub Actions", "Jest"],
  },
  {
    title: "Expense Tracker",
    description: "Web app to manage and visualize expenses, with real-time sync and interactive charts.",
    images: ["/Expense budget.png"],
    tech: ["HTML/CSS/JS", "Firebase"],
    live: "https://danie1le.github.io/Expense-Budget/",
  },
  {
    title: "Type Racer",
    description: "Typing speed game with real-time feedback and customizable word lists.",
    images: ["/Type Racer.png"],
    tech: ["HTML/CSS/JS"],
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
    objectPosition: "center",
    tech: ["C++", "Arduino"],
    live: "/Media1.mp4",
  },
];
