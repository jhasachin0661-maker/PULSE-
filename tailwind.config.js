/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#101820',
          canvas: '#101820',
          darker: '#0B1117',
          lighter: '#141E28',
        },
        navy: {
          DEFAULT: '#172631',
          panel: '#172631',
          light: '#1D303E',
        },
        graphite: {
          DEFAULT: '#203541',
          surface: '#203541',
          light: '#284352',
          lighter: '#304F60',
        },
        lime: {
          DEFAULT: '#C6F36B',
          signal: '#C6F36B',
          hover: '#D4F788',
          glow: 'rgba(198, 243, 107, 0.15)',
        },
        mint: {
          DEFAULT: '#63D6B1',
          available: '#63D6B1',
          subtle: 'rgba(99, 214, 177, 0.12)',
          border: 'rgba(99, 214, 177, 0.3)',
        },
        amber: {
          DEFAULT: '#F2B45B',
          warm: '#F2B45B',
          subtle: 'rgba(242, 180, 91, 0.12)',
          border: 'rgba(242, 180, 91, 0.3)',
        },
        coolwhite: {
          DEFAULT: '#F2F5F2',
          text: '#F2F5F2',
        },
        slate: {
          muted: '#91A2A8',
          subtle: '#6A7D85',
        },
        hairline: {
          DEFAULT: '#344852',
          subtle: '#253742',
        },
      },
      fontFamily: {
        heading: ['Manrope', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'panel': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
        'card': '0 2px 10px rgba(0, 0, 0, 0.35)',
        'glow-lime': '0 0 15px rgba(198, 243, 107, 0.25)',
      },
      transitionDuration: {
        'default': '180ms',
      }
    },
  },
  plugins: [],
}
