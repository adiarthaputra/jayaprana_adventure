import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

export default defineConfig({
  // output: 'server', // Dihapus karena GitHub Pages wajib 'static' (default)
  site: 'https://adiarthaputra.github.io', // URL utama GitHub Pages kamu
  base: '/jayaprana_adventure', // Nama repositori kamu (wajib diawali garis miring)
  integrations: [tailwind(), react()],
});