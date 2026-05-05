import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://getnestdaily.xyz',
  base: '/',
  output: 'static',
  trailingSlash: 'always',

  build: {
    format: 'directory'
  },

  integrations: [sitemap()],
  adapter: cloudflare()
});