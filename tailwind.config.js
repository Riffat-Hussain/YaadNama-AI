/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        paper: "#FAF6EF",
        paper2: "#F1E9D8",
        ink: "#2B2A28",
        inkfaint: "#6B655C",
        teal: {
          DEFAULT: "#2B6664",
          dark: "#1E4A48",
          light: "#4A8886",
        },
        gold: {
          DEFAULT: "#C08A3E",
          dark: "#9C6C2A",
          light: "#E0B876",
        },
        rose: {
          DEFAULT: "#B5615A",
          dark: "#8F4640",
        },
      },
      fontFamily: {
        display: ["Iowan Old Style", "Palatino Linotype", "Georgia", "serif"],
        body: ["-apple-system", "Segoe UI", "system-ui", "sans-serif"],
      },
      borderRadius: {
        keepsake: "1.25rem",
      },
      boxShadow: {
        keepsake: "0 8px 30px -12px rgba(43, 42, 40, 0.25)",
      },
    },
  },
  plugins: [],
};
