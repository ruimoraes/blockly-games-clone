/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cores da marca Blockly NT
        brand: {
          50: '#fef7ee',
          100: '#fdebd3',
          200: '#fbd3a5',
          300: '#f7b36d',
          400: '#f28a32',
          500: '#ed1b2f', // Cor principal
          600: '#de4e32',
          700: '#c73e2b',
          800: '#9f3429',
          900: '#812d25',
          950: '#461412',
        },
        // Gradiente cores para jogos
        game: {
          primary: '#ED1B2F',
          secondary: '#ED0973',
          tertiary: '#B624C0',
          quaternary: '#9333EA',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
