/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        adworks: {
          blue: '#0047FF',
          dark: '#0A0A0B',
          gray: '#F1F5F9', // Neutro moderno
          accent: '#00D1FF',
          surface: '#FFFFFF',
          card: '#FFFFFF'
        },
        chart: {
          blue: '#0047FF',
          purple: '#8B5CF6',
          cyan: '#22D3EE',
          green: '#10B981',
          orange: '#F59E0B'
        }
      },
      borderRadius: {
        'adw': '1rem',
        'adw-lg': '1.5rem',
        'adw-xl': '2.5rem',
      },
      boxShadow: {
        'adw-soft': '0 10px 40px -10px rgba(0, 71, 255, 0.08)',
        'adw-inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
