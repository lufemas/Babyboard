// astro.config.mjs
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import tailwind from "@tailwindcss/vite";

const isProd = process.env.NODE_ENV === 'production';
const isPages = !!process.env.GITHUB_PAGES; // we'll set this in the Action
console.log('isProd: ', isProd);
console.log('isPages: ', isPages);
export default defineConfig({
  output: 'static',
  integrations: [mdx(), react()],
  vite: {    plugins: [tailwind()]  },
  site:  isProd && isPages ? 'https://lufemas.github.io' : undefined,
  base:  isProd && isPages ? '/Babyboard/' : '/',   // '/' in dev
});
