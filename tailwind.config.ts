import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        'scan': 'scan 4s linear infinite',
        'led-pulse': 'pulse-border 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'progress-pulse': 'progressPulse 2s ease-in-out infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(100%)' },
        },
        'pulse-border': {
          '0%, 100%': {
            boxShadow: '0 0 10px rgba(0, 229, 255, 0.15)',
            borderColor: 'rgba(0, 229, 255, 0.25)',
          },
          '50%': {
            boxShadow: '0 0 25px rgba(0, 229, 255, 0.5)',
            borderColor: 'rgba(0, 229, 255, 0.85)',
          },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        progressPulse: {
          '0%, 100%': {
            boxShadow: '0 0 8px rgba(0, 229, 255, 0.3), 0 0 16px rgba(0, 229, 255, 0.1)',
          },
          '50%': {
            boxShadow: '0 0 18px rgba(0, 229, 255, 0.6), 0 0 36px rgba(0, 229, 255, 0.2)',
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;