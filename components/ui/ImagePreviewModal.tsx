"use client"

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ImagePreviewModalProps {
  src: string | null; // the image to show; null keeps the modal closed
  onClose: () => void;
  download?: { href: string; filename: string }; // adds a Download button for this file
}

/** A full-screen image preview. Closes on Escape, the backdrop or the X; the page behind stops scrolling. */
export default function ImagePreviewModal({ src, onClose, download }: ImagePreviewModalProps) {
  const [mounted, setMounted] = useState(false); // the portal needs document.body, so render only after mount

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!src) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [src, onClose]);

  if (!src || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true" aria-label="Preview">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md animate-in fade-in duration-200" onClick={onClose} aria-hidden="true" />

      <div className="relative flex flex-col items-center gap-3 animate-in fade-in zoom-in-95 duration-200 ease-out">
        <button
          onClick={onClose}
          aria-label="Close preview"
          className="absolute top-2 right-2 z-10 inline-flex items-center justify-center h-9 px-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <img src={src} alt="Preview" className={`max-w-[95vw] object-contain shadow-2xl ${download ? "max-h-[85vh]" : "max-h-[90vh]"}`} />

        {download && (
          <a href={download.href} download={download.filename} className="btn-brand t-small">
            Download
          </a>
        )}
      </div>
    </div>,
    document.body
  );
}
