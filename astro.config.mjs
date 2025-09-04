// astro.config.mjs
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [mdx(), react()],
  output: 'static',
  // site: 'https://<your-username>.github.io/baby-recipes',
});
