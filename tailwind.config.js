/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'bg-base': '#080C14',
        'bg-surface': '#0E1420',
        'bg-elevated': '#141B2D',
        'bg-input': '#0A0F1A',
        'border-dim': '#1A2238',
        'border-active': '#2A3A5C',
        'text-primary': '#E8EDF5',
        'text-secondary': '#8B95A8',
        'text-muted': '#4A5568',
        'accent-blue': '#3B82F6',
        'accent-blue-dim': '#1E3A5F',
        'accent-cyan': '#06B6D4',
        'accent-cyan-dim': '#0A2A35',
        'success': '#10B981',
        'success-dim': '#0A2419',
        'danger': '#EF4444',
        'danger-dim': '#2A1010',
        'warning': '#F59E0B',
        'warning-dim': '#1A1200',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}