/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // GitHub dark theme color palette
      colors: {
        ghBg: '#0d1117',
        ghCard: '#161b22',
        ghBorder: '#30363d',
        ghText: '#c9d1d9',
        ghMuted: '#8b949e',
        ghAccent: '#58a6ff',
        ghGreen: '#238636',
        ghGreenHover: '#2ea043',
        ghRed: '#f85149',
        ghYellow: '#e3b341',
        ghOrange: '#f0883e',
        ghBtnBg: '#21262d',
        ghSuccess: '#3fb950',
      },
      // Smooth animation for loading states
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};