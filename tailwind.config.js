/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        adworks: {
          blue: '#0047FF',
          dark: '#0A0A0B',
          gray: '#F8F9FA',
          accent: '#00D1FF'
        }
      },
      borderRadius: {
        'adw': '0.5rem',
      },
      boxShadow: {
        'adw-soft': '0 4px 20px -2px rgba(0, 71, 255, 0.05)',
      }
    },
  },
  plugins: [],
};
