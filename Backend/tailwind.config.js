import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
                'Kanit': ['Kanit'],
                'Raleway': ['Raleway'],
                'mono': ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
                'sans': ['ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"Noto Sans"', 'sans-serif'],
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

    plugins: [forms, require('daisyui')],
};
