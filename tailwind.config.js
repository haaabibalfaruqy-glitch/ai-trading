module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5363ff',
        primary2: '#7c89ff',
      },
      keyframes: {
  fadeSlide: {
    '0%': { opacity: 0, transform: 'translateY(8px)' },
    '100%': { opacity: 1, transform: 'translateY(0)' },
  },
},
animation: {
  fadeSlide: 'fadeSlide 0.35s ease-out',
},
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' }
        }
      },
      animation: {
        marquee: 'marquee 18s linear infinite'
      }
    },
  },
  plugins: [],
};
