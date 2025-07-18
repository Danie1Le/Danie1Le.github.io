"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, ExternalLink, Github, Linkedin, Mail, MapPin } from "lucide-react"
import { useEffect, useState } from "react"

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("hero")

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
      element.scrollIntoView({ behavior: "smooth" })
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
            <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl font-bold">
              DL
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Daniel Le
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-2">Computer Science Student</p>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
            </p>
            <div className="flex justify-center space-x-4 mb-12">
              <Button variant="outline" size="lg" className="bg-transparent border-gray-600 hover:bg-gray-800">
                <Github className="w-5 h-5 mr-2" />
                GitHub
              </Button>
              <Button variant="outline" size="lg" className="bg-transparent border-gray-600 hover:bg-gray-800">
                <Linkedin className="w-5 h-5 mr-2" />
                LinkedIn
              </Button>
              <Button size="lg" className="bg-white text-gray-950 hover:bg-gray-200">
                <Mail className="w-5 h-5 mr-2" />
                Get In Touch
              </Button>
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
      <section id="experience" className="py-20 px-6">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Career Roadmap</h2>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Vertical Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-purple-500 via-pink-500 to-purple-500 rounded-full"></div>

              <div className="space-y-12">
                {[
                  {
                    title: "",
                    company: "",
                    period: "",
                    location: "",
                    description:
                      "",
                    skills: [""],
                    side: "right",
                    current: true,
                  },
                  {
                    title: "",
                    company: "",
                    period: "",
                    location: "",
                    description:
                      "",
                    skills: [""],
                    side: "left",
                    current: false,
                  },
                  {
                    title: "",
                    company: "",
                    period: "",
                    location: "",
                    description:
                      "",
                    skills: [""],
                    side: "right",
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
                          className={`bg-gray-900 border-gray-800 relative ${
                            job.current ? "ring-2 ring-purple-500/50 shadow-lg shadow-purple-500/20" : ""
                          }`}
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
                            <p className="text-gray-300 mb-4">{job.description}</p>
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
      <section id="projects" className="py-20 px-6 bg-gray-900">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Featured Projects</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: "",
                description:
                  "",
                image: "",
                tech: [""],
                github: "",
                live: "",
              },
              {
                title: "",
                description:
                  "",
                image: "",
                tech: [""],
                github: "",
                live: "",
              },
              {
                title: "",
                description:
                  "",
                image: "",
                tech: [""],
                github: "",
                live: "",
              },
            ].map((project, index) => (
              <Card
                key={index}
                className="bg-gray-950 border-gray-800 overflow-hidden group hover:border-gray-600 transition-colors"
              >
                <div className="aspect-video bg-gray-800 relative overflow-hidden">
                  <img
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-white">{project.title}</CardTitle>
                  <CardDescription className="text-gray-400">{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map((tech) => (
                      <Badge key={tech} variant="outline" className="border-gray-600 text-gray-300">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex space-x-3">
                    <Button variant="outline" size="sm" className="bg-transparent border-gray-600 hover:bg-gray-800">
                      <Github className="w-4 h-4 mr-2" />
                      Code
                    </Button>
                    <Button variant="outline" size="sm" className="bg-transparent border-gray-600 hover:bg-gray-800">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Live Demo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Let's Work Together</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
            I'm always interested in new opportunities and exciting projects. Whether you have a question or just want
            to say hi, feel free to reach out!
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="pt-6 text-center">
                <Mail className="w-8 h-8 mx-auto mb-4 text-purple-400" />
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-gray-400">your.email@example.com</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="pt-6 text-center">
                <Linkedin className="w-8 h-8 mx-auto mb-4 text-purple-400" />
                <h3 className="font-semibold mb-2">LinkedIn</h3>
                <p className="text-gray-400">linkedin.com/in/yourname</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="pt-6 text-center">
                <Github className="w-8 h-8 mx-auto mb-4 text-purple-400" />
                <h3 className="font-semibold mb-2">GitHub</h3>
                <p className="text-gray-400">github.com/yourusername</p>
              </CardContent>
            </Card>
          </div>

          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            <Mail className="w-5 h-5 mr-2" />
            Send Me a Message
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-800">
        <div className="container mx-auto text-center">
          <p className="text-gray-400">© 2024 Your Name. Built with Next.js and Tailwind CSS.</p>
        </div>
      </footer>
    </div>
  )
}
