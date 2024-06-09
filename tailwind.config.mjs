/** @type {import('tailwindcss').Config} */
export default {
  content: [
    'resources/**/*.jsx',
    'resources/**/components/*.jsx',
    'resources/**/screens/*.jsx'
  ],
  theme: {
    extend: {
      colors: {
        "primary-100": "#7077A1",
        "primary-300": "#424769",
        "primary-500": "#2D3250",
        "accent-100": "#F3D4BB",
        "accent-200": "#F6B17A",
        "accent-300": "#F19B56",
        "accent-500": "#EC8432",
      }
    },
  },
  plugins: [],
}

