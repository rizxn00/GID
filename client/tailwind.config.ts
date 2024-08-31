import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./pages/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
    colors: {
      primary: "rgb(var(--color-primary) / <alpha-value>)",
      contrast: "rgb(var(--color-primary-contrast) / <alpha-value>)",
      background: "rgb(var(--color-background) / <alpha-value>)",
      surface: "rgb(var(--color-surface) / <alpha-value>)",
      surfaced: "rgb(var(--color-surfaced) / <alpha-value>)",
      text: "rgb(var(--color-text) / <alpha-value>)",
      second: "rgb(var(--color-secondary) / <alpha-value>)",
      success: "rgb(var(--color-success) / <alpha-value>)",
      info: "rgb(var(--color-info) / <alpha-value>)",
      warn: "rgb(var(--color-warn) / <alpha-value>)",
      error: "rgb(var(--color-error) / <alpha-value>)",
      transparent: "transparent",
      current: "currentColor",
      white: "#ffffff",
    },
  },
  plugins: [],
};
export default config;
