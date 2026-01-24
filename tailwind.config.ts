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
        base: '#0a0e1a',
        surface: '#131823',
        'surface-elevated': '#1a1f2e',
        primary: {
          DEFAULT: '#3b82f6',
          light: '#60a5fa',
        },
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        info: '#8b5cf6',
        'text-primary': '#f8fafc',
        'text-secondary': '#94a3b8',
        'text-muted': '#64748b',
        border: '#1e293b',
        'border-accent': '#334155',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(16, 30, 54, 0.18)',
        widget: '0 2px 8px 0 rgba(16, 30, 54, 0.12)',
        glow: '0 0 0 2px #3b82f6, 0 4px 32px 0 rgba(16, 30, 54, 0.18)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)',
        'gradient-surface': 'linear-gradient(135deg, #1a1f2e 0%, #131823 100%)',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
    },
  },
  plugins: [],
};
export default config;
