module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./styles/**/*.css"
  ],
  theme: {
    extend: {
      /* ============================================================
         COLORS
      ============================================================ */
      colors: {
        primary: '#5363ff',
        primary2: '#7c89ff',
        bullish: '#22ff88',
        bearish: '#ff5555',
        neutral: '#9aa0c8',
        card: '#0B1220',
        surface: '#161c2e',
      },

      /* ============================================================
         SPACING
      ============================================================ */
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '32px',
      },

      /* ============================================================
         BORDER RADIUS
      ============================================================ */
      borderRadius: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        'card': '18px',
      },

      /* ============================================================
         SHADOWS
      ============================================================ */
      boxShadow: {
        'sm': '0 2px 8px rgba(0, 0, 0, 0.15)',
        'md': '0 6px 22px rgba(3, 6, 23, 0.6)',
        'lg': '0 14px 40px rgba(3, 6, 23, 0.55)',
        'xl': '0 20px 60px rgba(0, 0, 0, 0.45)',
      },

      /* ============================================================
         KEYFRAMES & ANIMATIONS
      ============================================================ */
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        fadeSlide: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' }
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' }
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' }
        }
      },

      animation: {
        fadeIn: 'fadeIn 0.3s ease-out',
        fadeInUp: 'fadeInUp 0.5s ease-out forwards',
        fadeSlide: 'fadeSlide 0.35s ease-out',
        slideUp: 'slideUp 0.3s ease-out',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        marquee: 'marquee 18s linear infinite',
        shimmer: 'shimmer 2s infinite',
        bounce: 'bounce 1s infinite'
      },

      /* ============================================================
         TRANSITIONS
      ============================================================ */
      transitionDuration: {
        'fast': '150ms',
        'base': '250ms',
        'slow': '350ms'
      },
      transitionTimingFunction: {
        'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'ease-out': 'cubic-bezier(0.4, 0, 0.6, 1)'
      },

      /* ============================================================
         FONT SIZING (Responsive)
      ============================================================ */
      fontSize: {
        'xs': ['12px', { lineHeight: '16px' }],
        'sm': ['14px', { lineHeight: '20px' }],
        'base': ['16px', { lineHeight: '24px' }],
        'lg': ['18px', { lineHeight: '28px' }],
        'xl': ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
      }
    },
  },
  plugins: [],
};
