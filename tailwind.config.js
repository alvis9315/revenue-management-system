/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'header-gradient': 'linear-gradient(135deg, #00488b 0%, #55cfff 100%)',
        'primary-1000': 'linear-gradient(135deg, #00488b 0%, #55cfff 100%)',
      },
      colors: {
        // 品牌色彩 - 參考 Miller Lite 配色
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#002868',  // 深藍主色
        },
        accent: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
          950: '#D4AF37',  // 金色輔助色
        }
      }
    },
  },
  plugins: [],
}