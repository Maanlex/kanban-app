import { addDynamicIconSelectors } from '@iconify/tailwind';
/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
      extend: {}
    },
    plugins: [require('daisyui'),
      addDynamicIconSelectors(),
    ],
    daisyui: {
      darkTheme: "synthwave",
      themes: ["synthwave", "valentine"],
    },
  };

