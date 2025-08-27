/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './screens/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#111315',
        accent: '#ff3366',
        muted: '#6b7280',
      },
      borderRadius: {
        xl: '1rem',
      },
    },
  },
  plugins: [],
};

