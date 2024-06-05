/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'media',
  content: [
    "./src/**/*.{html,ts}",

  ],
  variants: {
    extend: {
      display: ['group-hover'],
    },
  },
  theme: {
    extend: {
      alignSelf: {
        'bottom': 'flex-end',
      }
    },
    fontFamily: {
      'Kanit': ['Kanit'],
      'Raleway': ['Raleway'],
      'mono': ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      'sans': ['ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"Noto Sans"', 'sans-serif'],
    },
    keyframes: {
      gradient: {
        '0%': { 'background-size': '200% 200%', 'background-position': '0% 50%' },
        '50%': { 'background-position': '100% 50%' },
        '100%': { 'background-position': '0% 50%' },
      }
    },

  },
  daisyui: {
    themes: [
      {
        meetoaplaydarktheme: {

          "primary": "#8b5cf6",

          "primary-content": "#171717",

          "secondary": "#38bdf8",

          "secondary-content": "#010d15",

          "accent": "#00ffff",

          "accent-content": "#001616",

          "neutral": "#e5e7eb",

          "neutral-content": "#171717",

          "base-100": "#171717",

          "base-200": "#262626",

          "base-300": "#404040",

          "base-content": "#e5e5e5",

          "info": "#5a97fa",

          "info-content": "#171717",

          "success": "#4ade80",

          "success-content": "#171717",

          "warning": "#facc15",

          "warning-content": "#171717",

          "error": "#e64747",

          "error-content": "#f3f4f6",
        },
      },
    ],
  },
  plugins: [
    function ({ addComponents }) {
      const components = {
        '.container': {
          '@apply bg-neutral-900 text-neutral-200 p-4 rounded-box': {},
        },
        '.myinput': {
          '@apply bg-neutral-700 text-neutral-200 p-2 rounded-md w-full h-10 border border-gray-500': {},
        }
      }

      addComponents(components)
    },
    require('daisyui')
  ],
}
