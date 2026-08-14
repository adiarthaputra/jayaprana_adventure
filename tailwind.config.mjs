/** @type {import('tailwindcss').Config} */
export default {
    content: [
      './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            blue: '#1E40AF', // Blue color
            dark: '#1F2937', // Dark/Near black
            white: '#F9FAFB', // White
          },
        },
      },
    },
    plugins: [],
  };