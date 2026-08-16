import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        moon: {
          50: '#fffbf0',
          100: '#fef3d6',
          200: '#fce3ab',
          300: '#f9cb77',
          400: '#f5aa41',
          500: '#e58519',
          600: '#c5610d',
          700: '#9e430d',
          800: '#803612',
          900: '#692d13',
          950: '#3c1507',
        },
        jade: {
          50: '#f0fdf7',
          100: '#dccebe',
          700: '#1b4d3e',
          800: '#153e32',
          900: '#0f2c24',
        }
      },
      fontFamily: {
        serif: ['var(--font-noto-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-noto-sans)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 25px -5px rgba(229, 133, 25, 0.3)',
        'card': '0 10px 30px -5px rgba(0, 0, 0, 0.08)',
      }
    },
  },
  plugins: [],
};
export default config;
