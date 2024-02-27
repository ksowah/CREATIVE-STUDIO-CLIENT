import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'overlay': 'rgba(0, 0, 0, 0.1)',
        'midDrakRgba': 'rgba(0, 0, 0, 0.2)',
        'blackRgba': 'rgba(0, 0, 0, 0.6)',
        'blueRgba': 'rgba(205, 209, 228, 0.15)',
      }
    },
  },
  plugins: [],
};
export default config;
