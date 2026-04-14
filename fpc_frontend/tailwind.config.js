/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"], // esto le dice a Tailwind dónde buscar clases para generar el CSS
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        "background": "#0e0e0e",
        "primary": "#95aaff",
        "primary-dim": "#3766ff",
        "secondary": "#2ff801",
        "surface-container": "#1a1a1a",
        "on-surface": "#ffffff",
        "on-surface-variant": "#adaaaa",
        //  aquí van los colores del JSON de Stitch 
      },
      fontFamily: {
        "headline": ["Space Grotesk", "sans-serif"],
        "body": ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [require('@tailwindcss/forms')], // esto hace que los formularios se vean mejor con Tailwind
}