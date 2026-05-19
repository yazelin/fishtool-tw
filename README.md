# fishtool-tw 重建版

把舊版 [fishtool.tw](http://fishtool.tw/)（紅海釣具店；IIS + Classic ASP + FrontPage 4.0 frameset）重建成現代化的靜態網站，準備部署到 GitHub Pages。

## 目錄結構

```
fishtool-tw/
├── docs/
│   └── design.md           # 視覺與互動設計綱要（純文字、不含圖）
├── data/                    # 爬蟲輸出 JSON（fishtool_index.json）
├── raw-html/                # 原站抓回的原始 HTML（不入庫，.gitignore）
├── images/                  # 抓回的商品圖（未來 AI 重新生成時的參考素材）
├── site/                    # Astro v5 靜態站
│   ├── astro.config.mjs
│   ├── package.json
│   └── src/
│       ├── content.config.ts           # Content Collections schema
│       ├── content/data/*.json         # 餵 Astro 的 JSON 內容
│       ├── components/                 # ProductCard、Header、Footer、Breadcrumb
│       ├── layouts/Base.astro
│       ├── lib/data.ts
│       ├── pages/
│       │   ├── index.astro             # 首頁
│       │   ├── menus/[menu_id].astro   # 11 大類
│       │   ├── categories/[sid].astro  # 子分類
│       │   ├── categories/index.astro  # 全部分類
│       │   ├── products/[pid].astro    # 商品詳情
│       │   ├── search.astro
│       │   ├── faq.astro
│       │   ├── inquiry.astro
│       │   └── order.astro
│       └── styles/{tokens.css, global.css}
└── .github/workflows/deploy.yml
```

## 開發

```bash
cd site
npm install
npm run dev    # http://localhost:4321
npm run build  # 產出 site/dist
```

## 內容更新（未來流程）

預期的資料流：

```
排程（GitHub Action）─ → 後端 DB ─ → 產生 JSON ─ → 覆蓋 site/src/content/data/*.json ─ → Astro build ─ → 部 GH Pages
```

開發階段先用爬蟲產出的 `data/fishtool_index.json`，腳本會把其中的 `products[]`、`categories[]`、`menus[]` 切片寫進 `site/src/content/data/*.json`。

## 設計

整站視覺、字級、間距、元件、頁面範本與圖像方向皆寫在 [`docs/design.md`](docs/design.md)。元件與頁面實作以該文件為唯一準則，CSS 變數在 `site/src/styles/tokens.css`。

**目前不產任何圖片**（hero、形象圖、產品圖留 placeholder）。商品圖只下載原站照片當未來 AI 生成的參考素材。

## 部署

GitHub Pages：push 到 `main` 或每天排程觸發。

需要在 repo Settings → Pages 把 source 設為 *GitHub Actions*。

自訂網域請改 `astro.config.mjs` 的 `site` 與 `base`，或設環境變數 `SITE_URL` / `BASE_PATH`。
