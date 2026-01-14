/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Discord-like color scheme
        background: {
          primary: '#36393f',
          secondary: '#2f3136',
          tertiary: '#202225',
          accent: '#5865f2',
        },
        text: {
          primary: '#dcddde',
          secondary: '#b9bbbe',
          muted: '#72767d',
        },
        border: {
          primary: '#202225',
          secondary: '#2f3136',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}