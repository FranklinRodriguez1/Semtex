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
      colors: {
        "surface-container-lowest": "#0e0e10",
        "on-surface-variant": "#b9cacb",
        "secondary-fixed-dim": "#00e639",
        "error-container": "#93000a",
        "on-tertiary-container": "#c3000a",
        "inverse-primary": "#00696f",
        "on-tertiary-fixed": "#410001",
        "secondary-fixed": "#72ff70",
        "primary-container": "#00f2ff",
        "inverse-on-surface": "#303032",
        "secondary-container": "#13ff43",
        "primary": "#e1fdff",
        "on-tertiary-fixed-variant": "#930005",
        "on-tertiary": "#690003",
        "surface-container-high": "#2a2a2c",
        "on-secondary-fixed-variant": "#00530e",
        "on-secondary-container": "#007117",
        "on-error": "#690005",
        "on-primary-fixed": "#002022",
        "on-background": "#e5e1e4",
        "surface-variant": "#353437",
        "inverse-surface": "#e5e1e4",
        "surface-dim": "#131315",
        "on-secondary": "#003907",
        "surface-container-highest": "#353437",
        "surface-container-low": "#1b1b1d",
        "tertiary": "#fff5f4",
        "surface-bright": "#39393b",
        "secondary": "#ecffe3",
        "on-primary-fixed-variant": "#004f54",
        "error": "#ffb4ab",
        "surface-container": "#201f21",
        "primary-fixed-dim": "#00dbe7",
        "on-secondary-fixed": "#002203",
        "surface-tint": "#00dbe7",
        "outline": "#849495",
        "tertiary-fixed-dim": "#ffb4aa",
        "tertiary-container": "#ffd0ca",
        "outline-variant": "#3a494b",
        "on-primary": "#00363a",
        "on-error-container": "#ffdad6",
        "primary-fixed": "#74f5ff",
        "surface": "#131315",
        "on-surface": "#e5e1e4",
        "on-primary-container": "#006a71",
        "background": "#131315",
        "tertiary-fixed": "#ffdad5",
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
      spacing: {
        "container-max": "1440px",
        "gutter": "16px",
        "margin-mobile": "16px",
        "unit": "4px",
        "margin-desktop": "32px",
      },
      fontFamily: {
        "display-lg": ["Inter"],
        "body-base": ["Inter"],
        "headline-md": ["Inter"],
        "data-tabular": ["JetBrains Mono"],
        "label-caps": ["JetBrains Mono"],
      },
      fontSize: {
        "display-lg": [
          "48px",
          { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" },
        ],
        "body-base": [
          "14px",
          { lineHeight: "1.6", letterSpacing: "0em", fontWeight: "400" },
        ],
        "headline-md": [
          "24px",
          { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "600" },
        ],
        "data-tabular": [
          "13px",
          { lineHeight: "1.4", letterSpacing: "-0.01em", fontWeight: "500" },
        ],
        "label-caps": [
          "11px",
          { lineHeight: "1", letterSpacing: "0.08em", fontWeight: "700" },
        ],
      },
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