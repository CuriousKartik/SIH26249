/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ops: {
          bg: '#070b12',
          surface: '#0d1522',
          card: '#111c2e',
          cardHover: '#16233a',
          border: '#1f2e47',
          cyan: '#06b6d4',
          cyanGlow: '#22d3ee',
          amber: '#f59e0b',
          red: '#ef4444',
          green: '#10b981',
          textMuted: '#8194b0',
        }
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
      },
      boxShadow: {
        'cyan-glow': '0 0 15px -3px rgba(6, 182, 212, 0.3)',
        'amber-glow': '0 0 15px -3px rgba(245, 158, 11, 0.3)',
        'red-glow': '0 0 15px -3px rgba(239, 68, 68, 0.35)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' }
        }
      }
    },
  },
  plugins: [],
}
