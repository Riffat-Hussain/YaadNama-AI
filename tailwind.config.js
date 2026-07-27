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
        surface: "var(--surface)",
        surface2: "var(--surface-2)",
        "surface-2": "var(--surface-2)",
        text: "var(--text)",
        muted: "var(--muted)",
        paper: "#FAF6EF",
        paper2: "#F1E9D8",
        ink: "#2B2A28",
        inkfaint: "#6B655C",
        teal: {
          DEFAULT: "#2B6664",
          dark: "#173B3A",
          light: "#5F9A98",
        },
        gold: {
          DEFAULT: "#C08A3E",
          dark: "#8C5E29",
          light: "#E5C08A",
        },
        rose: {
          DEFAULT: "#B5615A",
          dark: "#8F4640",
          light: "#E6A39B",
        },
      },
      fontFamily: {
        display: ["Iowan Old Style", "Palatino Linotype", "Georgia", "serif"],
        body: ["Inter", "-apple-system", "Segoe UI", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "1.75rem",
        "2xl": "2rem",
        keepsake: "1.5rem",
      },
      boxShadow: {
        soft: "0 24px 80px -32px rgba(43, 42, 40, 0.22)",
        glow: "0 28px 80px -30px rgba(76, 123, 118, 0.16)",
        card: "0 14px 34px -18px rgba(43, 42, 40, 0.18)",
        keepsake: "0 18px 44px -24px rgba(43, 42, 40, 0.24)",
      },
    },
  },
  plugins: [],
};
