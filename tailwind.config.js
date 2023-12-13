/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slideBar: "#1C2434",
        btnColor: "#3C50E0",
        btnHover: "#B2B7DF",
        bgColor: "#F1F5F9",
      }
    },
  },
  plugins: [],
}

