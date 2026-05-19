// Astro Content Collections schema for fishtool-tw.
// 與 ../data/*.json 對齊；爬蟲產出後直接覆蓋這幾個檔即可重 build。
import { defineCollection, z } from 'astro:content';
import { file } from 'astro/loaders';

const products = defineCollection({
  loader: file('src/content/data/products.json'),
  schema: z.object({
    pid: z.number(),
    sku: z.string().nullable(),
    name: z.string().nullable(),
    price: z.number().nullable(),
    sale_price: z.number().nullable(),
    breadcrumb: z.array(z.string()).default([]),
    description: z.string().nullable().optional(),
    thumb_images: z.array(z.string()).default([]),
    detail_images: z.array(z.string()).default([]),
    related_pids: z.array(z.number()).default([]),
    url: z.string().optional(),
  }),
});

const categories = defineCollection({
  loader: file('src/content/data/categories.json'),
  schema: z.object({
    sid: z.number(),
    name: z.string(),
    breadcrumb: z.array(z.string()).default([]),
    url: z.string().optional(),
    total_count: z.number().default(0),
    all_product_ids: z.array(z.number()).default([]),
  }),
});

const menus = defineCollection({
  loader: file('src/content/data/menus.json'),
  schema: z.object({
    menu_id: z.number(),
    name: z.string(),
    url: z.string().optional(),
    subcategories: z
      .array(z.object({ sid: z.number(), name: z.string() }))
      .default([]),
  }),
});

export const collections = { products, categories, menus };
