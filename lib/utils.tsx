import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getImagePath(path: string) {
  if (typeof window !== 'undefined') {
    // Client-side: check if we're on GitHub Pages
    const isGitHubPages = window.location.hostname.includes('github.io')
    return isGitHubPages ? `/MyPortfolio${path}` : path
  }
  // Server-side: use environment variable
  return process.env.NODE_ENV === 'production' ? `/MyPortfolio${path}` : path
}
