/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './*.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef6ff',
          100: '#d9ebff',
          200: '#b7d8ff',
          300: '#86bcff',
          400: '#559cff',
          500: '#2f7ef7',
          600: '#1f63d4',
          700: '#184ea9',
          800: '#173f84',
          900: '#16386c',
          950: '#0f2446',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
