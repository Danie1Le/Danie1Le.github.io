"use client"

import { Badge } from "@/components/ui/badge";
import { skills } from "@/lib/data";

interface AboutSectionProps {
  visibleSections: Set<string>;
}

export default function AboutSection({ visibleSections }: AboutSectionProps) {
  return (
    <section id="about" className={`min-h-screen py-12 px-6 flex items-center transition-all duration-1000 ${
      visibleSections.has('about') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
    }`}>
      <div className="container mx-auto w-full">
        <h2 className={`text-4xl font-bold text-center mb-16 transition-all duration-1000 delay-200 ${
          visibleSections.has('about') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          About Me
        </h2>
        <div className="max-w-4xl mx-auto">
          <div className={`text-center space-y-6 transition-all duration-1000 delay-500 ${
            visibleSections.has('about') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h3 className="text-2xl font-semibold text-white mb-4">Computer Science Student & Developer</h3>
            <p className="text-gray-300 leading-relaxed">
              I'm a passionate Computer Science student with a love for creating innovative solutions and learning new technologies. 
              My journey in tech started with being curious and a uncertianty of a career that I wanted to pursue. I've been put into 
              intriguing projects that have incorporated technologies such as AI, Machine Learning, and Web Development that's given me a passion for 
              the field and has evolved into a drive to build meaningful applications that could solve real-world problems.
            </p>
            <p className="text-gray-300 leading-relaxed">
            When I'm not coding, you can find me exploring new technologies, going to the gym, playing videos games, or picking up new hobbies. 
            I want to be a continuous learner and be able to be apart of interesting projects that could be able to help not only myself but others as well.
            </p>
            
            {/* Technical Skills */}
            <div className={`pt-6 transition-all duration-1000 delay-400 ${
              visibleSections.has('about') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <h4 className="text-lg font-semibold text-white mb-4">Technical Skills:</h4>
              <div className="space-y-4">
                <div>
                  <h5 className="text-sm font-medium text-gray-300 mb-2">Programming Languages</h5>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {skills.programmingLanguages.map((skill) => (
                      <Badge key={skill} variant="outline" className="border-green-500 text-green-400 bg-green-500/10">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-300 mb-2">Technologies & Frameworks</h5>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {skills.technologies.map((skill) => (
                      <Badge key={skill} variant="outline" className="border-purple-500 text-purple-400 bg-purple-500/10">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-300 mb-2">Development Tools</h5>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {skills.developmentTools.map((skill) => (
                      <Badge key={skill} variant="outline" className="border-orange-500 text-orange-400 bg-orange-500/10">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Skills/Interests */}
            <div className={`pt-6 transition-all duration-1000 delay-600 ${
              visibleSections.has('about') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <h4 className="text-lg font-semibold text-white mb-3">What I'm passionate about:</h4>
              <div className="flex flex-wrap gap-2 justify-center">
                {skills.interests.map((interest) => (
                  <Badge key={interest} variant="outline" className="border-blue-500 text-blue-400 bg-blue-500/10">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
