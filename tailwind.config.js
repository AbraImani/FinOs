/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        finos: {
          bg: '#0F172A',
          card: '#1E293B',
          accent: '#22C55E',
          danger: '#EF4444',
          text: '#E2E8F0',
          muted: '#94A3B8',
          border: '#334155',
          'card-hover': '#263548',
          warning: '#F59E0B',
          info: '#3B82F6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
