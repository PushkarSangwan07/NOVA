/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base: "#EEF0F4",
        surface: "#FFFFFF",
        ink: "#1B1F2A",
        "ink-soft": "#565D6D",
        border: "#DDE1E8",
        primary: {
          DEFAULT: "#2F3C7E",
          dark: "#232E63",
          light: "#5566B8",
        },
        amber: "#C98A3E",
        teal: "#3F7863",
        coral: "#C1554A",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        sans: ["IBM Plex Sans", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
