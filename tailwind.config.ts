import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0d0f14",
        surface: "#161a22",
        "surface-elevated": "#212734",
        border: "#293142",
        gold: {
          DEFAULT: "#e6b042",
          light: "#f5c767",
          dark: "#b88523",
        },
        accent: {
          red: "#ef4444",
          emerald: "#10b981",
          blue: "#3b82f6",
        },
      },
      fontFamily: {
        sans: ["var(--font-rubik)", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
