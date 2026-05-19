// Helpers for working with Content Collections.
// 提供從商品名稱抓品牌、價格格式化等共用函式。
import { getCollection, type CollectionEntry } from 'astro:content';

/**
 * 產出含 base path 的網址。確保 base 與 path 之間恰好一個斜線，
 * 避免 import.meta.env.BASE_URL 有無尾斜線造成連結錯誤。
 *
 * @param path 「不含 base」的路徑，例如 "categories/643"、"products/216276" 或 ""
 */
export function url(path: string = ''): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  const p = path.replace(/^\/+/, '');
  if (!p) return base + '/';
  return `${base}/${p}`;
}

export type Product = CollectionEntry<'products'>['data'];
export type Category = CollectionEntry<'categories'>['data'];
export type Menu = CollectionEntry<'menus'>['data'];

const BRAND_RE = /^[《【(]([^》】)]+)[》】)]/;

export function extractBrand(name: string | null | undefined): string | null {
  if (!name) return null;
  const m = name.match(BRAND_RE);
  return m ? m[1] : null;
}

export function formatPrice(n: number | null | undefined): string {
  if (n == null) return '—';
  return `$${n.toLocaleString('zh-Hant')}`;
}

export function pickThumb(product: Product): string | null {
  return product.thumb_images?.[0] ?? null;
}

export async function loadProductMap(): Promise<Map<number, Product>> {
  const entries = await getCollection('products');
  return new Map(entries.map((e) => [e.data.pid, e.data]));
}

export async function loadCategoryMap(): Promise<Map<number, Category>> {
  const entries = await getCollection('categories');
  return new Map(entries.map((e) => [e.data.sid, e.data]));
}

export async function loadMenuList(): Promise<Menu[]> {
  const entries = await getCollection('menus');
  return entries
    .map((e) => e.data)
    .sort((a, b) => a.menu_id - b.menu_id);
}
