import { defineMiddleware } from 'astro:middleware';

// robots.txt 只是建議，這裡是硬擋：不管 bot 理不理會 Disallow 都直接 403。
// 跑在 Vercel Edge（見 astro.config.mjs 的 edgeMiddleware: true），擋下來的請求
// 不會進 serverless function，才真的省得到 Fluid CPU + Origin Transfer。
const BLOCKED_UA = [
  'ClaudeBot',
  'GPTBot',
  'ChatGPT-User',
  'CCBot',
  'Bytespider',
  'PerplexityBot',
  'Google-Extended',
  'Amazonbot',
  'Applebot-Extended',
];

export const onRequest = defineMiddleware((context, next) => {
  if (context.url.pathname.startsWith('/products/')) {
    const ua = context.request.headers.get('user-agent') ?? '';
    if (BLOCKED_UA.some((bot) => ua.includes(bot))) {
      return new Response('Blocked', { status: 403 });
    }
  }
  return next();
});
