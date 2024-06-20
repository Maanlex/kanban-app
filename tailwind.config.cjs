/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
      extend: {}
    },
    plugins: [require('daisyui')],
    daisyui: {
      darkTheme: "synthwave",
      themes: ["synthwave", "cupcake"],
    },
  };

