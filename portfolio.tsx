"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, Github, Linkedin, Mail, MapPin } from "lucide-react"
import { useEffect, useState } from "react"

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("hero")
  const [expandedJob, setExpandedJob] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "experience", "projects", "contact"]
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offset = 80 // Account for fixed navigation
      const elementPosition = element.offsetTop - offset
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth"
      })
    }
  }

  const handleCardClick = (index: number) => {
    if (expandedJob === index) {
      // Hide the card
      setExpandedJob(null);
    } else {
      // Show the card
      setExpandedJob(index);
      
      // Scroll to the expanded card after a short delay to allow animation to start
      setTimeout(() => {
        const cardElement = document.querySelector(`[data-job-index="${index}"]`);
        if (cardElement) {
          cardElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      }, 100);
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-gray-950/80 backdrop-blur-sm border-b border-gray-800 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Daniel Le</h1>
            <div className="hidden md:flex space-x-6">
              {[
                { id: "hero", label: "Home" },
                { id: "experience", label: "Experience" },
                { id: "projects", label: "Projects" },
                { id: "contact", label: "Contact" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`transition-colors hover:text-white ${
                    activeSection === item.id ? "text-white" : "text-gray-400"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex items-center justify-center px-6">
        <div className="container mx-auto text-center">
          <div className="mb-8">
            <div className="w-32 h-32 rounded-full mx-auto mb-6 overflow-hidden border-4 border-purple-500 mt-5">
              <img
                src="/IMG_6878.PNG"
                alt="Daniel Le"
                className="w-full h-full object-cover object-top"
                style={{ objectPosition: 'center 30%' }}
              />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Daniel Le
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-2">Computer Science Student</p>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
            </p>
            <div className="flex justify-center space-x-4 mb-12">
              <a href="https://github.com/Danie1Le" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg" className="bg-transparent border-gray-600 hover:bg-gray-800">
                  <Github className="w-5 h-5 mr-2" />
                  GitHub
                </Button>
              </a>
              <a href="https://www.linkedin.com/in/danie1-le/" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg" className="bg-transparent border-gray-600 hover:bg-gray-800">
                  <Linkedin className="w-5 h-5 mr-2" />
                  LinkedIn
                </Button>
              </a>
              <a href="mailto:danielle8262005@gmail.com">
                <Button size="lg" className="bg-white text-gray-950 hover:bg-gray-200">
                  <Mail className="w-5 h-5 mr-2" />
                  Get In Touch
                </Button>
              </a>
            </div>
          </div>
          <button
            onClick={() => scrollToSection("experience")}
            className="animate-bounce text-gray-400 hover:text-white transition-colors"
          >
            <ChevronDown className="w-8 h-8" />
          </button>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="min-h-screen py-20 px-6 flex items-center">
        <div className="container mx-auto w-full">
          <h2 className="text-4xl font-bold text-center mb-16">Career Roadmap</h2>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Vertical Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-purple-500 via-pink-500 to-purple-500 rounded-full"></div>

              <div className="space-y-12">
                {[
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
                    skills: ["AI", "LLM", "HeyGen",],
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
                ].map((job, index) => (
                  <div key={index} className="relative">
                    {/* Timeline Node */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-8">
                      <div
                        className={`w-6 h-6 rounded-full border-4 ${
                          job.current
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 border-white shadow-lg shadow-purple-500/50"
                            : "bg-gray-900 border-gray-600"
                        } z-10 relative`}
                      >
                        {job.current && (
                          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-ping opacity-75"></div>
                        )}
                      </div>
                    </div>

                    {/* Job Card */}
                    <div className={`flex ${job.side === "left" ? "justify-start" : "justify-end"}`}>
                      <div className={`w-full md:w-5/12 ${job.side === "left" ? "md:pr-8" : "md:pl-8"}`}>
                        <Card
                          className={`bg-gray-900 border-gray-800 relative cursor-pointer hover:border-gray-600 transition-all duration-300 ${
                            job.current ? "ring-2 ring-purple-500/50 shadow-lg shadow-purple-500/20" : ""
                          } ${expandedJob === index ? "scale-105 shadow-2xl" : ""}`}
                          onClick={() => handleCardClick(index)}
                          data-job-index={index}
                        >
                          {/* Arrow pointing to timeline */}
                          <div
                            className={`absolute top-8 ${
                              job.side === "left" ? "right-0 translate-x-1/2" : "left-0 -translate-x-1/2"
                            } w-0 h-0 border-t-8 border-b-8 border-transparent ${
                              job.side === "left" ? "border-l-8 border-l-gray-800" : "border-r-8 border-r-gray-800"
                            } hidden md:block`}
                          ></div>

                          <CardHeader>
                            <div className="flex flex-col">
                              <div className="flex items-center justify-between mb-2">
                                <Badge
                                  variant="outline"
                                  className={`${
                                    job.current
                                      ? "border-purple-500 text-purple-400 bg-purple-500/10"
                                      : "border-gray-600 text-gray-400"
                                  }`}
                                >
                                  {job.period}
                                </Badge>
                                {job.current && (
                                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                                    Current
                                  </Badge>
                                )}
                              </div>
                              <CardTitle className="text-xl text-white">{job.title}</CardTitle>
                              <CardDescription className="text-lg text-gray-300">{job.company}</CardDescription>
                              <div className="flex items-center text-gray-400 mt-1">
                                <MapPin className="w-4 h-4 mr-2" />
                                {job.location}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-300 mb-4">
                              {job.description}
                            </p>
                            <div className={`overflow-hidden transition-all duration-300 ${expandedJob === index ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                              <div className="space-y-4 pt-4 border-t border-gray-700">
                                <div>
                                  <h4 className="text-sm font-semibold text-white mb-2">Key Responsibilities</h4>
                                  <ul className="list-disc list-inside text-gray-400 space-y-1 text-sm">
                                    {job.details.map((point, i) => (
                                      <li key={i}>{point}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {job.skills.map((skill) => (
                                <Badge
                                  key={skill}
                                  variant="secondary"
                                  className="bg-gray-800 text-gray-300 hover:bg-gray-700"
                                >
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Starting Point */}
              <div className="relative mt-12">
                <div className="absolute left-1/2 transform -translate-x-1/2">
                  <div className="w-4 h-4 bg-gray-600 rounded-full border-2 border-gray-800"></div>
                </div>
                <div className="text-center pt-8">
                  <p className="text-gray-500 text-sm">The journey begins...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="min-h-screen py-20 px-6 bg-gray-900 flex items-center">
        <div className="container mx-auto w-full">
          <h2 className="text-4xl font-bold text-center mb-16">Projects</h2>
          <ProjectCarousel />
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Let's Work Together</h2>
          <p className="text-xl text-gray-400 max-w-2x2 mx-auto mb-12">
            feel free to reach out! I'm always interested in new opportunities and exciting projects.
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="pt-6 text-center">
                <Mail className="w-8 h-8 mx-auto mb-4 text-purple-400" />
                <h3 className="font-semibold text-white mb-2">Email</h3>
                <a href="mailto:danielle8262005@gmail.com" className="text-purple-400 hover:underline break-all">danielle8262005@gmail.com</a>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="pt-6 text-center">
                <Linkedin className="w-8 h-8 mx-auto mb-4 text-purple-400" />
                <h3 className="font-semibold text-white mb-2">LinkedIn</h3>
                <a href="https://www.linkedin.com/in/danie1-le/" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline break-all">linkedin.com/in/danie1-le</a>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="pt-6 text-center">
                <Github className="w-8 h-8 mx-auto mb-4 text-purple-400" />
                <h3 className="font-semibold text-white mb-2">GitHub</h3>
                <a href="https://github.com/Danie1Le" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline break-all">github.com/Danie1Le</a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}

function ProjectCarousel() {
  const [startIndex, setStartIndex] = useState(0)

  const projects = [
    {
      title: "AI ChatBot",
      description: "AI chatbot for nursing students to practice diagnostic skills, using real-time chat and LLM-powered responses.",
      image: "/Ai chatBot.png",
      tech: ["JavaScript", "HTML", "CSS", "LangChain", "DocArray", "Jest"],
      github: "",
      live: "",
    },
    {
      title: "Expense Tracker",
      description: "Web app to manage and visualize expenses, with real-time sync and interactive charts.",
      image: "/Expense budget.png",
      tech: ["JavaScript", "HTML", "CSS", "Firebase"],
      github: "https://github.com/Danie1Le/Expense-Budget",
      live: "",
    },
    {
      title: "Type Racer",
      description: "Typing speed game with real-time feedback and customizable word lists.",
      image: "/Type Racer.png",
      tech: ["JavaScript", "HTML", "CSS"],
      github: "",
      live: "https://danie1le.github.io/Type-Racer/",
    },
    {
      title: "Up the River Down the River",
      description: "Android card game with dynamic scorekeeping and team collaboration.",
      image: "/UptheRiverDowntheRiver.png",
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
      live: "/Media1.mp4",
    },
  ]

  const visibleProjects = projects.slice(startIndex, startIndex + 3)
  const canGoNext = startIndex + 3 < projects.length
  const canGoPrev = startIndex > 0

  return (
    <div className="relative max-w-6xl mx-auto">
      {/* Navigation */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 -translate-x-16">
        <button
          onClick={() => setStartIndex(Math.max(0, startIndex - 1))}
          disabled={!canGoPrev}
          className={`w-12 h-12 rounded-full border border-gray-800 bg-gray-950/80 flex items-center justify-center ${
            canGoPrev ? "text-gray-400 hover:text-white" : "text-gray-700 opacity-50"
          }`}
        >
          <ChevronDown className="w-5 h-5 rotate-90" />
        </button>
      </div>

      <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 translate-x-16">
        <button
          onClick={() => setStartIndex(Math.min(projects.length - 3, startIndex + 1))}
          disabled={!canGoNext}
          className={`w-12 h-12 rounded-full border border-gray-800 bg-gray-950/80 flex items-center justify-center ${
            canGoNext ? "text-gray-400 hover:text-white" : "text-gray-700 opacity-50"
          }`}
        >
          <ChevronDown className="w-5 h-5 -rotate-90" />
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {visibleProjects.map((project, index) => {
          const link = project.live || project.github || null;
          const cardContent = (
            <>
              <div className="aspect-video bg-gray-800 relative overflow-hidden">
                {project.image === "turbine" ? (
                  <div className="w-full h-full flex">
                    <img
                      src="/turbine1.jpg"
                      alt="Turbine 1"
                      className="w-1/2 h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <img
                      src="/turbine2.jpg"
                      alt="Turbine 2"
                      className="w-1/2 h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <img
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg">{project.title}</CardTitle>
                <CardDescription className="text-gray-400 text-sm line-clamp-3">{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-1">
                  {project.tech.map((tech) => (
                    <Badge key={tech} variant="outline" className="border-gray-600 text-gray-300 text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </>
          );

          if (link) {
            return (
              <a
                key={index}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <Card className="bg-gray-950 border-gray-800 overflow-hidden hover:border-gray-600 transition-colors cursor-pointer h-[420px]">
                  {cardContent}
                </Card>
              </a>
            );
          } else {
            return (
              <Card
                key={index}
                className="bg-gray-950 border-gray-800 overflow-hidden group hover:border-gray-600 transition-colors h-[420px]"
              >
                {cardContent}
              </Card>
            );
          }
        })}
      </div>

      {/* Progress Dots */}
      <div className="flex justify-center mt-8">
        <div className="flex space-x-2">
          {Array.from({ length: Math.ceil(projects.length / 3) }).map((_, i) => (
            <div key={i} className={`h-1 rounded-full transition-all ${Math.floor(startIndex / 3) === i ? "bg-white w-8" : "bg-gray-700 w-2"}`} />
          ))}
        </div>
      </div>
    </div>
  )
}
