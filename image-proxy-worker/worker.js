// fishtool 圖片代理(止血用):把 HTTP-only origin 的圖以 HTTPS 吐出,CF 邊緣快取。
// 取代原本放在 Vercel 的 /api/img(會吃 Fluid CPU + Fast Origin Transfer)。
// /<檔名> → http://fishtool.tw/images188/<檔名>
const ORIGIN_BASE = 'http://fishtool.tw/images188';

export default {
  async fetch(req) {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      return new Response('Method not allowed', { status: 405 });
    }
    const path = new URL(req.url).pathname.replace(/^\/+/, '');
    if (!path || path.includes('..')) return new Response('Bad request', { status: 400 });

    // cacheEverything + 長 TTL:同一張圖第二次起由 CF 邊緣回,不再打 origin
    const up = await fetch(`${ORIGIN_BASE}/${path}`, {
      cf: { cacheTtl: 31536000, cacheEverything: true },
    });
    if (!up.ok) return new Response('Upstream error', { status: up.status });

    const h = new Headers();
    h.set('Content-Type', up.headers.get('content-type') || 'image/jpeg');
    h.set('Cache-Control', 'public, max-age=31536000, immutable');
    h.set('Access-Control-Allow-Origin', '*');
    return new Response(up.body, { status: 200, headers: h });
  },
};
