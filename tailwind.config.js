/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0B0B0F',
        surface: '#12121A',
        card: '#1A1A24',
        primary: '#E50914',
        secondary: '#FF3D5A',
        'text-primary': '#FFFFFF',
        'text-secondary': '#A1A1AA',
        border: '#2A2A35',
      },
      fontFamily: {
        sans: ['Rajdhani', 'Inter', 'sans-serif'],
        rajdhani: ['Rajdhani', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        card: '14px',
      },
      backgroundImage: {
        'hero-gradient':
          'linear-gradient(to right, rgba(11,11,15,0.95) 35%, rgba(11,11,15,0.5) 70%, transparent 100%)',
        'card-gradient':
          'linear-gradient(to top, rgba(11,11,15,1) 0%, rgba(11,11,15,0.6) 50%, transparent 100%)',
      },
    },
  },
  plugins: [],
}
