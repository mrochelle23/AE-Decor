module.exports = {
  purge: ['./src/**/*.{html,js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false,
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
  
  theme: {
    extend: {
      screens: {
        'max-834px': { 'max': '834px' }, // Custom screen size for max-width 834px
      },
    },
  },
}