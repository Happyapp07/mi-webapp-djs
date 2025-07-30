/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Galaxy Colors
        brimfull: {
          primary: '#FF6F1F',
          secondary: '#1FAEFF',
          house: {
            primary: '#92d5c9',
            secondary: '#00b389'
          },
          techno: {
            primary: '#b6f3f3',
            secondary: '#6eb0ff'
          },
          progressive: {
            primary: '#db98f2',
            secondary: '#c768e3'
          },
          trance: {
            primary: '#b9d2f5',
            secondary: '#4e85ff'
          }
        },
        burning: {
          primary: '#D81E5B',
          secondary: '#8B00FF',
          reggaeton: {
            primary: '#ffa5a5',
            secondary: '#ff7d7d'
          },
          dembow: {
            primary: '#ffc987',
            secondary: '#fdae4f'
          },
          electrolatino: {
            primary: '#ffd1e2',
            secondary: '#f180ae'
          },
          mamboton: {
            primary: '#f7c67c',
            secondary: '#f7a349'
          }
        },
        bright: {
          primary: '#FFD700',
          secondary: '#3C3C3C',
          funky: {
            primary: '#ffe57f',
            secondary: '#ffb347'
          },
          rnb: {
            primary: '#d2bfff',
            secondary: '#ab8aff'
          },
          trap: {
            primary: '#c2c2c2',
            secondary: '#7e7e7e'
          },
          gangsta: {
            primary: '#000000',
            secondary: '#5a5a5a'
          }
        },
        breaker: {
          primary: '#00FF9C',
          secondary: '#111111',
          drumandbass: {
            primary: '#fffb99',
            secondary: '#d6db4a'
          },
          breakbeat: {
            primary: '#91ffbf',
            secondary: '#33ff99'
          },
          dubstep: {
            primary: '#e7b9ff',
            secondary: '#a262f7'
          },
          hardcore: {
            primary: '#ff3c3c',
            secondary: '#c10000'
          }
        },
        space: {
          950: '#050314',
          900: '#0A0A0A',
          800: '#111111',
          700: '#1A1A1A',
          600: '#242424',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Orbitron', 'sans-serif'],
        mono: ['Share Tech Mono', 'monospace'],
      },
      keyframes: {
        'portal-spin': {
          '0%': { transform: 'rotate(0deg) scale(1)' },
          '50%': { transform: 'rotate(180deg) scale(1.5)' },
          '100%': { transform: 'rotate(360deg) scale(1)' },
        },
        'hologram-flicker': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 },
          '25%, 75%': { opacity: 0.9 },
        },
        'scanner-line': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(100%)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': {
            boxShadow: '0 0 5px theme("colors.brimfull.primary"), 0 0 20px theme("colors.brimfull.primary")',
          },
          '50%': {
            boxShadow: '0 0 10px theme("colors.brimfull.primary"), 0 0 30px theme("colors.brimfull.primary")',
          },
        },
      },
      animation: {
        'portal-spin': 'portal-spin 2s ease-in-out infinite',
        'hologram-flicker': 'hologram-flicker 2s ease-in-out infinite',
        'scanner-line': 'scanner-line 2s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      backgroundImage: {
        'space-gradient': 'radial-gradient(circle at center, var(--tw-gradient-stops))',
        'hologram-grid': 'linear-gradient(0deg, rgba(30,144,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(30,144,255,0.1) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
};