/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Color variables
      colors: {
        primary: "#2B85FF",
        secondary: "#Ef863E",
      },
    },
  },
  plugins: [],
}

