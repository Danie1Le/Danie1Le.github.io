import type { Metadata } from "next"
import { Inter } from "next/font/google"
import type React from "react"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Daniel Le - Portfolio",
  description: "Software Engineer & Computer Science Student. Explore my projects, experience, and skills.",
  metadataBase: new URL("https://danie1le.github.io"),
  openGraph: {
    title: "Daniel Le - Portfolio",
    description: "Software Engineer & Computer Science Student. Explore my projects, experience, and skills.",
    url: "https://danie1le.github.io",
    siteName: "Daniel Le Portfolio",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
  themeColor: "#030712",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-950 text-white min-h-screen`}>{children}</body>
    </html>
  )
}