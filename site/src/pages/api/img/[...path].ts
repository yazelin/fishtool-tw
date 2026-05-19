// SSR image proxy: 讓瀏覽器透過我們的 HTTPS 拿原站 (http://fishtool.tw) 的圖。
// 路徑對應：/api/img/<filename> → http://fishtool.tw/images188/<filename>
// 用 Vercel function 的下游回應 cache header 讓 CDN 替我們 hold。
// 長期方案：把 21GB 圖遷到 R2，這個 proxy 是過渡期。

import type { APIRoute } from 'astro';

const ORIGIN_BASE = 'http://fishtool.tw/images188';

// 1 年（圖片不會變）
const CACHE_HEADERS = {
  'Cache-Control': 'public, max-age=31536000, s-maxage=31536000, immutable',
  'CDN-Cache-Control': 'public, max-age=31536000',
  'Vercel-CDN-Cache-Control': 'public, max-age=31536000, immutable',
};

export const GET: APIRoute = async ({ params }) => {
  const path = params.path ?? '';
  if (!path || path.includes('..')) {
    return new Response('Bad request', { status: 400 });
  }

  const upstreamUrl = `${ORIGIN_BASE}/${path}`;
  try {
    const res = await fetch(upstreamUrl);
    if (!res.ok) {
      return new Response('Upstream error', { status: res.status });
    }
    const contentType = res.headers.get('content-type') ?? 'image/jpeg';
    const body = await res.arrayBuffer();
    return new Response(body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        ...CACHE_HEADERS,
      },
    });
  } catch (e) {
    return new Response('Fetch failed', { status: 502 });
  }
};
