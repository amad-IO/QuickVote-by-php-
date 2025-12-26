module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
        }
      },
      boxShadow: {
        'glow': '0 0 20px rgba(168, 85, 247, 0.5)',
        'glow-sm': '0 0 10px rgba(168, 85, 247, 0.3)',
        'glow-indigo': '0 10px 30px rgba(99, 102, 241, 0.4)',
      },
      transitionDuration: {
        '300': '300ms',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
};