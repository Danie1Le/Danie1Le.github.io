"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ImagePreviewModal from "@/components/imagePreviewModal"
import { jobs } from "@/lib/data"
import { Eye, MapPin } from "lucide-react"
import { useState } from "react"

interface ExperienceSectionProps {
  visibleSections: Set<string>;
  expandedJob: number | null;
  handleCardClick: (index: number) => void;
}

export default function ExperienceSection({ visibleSections, expandedJob, handleCardClick }: ExperienceSectionProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  return (
    <section id="experience" className={`min-h-screen py-20 px-6 flex items-center transition-all duration-1000 ${
      visibleSections.has('experience') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
    }`}>
      <div className="container mx-auto w-full">
        <h2 className={`text-4xl font-bold text-center mb-16 transition-all duration-1000 delay-200 ${
          visibleSections.has('experience') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          Career Roadmap
        </h2>
        <div className={`max-w-4xl mx-auto transition-all duration-1000 delay-400 ${
          visibleSections.has('experience') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="relative">
            {/* Vertical Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 via-yellow-500 to-blue-500 rounded-full"></div>

            <div className="space-y-12">
              {jobs.map((job, index) => (
                <div key={index} className="relative">
                  {/* Timeline Node */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-8">
                    <div
                      className={`w-6 h-6 rounded-full border-4 ${
                        job.current
                          ? "bg-gradient-to-r from-blue-500 to-yellow-500 border-white shadow-lg shadow-blue-500/50"
                          : "bg-gray-900 border-gray-600"
                      } z-10 relative`}
                    >
                      {job.current && (
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-yellow-500 animate-ping opacity-75"></div>
                      )}
                    </div>
                  </div>

                  {/* Job Card */}
                  <div className={`flex ${job.side === "left" ? "justify-start" : "justify-end"} transition-all duration-1000 ${
                    visibleSections.has('experience') 
                      ? (job.side === "left" 
                          ? 'opacity-100 translate-x-0' 
                          : 'opacity-100 translate-x-0')
                      : (job.side === "left" 
                          ? 'opacity-0 -translate-x-10' 
                          : 'opacity-0 translate-x-10')
                  }`} style={{ transitionDelay: `${index * 200}ms` }}>
                    <div className={`w-full transition-all duration-300 ${
                      expandedJob === index
                        ? (job.side === "left"
                            ? "md:w-[50vw] md:ml-[calc(50%_-_50vw)] md:pr-8 md:pl-4"
                            : "md:w-[50vw] md:mr-[calc(50%_-_50vw)] md:pl-8 md:pr-4")
                        : (job.side === "left" ? "md:w-5/12 md:pr-8" : "md:w-5/12 md:pl-8")
                    }`}>
                      <Card
                        className={`bg-gray-900 border-gray-800 relative cursor-pointer hover:border-gray-600 transition-all duration-300 ${
                          job.current ? "ring-2 ring-blue-500/50 shadow-lg shadow-blue-500/20" : ""
                        } ${expandedJob === index ? "shadow-2xl" : ""}`}
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
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="outline"
                                  className={`${
                                    job.current
                                      ? "border-blue-500 text-blue-400 bg-blue-500/10"
                                      : "border-gray-600 text-gray-400"
                                  }`}
                                >
                                  {job.period}
                                </Badge>
                                {job.previewImage && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setPreviewImage(job.previewImage!);
                                    }}
                                    className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-gray-600 text-gray-300 hover:border-blue-500 hover:text-blue-400 transition-colors"
                                    aria-label="Preview research poster"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                              {job.current && (
                                <Badge className="border-0 bg-gradient-to-r from-blue-500 to-yellow-500 text-white">
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
                                <ul className="list-disc list-outside pl-5 text-gray-400 space-y-1 text-sm">
                                  {job.details.map((point, i) => (
                                    <li key={i}>{point}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-4">
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
              </div>
            </div>
          </div>
        </div>
      </div>

      <ImagePreviewModal src={previewImage} onClose={() => setPreviewImage(null)} />
    </section>
  );
}
