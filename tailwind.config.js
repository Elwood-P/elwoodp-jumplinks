/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html'],
  theme: {
    extend: {
      backgroundImage: {
        hero: "linear-gradient(201.93deg, rgba(16, 24, 39, 0) 14.35%, rgba(16, 24, 39, 0.9) 54.41%), url('https://kimba-imagecdn.imgix.net/elwoodp-jumplinks/hero-bg.jpg?q=80&auto=format'), linear-gradient(0deg, rgba(16, 24, 39, 1), rgba(16, 24, 39, 1))",
      },
      borderRadius: {
        DEFAULT: '12px',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
