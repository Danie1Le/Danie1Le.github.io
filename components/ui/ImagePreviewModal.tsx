"use client"

import { useEscapeKey } from "@/hooks/useEscapeKey";
import { useMounted } from "@/hooks/useMounted";
import { useReturnFocusToKeyboardUsers } from "@/hooks/useReturnFocus";
import { useScrollLock } from "@/hooks/useScrollLock";
import { ICON } from "@/lib/styles";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

type Download = { href: string; filename: string };

interface ImagePreviewModalProps {
  src: string | null;
  onClose: () => void;
  download?: Download;
}

export default function ImagePreviewModal({ src, onClose, download }: ImagePreviewModalProps) {
  const mounted = useMounted();
  const open = src !== null;
  useReturnFocusToKeyboardUsers(open);
  useEscapeKey(open, onClose);
  useScrollLock(open);

  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true" aria-label="Preview">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md animate-in fade-in duration-200" onClick={onClose} aria-hidden="true" />
      <div className="relative flex flex-col items-center gap-3 animate-in fade-in zoom-in-95 duration-200 ease-out">
        <CloseButton onClose={onClose} />
        <img src={src} alt="Preview" className={`max-w-[95vw] object-contain shadow-2xl ${download ? "max-h-[85vh]" : "max-h-[90vh]"}`} />
        {download && <DownloadButton {...download} />}
      </div>
    </div>,
    document.body
  );
}

function CloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button
      onClick={onClose}
      aria-label="Close preview"
      className="absolute top-2 right-2 z-10 inline-flex items-center justify-center h-9 px-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
    >
      <X className={ICON} />
    </button>
  );
}

function DownloadButton({ href, filename }: Download) {
  return (
    <a href={href} download={filename} className="btn-brand t-small">
      Download
    </a>
  );
}
