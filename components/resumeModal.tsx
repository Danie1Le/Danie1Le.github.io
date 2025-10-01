"use client"

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useEffect } from "react";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/Daniel_Le_resume.pdf';
    link.download = 'Daniel_Le_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
       {/* Clean Resume Modal - Just PDF */}
       <div className="relative w-[90vw] h-[98vh] max-w-4xl bg-white shadow-2xl flex flex-col">
        {/* Close Button - Top Right */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute top-2 right-2 z-10 bg-black/20 hover:bg-black/40 text-white rounded-full p-2"
        >
          <X className="w-4 h-4" />
        </Button>
        
         {/* PDF Viewer - Zoomed out resume */}
         <div className="flex-1">
           <iframe
             src="/Daniel_Le_resume.pdf#toolbar=0&navpanes=0&scrollbar=0&zoom=82"
             className="w-full h-full border-0"
             title="Daniel Le Resume"
           />
         </div>
         
         {/* Download Button - At bottom of PDF */}
         <div className="py-1 px-2 text-center">
           <Button
             onClick={handleDownload}
             className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 underline"
           >
             Download
           </Button>
         </div>
       </div>
    </div>
  );
}
