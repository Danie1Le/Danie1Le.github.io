"use client"

import { Card, CardContent } from "@/components/ui/card";
import { Github, Linkedin, Mail } from "lucide-react";

interface ContactSectionProps {
  handleEmailClick: (e: React.MouseEvent) => void;
}

export default function ContactSection({ handleEmailClick }: ContactSectionProps) {
  return (
    <section id="contact" className="py-20 px-6">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold mb-8">
          Let's Work Together
        </h2>
        <p className="text-xl text-gray-400 max-w-2x2 mx-auto mb-12">
          feel free to reach out! I'm always interested in new opportunities and exciting projects.
        </p>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
          <Card 
            className="bg-gray-900 border-gray-800 cursor-pointer hover:border-gray-600 transition-colors"
            onClick={handleEmailClick}
          >
            <CardContent className="pt-6 text-center">
              <Mail className="w-8 h-8 mx-auto mb-4 text-blue-400" />
              <h3 className="font-semibold text-white mb-2">Email</h3>
            </CardContent>
          </Card>

          <a href="https://www.linkedin.com/in/danie1-le/" target="_blank" rel="noopener noreferrer" className="block">
            <Card className="bg-gray-900 border-gray-800 cursor-pointer hover:border-gray-600 transition-colors">
              <CardContent className="pt-6 text-center">
                <Linkedin className="w-8 h-8 mx-auto mb-4 text-blue-400" />
                <h3 className="font-semibold text-white mb-2">LinkedIn</h3>
              </CardContent>
            </Card>
          </a>

          <a href="https://github.com/Danie1Le" target="_blank" rel="noopener noreferrer" className="block">
            <Card className="bg-gray-900 border-gray-800 cursor-pointer hover:border-gray-600 transition-colors">
              <CardContent className="pt-6 text-center">
                <Github className="w-8 h-8 mx-auto mb-4 text-blue-400" />
                <h3 className="font-semibold text-white mb-2">GitHub</h3>
              </CardContent>
            </Card>
          </a>
        </div>
      </div>
    </section>
  );
}
