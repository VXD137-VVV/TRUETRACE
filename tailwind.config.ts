import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#d9e5ff",
          200: "#bcd0ff",
          300: "#8eb2ff",
          400: "#5b8cff", // Primary
          500: "#3b73e8",
          600: "#2557ca",
          700: "#1d43a4",
          800: "#1d3a84",
          900: "#1c336b",
        },
        cyber: {
          cyan: "#38BDF8", // Cyan accent
          blue: "#5B8CFF", // Primary
          purple: "#8B7CFF", // Secondary Accent
          emerald: "#34D399", // Success
          amber: "#FBBF24", // Warning
          rose: "#FB7185", // Danger
        },
        dark: {
          bg: "#0B1220", // Deep navy background (no pure black)
          surface: "#101827",
          card: "#151F32",
          elevated: "#1B263B",
          border: "#27344A",
          text: "#F8FAFC",
          muted: "#94A3B8",
        },
        light: {
          bg: "#F5F7FB",
          surface: "#FFFFFF",
          card: "#FFFFFF",
          elevated: "#EEF2F7",
          border: "#DDE3EC",
          text: "#111827",
          muted: "#64748B",
        }
      },
      backgroundImage: {
        "cyber-gradient": "linear-gradient(135deg, #38BDF8 0%, #5B8CFF 50%, #8B7CFF 100%)",
        "radial-glow": "radial-gradient(circle at center, var(--tw-gradient-stops))",
      },
      boxShadow: {
        "glass-dark": "0 8px 32px 0 rgba(0, 0, 0, 0.45)",
        "glass-light": "0 8px 32px 0 rgba(15, 23, 42, 0.06)",
        "glow-cyan": "0 0 20px -3px rgba(56, 189, 248, 0.4)",
        "glow-blue": "0 0 20px -3px rgba(91, 140, 255, 0.4)",
        "glow-purple": "0 0 20px -3px rgba(139, 124, 255, 0.4)",
        "glow-emerald": "0 0 20px -3px rgba(52, 211, 153, 0.4)",
        "glow-rose": "0 0 20px -3px rgba(251, 113, 133, 0.4)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float-slow": "float 6s ease-in-out infinite",
        "scan-line": "scanline 2.5s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(1000%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
