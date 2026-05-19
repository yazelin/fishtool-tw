# 紅海釣具 · FishTool.tw

> 把舊版 [fishtool.tw](http://fishtool.tw/)（紅海釣具店；IIS + Classic ASP + FrontPage 4.0 frameset）
> 重建成現代化的 SSR 電商站，部署在 Vercel。

🌐 **線上**：https://fishtool-tw.vercel.app/

---

## 架構（v0.4）

```
GitHub repo ─push─► Vercel ─auto deploy─► fishtool-tw.vercel.app
                       │
                       ├─ Static pages (prerender=true)：
                       │  首頁、分類、menu、search、FAQ、訂單、客服
                       │  ↑ build 時靜態化，CDN 直發
                       │
                       └─ SSR functions：
                          /products/[pid]   ← 20,563 件商品按需 render
                          /api/img/[...path] ← image proxy → fishtool.tw
```

| 維度 | 內容 |
| --- | --- |
| **框架** | Astro v5（hybrid output: 'server'）+ `@astrojs/vercel` adapter |
| **部署** | Vercel（push to main 自動部署，~2 分鐘） |
| **build 時間** | ~50 秒（只 prerender ~650 頁，剩下都 SSR） |
| **商品圖** | 原站 `http://fishtool.tw/images188/*` 透過 `/api/img/...` SSR proxy + 一年 CDN cache |
| **CSS** | 純原生 CSS + tokens.css（沒引入 Tailwind） |
| **字型** | Cormorant Garamond + Noto Serif TC + Inter（Google Fonts swap）|
| **典藏圖片** | 21GB 商品圖在 GitHub Release `v0.1-images`（不入 repo） |

---

## 目錄結構

```
fishtool-tw/
├── README.md
├── docs/
│   ├── design.md                          # 視覺/互動設計綱要（v0.3 premium pivot）
│   └── references/                        # 設計 mockup（codex 生成的視覺稿）
│       ├── homepage-mockup.png            # light 模式
│       └── design-system-overview.png     # dark 模式
├── data/                                  # 爬蟲輸出 JSON（原始）
├── raw-html/                              # 原站抓回的 HTML（.gitignore）
├── images/                                # 21GB 商品圖（.gitignore；走 Release）
├── release-tmp/                           # 切片 tar（.gitignore）
└── site/                                  # Astro 站本體
    ├── astro.config.mjs                   # output: 'server' + Vercel adapter
    ├── package.json
    ├── public/
    │   ├── favicon.svg / favicon.png      # 銅印浮雕識別
    │   ├── og-image.png                   # 1200×630 社群分享圖
    │   ├── logo-brass.png / logo-brass-dark.png  # 原 logo 像素重染雙版
    │   ├── hero/
    │   │   ├── hero-angler.png            # 首頁 hero
    │   │   └── banner-reel.png            # editorial banner
    │   └── banners/                       # 原站 4 張購物資訊 infographic
    └── src/
        ├── content.config.ts              # Content Collections schema
        ├── content/data/                  # products / categories / menus JSON
        ├── components/                    # Brand, Header, Footer, ProductCard, Breadcrumb
        ├── layouts/Base.astro             # OG meta、字型載入、theme toggle FOUC guard
        ├── lib/data.ts                    # 資料 helper + image URL proxy
        ├── pages/
        │   ├── index.astro                # prerender
        │   ├── menus/[menu_id].astro      # prerender
        │   ├── categories/[sid].astro     # prerender
        │   ├── categories/index.astro     # prerender
        │   ├── products/[pid].astro       # SSR（高基數，~20K）
        │   ├── api/img/[...path].ts       # SSR image proxy
        │   ├── search.astro               # prerender + 客端搜尋
        │   ├── faq.astro                  # prerender
        │   ├── inquiry.astro              # prerender（form 為前端占位）
        │   └── order.astro                # prerender（form 為前端占位）
        └── styles/{tokens.css, global.css}
```

---

## 開發

```bash
cd site
npm install
npm run dev    # http://localhost:4321  ← hot reload，看設計改動的最快方式
npm run build  # 完整本機 build（~50s 含 Vercel adapter 包成 functions）
```

> ⚠️ 商品詳情頁是 SSR，`astro preview` 不適用。要本機完整測 SSR，需要 `vercel dev`
> （`npm i -g vercel` + `vercel link`），或直接相信 build → push 上 Vercel 看實際結果。

---

## 部署

**自動**：push 到 `main` → Vercel 偵測到 `astro.config.mjs` 的 Vercel adapter → ~2 分鐘部署完成。

連動是在 Vercel UI 一次性設好的：
- 連結 GitHub repo `yazelin/fishtool-tw`
- Root Directory 設為 `site`
- Framework 自動偵測為 Astro

不需要 GitHub Actions（已移除舊的 `.github/workflows/deploy.yml`）。

### 環境變數

| Vercel env | 用途 |
| --- | --- |
| `SITE_URL` | （選填）絕對網址，用於 OG meta `og:url` 與 sitemap |
| `BASE_PATH` | 在 Vercel **必須空字串或不設**；只有 GH Pages 等子路徑部署才需要 |

---

## 內容更新（資料流）

```
（未來）排程後端 DB ─► 產 JSON ─► 覆寫 site/src/content/data/*.json ─► git push ─► Vercel rebuild（~2 min）
```

開發階段：用爬蟲產出的 `data/fishtool_index.json`，腳本把 `products[]` / `categories[]` / `menus[]` 切片寫進 `site/src/content/data/*.json`。

---

## 設計系統

- 完整規範：[`docs/design.md`](docs/design.md)（v0.3 — premium pivot：米色 + 暖炭 + 黃銅金）
- 視覺 mockup：[`docs/references/homepage-mockup.png`](docs/references/homepage-mockup.png)（light）
  / [`docs/references/design-system-overview.png`](docs/references/design-system-overview.png)（dark）
- 客群定位：成功人士的休閒釣魚生活（Orvis × Monocle × YETI Premium 氣質）
- 標題襯線、無框商品卡、節制配色、攝影為主、不做花車感

---

## 品牌資產

| 檔案 | 來源 | 用途 |
| --- | --- | --- |
| `site/public/logo-brass.png` | codex agent 讀原 logo 後像素重染 | Header / Footer（light 模式） |
| `site/public/logo-brass-dark.png` | 同上、淺 brass + cream calligraphy | Header / Footer（dark 模式） |
| `site/public/favicon.png` | codex-imagegen 生成銅印浮雕 | 瀏覽器 tab / iOS home screen |
| `site/public/favicon.svg` | 手刻 SVG，brass 配色 | 現代瀏覽器向量 favicon |
| `site/public/og-image.png` | codex-imagegen 雜誌封面風 | Facebook / LINE / Twitter 分享預覽 |
| `site/public/hero/hero-angler.png` | codex-imagegen 暖金 hour | 首頁 hero |
| `site/public/hero/banner-reel.png` | codex-imagegen 銅釣輪特寫 | editorial banner |

---

## 商品圖策略

當前：`http://fishtool.tw` 還活著，所有商品圖透過我們的 SSR proxy
`/api/img/<filename>` 取得，套一年 immutable cache，CDN 命中後不打原站。

長期計畫：把 21GB 圖搬到 **Cloudflare R2**（egress 零成本），原站隨時可下線。
搬遷時需要：
1. Cloudflare API token 含 R2 寫入權限
2. 一次性上傳腳本
3. `lib/data.ts` 的 `proxyImg()` 改成指向 R2 公開 URL

原始圖檔典藏：GitHub Release [`v0.1-images`](https://github.com/yazelin/fishtool-tw/releases/tag/v0.1-images)（21GB 切 11 個 tar）。

---

## 已實作功能 vs 仍是占位

| | 狀態 |
| --- | --- |
| 瀏覽商品、分類、menu | ✅ 真實資料 |
| 搜尋（client-side full-text on 20K SKU）| ✅ 即時可用 |
| 篩選 / 排序（分類頁）| ✅ client-side |
| 商品詳情頁圖庫切換 | ✅ |
| 手機 sticky 加入購物車條 | ✅ UI、未接後端 |
| 加入購物車 / 結帳 | ❌ 純 UI 占位（disabled）|
| 訂單查詢 form | ❌ 純 UI 占位 |
| 客服詢問 form | ❌ 純 UI 占位 |
| 會員 / 登入 | ❌ 未做 |
| 線上聊聊 | 🔗 連結到原站 `chat_front.asp`（外開）|

要做真電商需要加：DB（Supabase / Neon）+ Vercel function API + 金流（綠界 / 街口 / LinePay）+ 物流整合。估算 2-3 週工。

---

## 聯絡

| | |
| --- | --- |
| 電話 | 03-4951686 |
| Email | service@fishtool.tw |
| LINE | fishtool2012 |
| Facebook | [中壢紅海釣具粉絲團](https://www.facebook.com/groups/809912915726639/) |
| 地址 | 中壢市民族路二段 110 號 |
| 門市營業 | 週一至週六 10:00–22:00 / 週日 10:00–18:00 |
