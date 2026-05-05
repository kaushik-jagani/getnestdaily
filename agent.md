# TrendBriefly — Agent Instructions

> **READ THIS FIRST before making ANY changes to this project.**

## Project Overview

| Property | Value |
|----------|-------|
| Brand | TrendBriefly |
| Domain | https://getnestdaily.xyz |
| Framework | Astro 6.2.x (Static Site Generator) |
| Hosting | Cloudflare Pages |
| Content | Markdown files with HTML body in `src/content/posts/` |

---

## Documentation Index

| Document | Purpose | When to Read |
|----------|---------|--------------|
| `docs/ADD-NEW-POST.md` | **How to create posts** — frontmatter schema, image rules, SEO requirements, common mistakes | Before creating or editing ANY post |
| `docs/BRAND-CONFIG.md` | **All brand-specific values** — categories, authors, analytics IDs, SEO defaults | Before making brand/config decisions |
| `docs/THEME-CUSTOMIZATION.md` | **What to change when copying theme** — brand vs reusable files | When setting up for a new site |
| `docs/SYNC-GUIDE.md` | **How to sync features between projects** — never copy whole files, apply surgically | Before porting features from another project |
| `docs/ADSENSE-RULES.md` | Content policy compliance rules | Before writing content |

---

## Critical Rules (Quick Reference)

### Image Paths
```yaml
# ✅ CORRECT — relative path (for self-hosted images)
image: "assets/images/posts/{slug}/featured.jpg"

# ✅ CORRECT — full URL (for external/CDN images)
image: "https://cdn.example.com/image.jpg"
image: "https://images.unsplash.com/photo-123..."

# ❌ WRONG — leading slash (breaks OG meta resolution)
image: "/assets/images/posts/..."
```

**Rule:** Use relative path (no leading `/`) for local images in `public/`. Use full `https://` URL for external images. Never use a leading slash.

### Valid Categories (ONLY these)
`technology` | `artificial-intelligence` | `software` | `gadgets` | `productivity` | `business-and-industry` | `energy-market-trends`

### SEO Requirements (Every Post)
- `title`: 50–65 characters with primary keyword
- `meta_description`: 150–160 characters, never empty
- `keywords`: 5–10 items, never empty
- `reading_time`: `"X min"` format (words ÷ 200)
- Content: minimum 1000 words, 5+ `<h2>` sections
- Internal links: 2+ links to other posts (trailing slash required)

### Authors
- `Kaushik Jagani` — primary author
- `Global Info Nest Team` — team articles

---

## Project Structure

```
src/
  content/posts/       ← Blog post markdown files (SOURCE OF TRUTH)
  pages/
    index.astro        ← Homepage
    blog/[slug].astro  ← Individual post pages (auto-generated from content)
    pages/
      blog/            ← Blog listing
      category/[slug]  ← Category archives (auto-generated)
      about/           ← About page
      contact/         ← Contact page
  components/          ← Reusable UI components
  layouts/             ← BaseLayout (HTML shell, meta, analytics)
  lib/posts.ts         ← Post utilities (getAllPosts, categories, etc.)
  styles/              ← CSS (variables.css for theming)
public/
  assets/images/posts/ ← Post images (featured + in-article)
  manifest.json
  robots.txt
  favicon.svg
```

---

## Build & Deploy

```bash
npm run build     # Builds to dist/client/ — Cloudflare deploys automatically
npm run dev       # Local dev server at localhost:4321
```

---

## AdSense Compliance

Before publishing ANY content, ensure:
- No prohibited topics (hate, illegal, misinformation, weapons, etc.)
- Content is 100% original (no plagiarism)
- Factual claims are accurate and verifiable
- No clickbait titles that don't match content
- No keyword stuffing

Full rules: `docs/ADSENSE-RULES.md`

---

## Brand-Specific vs Reusable

When copying this theme to another site:
- **CHANGE:** Brand name, domain, analytics IDs, categories, author names, page descriptions
- **KEEP:** All components, layouts, styles, lib/posts.ts, content schema

Full guide: `docs/THEME-CUSTOMIZATION.md`

