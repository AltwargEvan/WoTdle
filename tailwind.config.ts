/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        correct: "#538d4e",
        partialCorrect: "#b59f3b",
      },
      fontFamily: {
        roboto: ["Roboto Condensed", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
