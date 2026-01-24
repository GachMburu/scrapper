import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: '#0ea5e9',
          light: '#06b6d4',
        },
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(16, 30, 54, 0.18)',
        widget: '0 2px 8px 0 rgba(16, 30, 54, 0.12)',
        glow: '0 0 0 2px #0ea5e9, 0 4px 32px 0 rgba(16, 30, 54, 0.18)',
      },
    },
  },
  plugins: [],
};
export default config;
