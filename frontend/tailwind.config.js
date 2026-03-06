/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Inter"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        void: '#000000',
        surface: '#000000',
        panel: '#000000',
        border: '#1a1a1a',
        muted: '#1a1a1a',
        accent: '#ffffff',
        'accent-dim': '#e5e5e5',
        warn: '#ffffff',
        danger: '#ffffff',
        ink: '#ffffff',
        'ink-muted': '#737373',
      },
      backgroundImage: {
        'grid-pattern': 'none',
      },
      backgroundSize: {
        grid: '0 0',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease forwards',
        'slide-up': 'slideUp 0.2s ease forwards',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(4px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
