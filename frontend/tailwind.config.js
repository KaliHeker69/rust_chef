/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rust: {
          50: '#fef7ee',
          100: '#fceacc',
          200: '#f8d59e',
          300: '#f4b968',
          400: '#ef9731',
          500: '#ec6f09',
          600: '#de5b05',
          700: '#b84509',
          800: '#94380f',
          900: '#792e10',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
