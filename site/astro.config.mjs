// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

// 部署模式：
// - Vercel（預設）：output 'server'，base 空字串，products/[pid] 走 SSR
// - GitHub Pages：env BASE_PATH=/fishtool-tw（在 workflow 設）；但因為已切 SSR
//   靜態 fallback 已不適用，舊 deploy.yml 之後可以停用或改 build 'static'。
export default defineConfig({
  site: process.env.SITE_URL ?? 'https://example.github.io',
  base: process.env.BASE_PATH ?? '',
  trailingSlash: 'never',
  output: 'server',
  adapter: vercel({
    webAnalytics: { enabled: false },
    edgeMiddleware: true,
  }),
  build: {
    assets: '_assets',
  },
});
