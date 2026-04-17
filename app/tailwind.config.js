/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        general: ["GeneralSans", "sans-serif"],
        mogi: ["LCMogi", "sans-serif"],
      },
      colors: {
        beige: "#F4DFA9",
        brown: "#753F18",
        dark_blue: "#000F1A",
        shinny_blue: "#2BC9CD",
        pink: "#A00899",
        orange: "#FF6B08",
      },
      backgroundColor: {
        beige: "#F4DFA9",
        brown: "#753F18",
        dark_blue: "#000F1A",
        shinny_blue: "#2BC9CD",
        pink: "#A00899",
        orange: "#FF6B08",
      },
    },
  },
  plugins: [],
};
