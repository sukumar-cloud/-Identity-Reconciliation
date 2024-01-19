/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Syne"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        void: '#050508',
        surface: '#0d0d14',
        panel: '#12121c',
        border: '#1e1e2e',
        muted: '#2a2a3d',
        accent: '#00f5c4',
        'accent-dim': '#00c49a',
        warn: '#f5a623',
        danger: '#ff4757',
        ink: '#e8e8f0',
        'ink-muted': '#8888a8',
      },
      backgroundImage: {
        'grid-pattern': `linear-gradient(rgba(0,245,196,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,245,196,0.03) 1px, transparent 1px)`,
      },
      backgroundSize: {
        grid: '40px 40px',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-up': 'slideUp 0.4s ease forwards',
        'pulse-accent': 'pulseAccent 2s ease-in-out infinite',
        'scan': 'scan 3s linear infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        pulseAccent: { '0%,100%': { boxShadow: '0 0 0 0 rgba(0,245,196,0.3)' }, '50%': { boxShadow: '0 0 0 8px rgba(0,245,196,0)' } },
        scan: { '0%': { transform: 'translateY(-100%)' }, '100%': { transform: 'translateY(400%)' } },
      },
    },
  },
  plugins: [],
}
