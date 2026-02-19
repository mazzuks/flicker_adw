/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: '#e2e8f0',
        background: '#ffffff',
        foreground: '#000000',
        primary: '#0047FF',
        muted: '#64748b',
        danger: '#ef4444',
        warning: '#f59e0b',
        success: '#22c55e',
      },
      borderRadius: {
        none: '0',
        sm: '2px',
        DEFAULT: '4px',
        md: '6px',
        lg: '8px',
      },
    },
  },
  plugins: [],
};
