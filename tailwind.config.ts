import type { Config } from "tailwindcss"

// Colours, type and spacing come from the CSS tokens in app/globals.css; this only adds the house easing curve.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      transitionTimingFunction: {
        expo: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")], // animate-in / fade-in / zoom-in for the image preview
} satisfies Config

export default config
