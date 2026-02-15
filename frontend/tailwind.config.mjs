/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        kallpa: {
          gold: '#FFD700',
          fire: '#FF4500',
          teal: '#008B8B',
          dark: '#0A0A0A',
          surface: '#1A1A1A',
          text: '#F5F5F5',
          muted: '#B0B0B0'
        }
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        display: ['Cinzel', 'serif'],
      },
      boxShadow: {
        'fire-glow': '0 0 20px rgba(255, 69, 0, 0.5)',
        'gold-glow': '0 0 15px rgba(255, 215, 0, 0.4)',
      },
      backgroundImage: {
        'chakana-pattern': "url('/assets/chakana-pattern.png')", // Crear asset SVG/PNG
      }
    }
  },
  plugins: [],
}
