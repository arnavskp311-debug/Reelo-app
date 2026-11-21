import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        reelo: {
          // Brand Identity - Natural Premium
          primary: {
            DEFAULT: "#243746",
            hover: "#1A2833",
            light: "#354F64",
          },
          secondary: {
            DEFAULT: "#4C7A78",
            hover: "#3D6260",
            light: "#659A98",
          },
          bg: "#F7F6F2",
          surface: "#FFFFFF",
          surfaceElevated: "#FFFFFF",
          surfaceMuted: "#EFECE6",
          
          // Borders
          border: "#E5E3DC",
          borderHover: "#D5D2C8",
          borderActive: "#243746",
          
          // Typography
          text: "#202A30",
          muted: "#77818A",
          subtle: "#9CA4AB",
          
          // Signature Accent - Terracotta / Warm Clay
          accent: {
            DEFAULT: "#C87952",
            hover: "#B36742",
            light: "#DE906B",
            soft: "rgba(200, 121, 82, 0.10)",
            border: "rgba(200, 121, 82, 0.30)",
          },
          
          // Status Accents
          success: "#2E7D5A",
          danger: "#C0392B",
          warning: "#D9822B",
        },
      },
      boxShadow: {
        subtle: "0 1px 3px rgba(36, 55, 70, 0.05), 0 2px 8px rgba(36, 55, 70, 0.03)",
        card: "0 1px 2px rgba(36, 55, 70, 0.04), 0 4px 14px rgba(36, 55, 70, 0.05)",
        floating: "0 8px 30px rgba(36, 55, 70, 0.08)",
      },
      borderRadius: {
        "reelo-card": "1rem",
      },
    },
  },
  plugins: [],
};
export default config;
