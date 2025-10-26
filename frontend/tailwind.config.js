/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        caslon: ['var(--font-caslon)', 'serif'],
        dm: ['var(--font-dm)', 'sans-serif'],
        pixel: ['var(--font-pixel)', 'sans-serif'],
      },
      colors: {
        'page-bg': '#F2E3EC',
        'button-bg': '#D4C7B9',
        'card-border': '#EAB6C2',
        'card-inner': '#FFF7FC',
        'card-text': '#451900',
      },
      animation: {
        'fadeIn': 'fadeIn 0.6s ease-in',
        'floatFlower': 'floatFlower 4s ease-in-out infinite',
        'pulse': 'pulse 3s ease-in-out infinite',
        'float1': 'float1 6s ease-in-out infinite',
        'float2': 'float2 5s ease-in-out infinite',
        'float3': 'float3 7s ease-in-out infinite',
        'rotate': 'rotate 20s linear infinite',
        'scroll-left': 'scroll-left 70s linear infinite',
        'scroll-right': 'scroll-right 70s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        floatFlower: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(5deg)' },
        },
        pulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        float1: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(20px, -20px)' },
        },
        float2: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(-15px, 15px)' },
        },
        float3: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(10px, -25px)' },
        },
        rotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'scroll-left': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'scroll-right': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
