/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        adworks: {
          blue: '#0047FF',
          dark: '#0F172A',
          gray: '#F8FAFC',
          muted: '#64748B',
          border: '#E2E8F0',
          surface: '#FFFFFF',
          accent: '#F1F5F9'
        },
        status: {
          success: { bg: '#F0FDF4', text: '#166534', border: '#DCFCE7' },
          warning: { bg: '#FFFBEB', text: '#92400E', border: '#FEF3C7' },
          error: { bg: '#FEF2F2', text: '#991B1B', border: '#FEE2E2' },
          info: { bg: '#EFF6FF', text: '#1E40AF', border: '#DBEAFE' }
        }
      },
      borderRadius: {
        'adw': '12px',
        'adw-lg': '14px',
      },
      boxShadow: {
        'adw-flat': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        'adw-card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
