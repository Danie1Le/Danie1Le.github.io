import { useState } from "react";

const CONFIRMATION_MS = 1800;

export function useCopyToClipboard(text: string) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), CONFIRMATION_MS);
  };
  return { copied, copy };
}
