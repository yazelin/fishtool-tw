// @ts-check
import { defineConfig } from 'astro/config';

// 部署到 GitHub Pages 時：site = "https://<user>.github.io"，base = "/<repo>"
// 自訂網域時：site = "https://fishtool.tw"，base 留空
export default defineConfig({
  site: process.env.SITE_URL ?? 'https://example.github.io',
  base: process.env.BASE_PATH ?? '/fishtool-tw',
  trailingSlash: 'never',
  build: {
    assets: '_assets',
  },
});
