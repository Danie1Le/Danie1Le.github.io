"use client"

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ImagePreviewModalProps {
  src: string | null;
  onClose: () => void;
}

export default function ImagePreviewModal({ src, onClose }: ImagePreviewModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (src) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [src, onClose]);

  if (!src || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true" aria-label="Image preview">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute top-2 right-2 z-10 bg-black/40 hover:bg-black/60 text-white rounded-full p-2"
          aria-label="Close image preview"
        >
          <X className="w-4 h-4" />
        </Button>

        <img
          src={src}
          alt="Preview"
          className="max-w-[95vw] max-h-[90vh] object-contain shadow-2xl"
        />
      </div>
    </div>,
    document.body
  );
}
