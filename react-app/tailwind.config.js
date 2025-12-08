/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3730A3',
          light: '#4F46E5',
          dark: '#312E81',
        },
        accent: {
          DEFAULT: '#F59E0B',
          hover: '#D97706',
          light: '#FCD34D',
        },
        secondary: {
          DEFAULT: '#14B8A6',
          hover: '#0D9488',
        },
      },
    },
  },
  plugins: [],
}
