/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-base':    '#0a0a0f',
        'bg-surface': '#111118',
        'bg-border':  '#1e1e2e',
        'accent-purple': '#7c3aed',
        'accent-cyan':   '#06b6d4',
        'text-primary':  '#f8fafc',
        'text-muted':    '#94a3b8',
        'text-hint':     '#475569',
      },
      fontFamily: {
        syne:       ['Syne', 'sans-serif'],
        pretendard: ['Pretendard', 'system-ui', 'sans-serif'],
      },
      animation: {
        'glow-move': 'glowMove 8s ease-in-out infinite',
      },
      keyframes: {
        glowMove: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%':      { transform: 'translate(30px, -20px) scale(1.05)' },
          '66%':      { transform: 'translate(-20px, 15px) scale(0.97)' },
        },
      },
    },
  },
  plugins: [],
}
