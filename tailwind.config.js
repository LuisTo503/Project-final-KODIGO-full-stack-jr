import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './resources/**/*.blade.php',
        './resources/**/*.jsx',
        './resources/**/*.js',
        './resources/**/*.vue',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
        },
    },
    plugins: [require('daisyui')],
    daisyui: {
      themes: [
        "light",
        "dark",
        "cupcake",
        "corporate",
        "dracula",
        "synthwave",
        "coffee",
      ],
      darkTheme: "dark", // Puedes cambiar esto al tema que prefieras para dark mode
      base: true,
      styled: true,
      utils: true,
    },
  };