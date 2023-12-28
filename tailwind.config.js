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
        successBtn: "#9bd1f5",
        rejectedBtn: "#ffe6ab",
        failedBtn: "#ffb1c2",
      },
      animation: {
        updown: 'updown 3s ease-in-out infinite',
      },
      keyframes: {
        updown: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-25px)' },
        },
      },
    },
  },
  plugins: [],
}

