/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        adworks: {
          bg: '#F6F7FB',
          surface: '#FFFFFF',
          dark: '#0B1220',
          muted: '#5B667A',
          border: '#E6E9F2',
          blue: '#1E5BFF',
          blueTint: '#EEF3FF',
        },
        status: {
          success: '#16A34A',
          successTint: '#EAF7EF',
          warning: '#F59E0B',
          warningTint: '#FFF4E5',
          danger: '#EF4444',
          dangerTint: '#FFECEC',
          info: '#0EA5E9',
          infoTint: '#E8F6FE',
        }
      },
      borderRadius: {
        'adw': '10px',
        'adw-lg': '14px',
      },
      boxShadow: {
        'adw-card': '0 6px 18px rgba(16, 24, 40, 0.08)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
