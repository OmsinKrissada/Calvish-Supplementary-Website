/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'fira': 'Fira Sans',
        'sans': 'Inter',
        'mono': 'JetBrains Mono',
      }
    },
  },
  plugins: [],
};
