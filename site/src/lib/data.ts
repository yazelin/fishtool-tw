// Helpers for working with Content Collections.
// 提供從商品名稱抓品牌、價格格式化等共用函式。
import { getCollection, type CollectionEntry } from 'astro:content';

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
