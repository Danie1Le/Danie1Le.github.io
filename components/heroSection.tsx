"use client"

import { Button } from "@/components/ui/button";
import { getImagePath } from "@/lib/utils";
import { Github, Linkedin, Mail } from "lucide-react";

interface HeroSectionProps {
  isLoaded: boolean;
  handleEmailClick: (e: React.MouseEvent) => void;
}

export default function HeroSection({ isLoaded, handleEmailClick }: HeroSectionProps) {
  return (
    <section id="hero" className={`min-h-screen flex items-center justify-center px-6 transition-all duration-1000 ${
      isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
    }`}>
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-center gap-12">
          {/* Left side - Profile Picture */}
          <div className={`w-64 h-64 rounded-full overflow-hidden border-4 border-blue-500 transition-all duration-1000 delay-200 ${
            isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          }`} style={{ width: '256px', height: '256px', minWidth: '256px', minHeight: '256px', maxWidth: '256px', maxHeight: '256px' }}>
            <img
              src={getImagePath("/IMG_6880.PNG")}
              alt="Daniel Le"
              className="w-full h-full object-cover object-center"
              style={{ objectPosition: 'center 25%' }}
            />
          </div>
          
          {/* Right side - Name and Links */}
          <div className="text-center md:text-left">
            <h1 className={`text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent transition-all duration-1000 delay-300 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              Daniel Le
            </h1>
            <p className={`text-xl md:text-2xl text-gray-400 mb-6 transition-all duration-1000 delay-400 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              Software Engineer
            </p>
            <div className={`flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4 transition-all duration-1000 delay-600 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
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
              <Button 
                size="lg" 
                className="bg-white text-gray-950 hover:bg-gray-200"
                onClick={handleEmailClick}
              >
                <Mail className="w-5 h-5 mr-2" />
                Get In Touch
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
