/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      opacity: {
        "8": "0.08",
        "15": "0.15",
      },
      fontFamily: {
        sans:    ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-dm-serif)", "Georgia", "serif"],
      },
      colors: {
        // Emerald accent overrides for consistency
        emerald: {
          50:  "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
          950: "#022c22",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":  "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "grid-slate":
          "linear-gradient(rgba(52,211,153,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.04) 1px, transparent 1px)",
      },
      backgroundSize: {
        "grid": "60px 60px",
      },
      animation: {
        "pulse-glow":   "pulse-glow 2.5s ease-in-out infinite",
        "float-up":     "float-up 0.5s ease-out forwards",
        "shimmer":      "shimmer 2s infinite",
        "gps-ping":     "gps-ping 1.8s ease-out infinite",
        "gradient":     "gradient-shift 5s ease infinite",
        "spin-slow":    "spin 6s linear infinite",
        "bounce-soft":  "bounce 2s ease-in-out infinite",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(16,185,129,0.2)" },
          "50%":       { boxShadow: "0 0 40px rgba(16,185,129,0.45)" },
        },
        "float-up": {
          "0%":   { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "shimmer": {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "gps-ping": {
          "0%":   { transform: "scale(1)", opacity: "0.8" },
          "70%":  { transform: "scale(2.5)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "0" },
        },
        "gradient-shift": {
          "0%":   { backgroundPosition: "0% 50%" },
          "50%":  { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        "glow-emerald":    "0 0 30px rgba(16,185,129,0.25)",
        "glow-emerald-sm": "0 0 12px rgba(16,185,129,0.20)",
        "glow-blue":       "0 0 30px rgba(59,130,246,0.25)",
        "glow-amber":      "0 0 30px rgba(245,158,11,0.25)",
        "inner-white":     "inset 0 1px 0 rgba(255,255,255,0.06)",
      },
      spacing: {
        "4.5": "1.125rem",
        "18":  "4.5rem",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
};
