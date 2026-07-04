/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', "system-ui", "sans-serif"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
        serif: ['"Cormorant Garamond"', "Georgia", "serif"],
      },
      colors: {
        ink: {
          950: "#060910",
          900: "#0a0e17",
          800: "#111726",
          700: "#1a2133",
          600: "#242e44",
        },
        sand: "#f4ede1",
        primary: {
          DEFAULT: "#ff6a4d",
          soft: "#ff8a72",
          deep: "#d9482e",
        },
        teal: {
          DEFAULT: "#22d3c5",
          deep: "#0e8f86",
        },
        aurora: "#8b7bff",
        gold: "#f4c56a",
      },
      boxShadow: {
        glow: "0 0 40px rgba(255, 106, 77, 0.35)",
        "glow-teal": "0 0 40px rgba(34, 211, 197, 0.3)",
        soft: "0 8px 40px rgba(0, 0, 0, 0.35)",
        card: "0 20px 60px -20px rgba(0, 0, 0, 0.6)",
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        auroraShift: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(4%, -4%) scale(1.1)" },
          "66%": { transform: "translate(-4%, 3%) scale(0.95)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        gradientMove: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        typing: {
          "0%, 60%, 100%": { transform: "translateY(0)", opacity: "0.4" },
          "30%": { transform: "translateY(-4px)", opacity: "1" },
        },
        spinSlow: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        dashMove: {
          to: { strokeDashoffset: "-1000" },
        },
      },
      animation: {
        "fade-up": "fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "fade-in": "fadeIn 0.5s ease-out forwards",
        float: "float 7s ease-in-out infinite",
        aurora: "auroraShift 18s ease-in-out infinite",
        shimmer: "shimmer 1.6s linear infinite",
        "gradient-move": "gradientMove 6s ease infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        typing: "typing 1.4s ease-in-out infinite",
        "spin-slow": "spinSlow 14s linear infinite",
      },
    },
  },
  plugins: [],
};
