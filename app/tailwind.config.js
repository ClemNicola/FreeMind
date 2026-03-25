/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        general: ["GeneralSans", "sans-serif"],
        mogi: ["LCMogi", "sans-serif"],
      },
    },
  },
  plugins: [],
};
