/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./StockOS_Dashboard.jsx"
  ],
  theme: {
    extend: {
      fontFamily: {
        syne: ["Syne", "sans-serif"],
        dmsans: ["DM Sans", "sans-serif"],
      }
    },
  },
  plugins: [],
}
