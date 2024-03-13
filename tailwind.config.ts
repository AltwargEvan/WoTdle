/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        correct: "#22c55e",
        partialCorrect: "#b59f3b",
        incorrect: "#C1666B",
      },
      fontFamily: {
        roboto: ["Roboto Condensed", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
