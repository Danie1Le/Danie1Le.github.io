import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import type React from "react"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Daniel Le - Software Engineer",
  description: "Software Engineer & Computer Science Student. Explore my projects, experience, and skills.",
  metadataBase: new URL("https://danie1le.github.io"),
  openGraph: {
    title: "Daniel Le - Software Engineer",
    description: "Software Engineer & Computer Science Student. Explore my projects, experience, and skills.",
    url: "https://danie1le.github.io",
    siteName: "Daniel Le Portfolio",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
}

export const viewport: Viewport = { themeColor: "#0c0a08" }

// Runs before paint: restore the saved theme (dark by default) and arm the scroll reveals.
// If the app never hydrates, the reveals are disarmed after 4s so no content stays hidden.
const boot = `try{var t=localStorage.getItem('theme');if(t)document.documentElement.dataset.theme=t}catch(e){}
document.documentElement.classList.add('js');setTimeout(function(){if(!window.__revealed)document.documentElement.classList.remove('js')},4000)`

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
