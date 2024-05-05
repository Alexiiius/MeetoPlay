/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'media',
  content: [
    "./src/**/*.{html,ts}",

  ],
  theme: {
    fontFamily: {
      'Kanit': ['Kanit'],
      'Raleway': ['Raleway'],
    },
    keyframes: {
      gradient: {
        '0%': { 'background-size': '200% 200%', 'background-position': '0% 50%' },
        '50%': { 'background-position': '100% 50%' },
        '100%': { 'background-position': '0% 50%' },
      }
    },

  },
  plugins: [
    function ({ addComponents }) {
      const components = {
        '.container': {
          '@apply dark:bg-neutral-900 dark:text-neutral-200 bg-neutral-300 text-neutral-900 p-6 rounded-xl': {},
        },
        '.myinput': {
          '@apply dark:bg-neutral-700 dark:text-neutral-200 bg-neutral-100 text-neutral-900 p-2 rounded-md w-full h-10 border border-gray-500 focus:ring-1 focus:ring-purple-500 focus:border-purple-500': {},
        },
        '.mybtn': {
          '@apply dark:bg-neutral-700 dark:text-neutral-200 bg-neutral-300 text-neutral-900 p-2 rounded-md shadow-lg': {},
        },
        '.btn-disabled': {
          '@apply dark:bg-neutral-700/60 dark:text-neutral-400 bg-neutral-200 text-neutral-500 p-2 rounded-md cursor-not-allowed shadow-lg': {},
        },
      }

      addComponents(components)
    },
    require('daisyui')
  ],
}
