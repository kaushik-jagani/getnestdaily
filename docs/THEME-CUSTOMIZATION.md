# Theme Customization — Copying This Theme to a New Site

> **When you copy this theme for a different brand/niche, ONLY modify the items listed below.**
> Everything else (layout, components, utilities, styles) is reusable as-is.

---

## Quick Checklist for New Site Setup

1. Update `astro.config.mjs` → site URL
2. Update `BRAND-CONFIG.md` → all brand values
3. Update `BaseLayout.astro` → analytics IDs, default description, site name
4. Update `Footer.astro` → brand name, description, category links, SEO strip
5. Update `Navbar.astro` → logo, brand name, nav links
6. Update `public/manifest.json` → app name, colors
7. Update `public/robots.txt` → sitemap URL
8. Update categories in:
   - `docs/ADD-NEW-POST.md` (valid categories table)
   - `Footer.astro` (Topics column)
   - poc-2 `ValidCategories` (if using publisher)
9. Add `public/assets/images/og-default.jpg` (1200×630 default social image)
10. Replace `public/favicon.svg` with new brand icon

---

## Files That Contain Brand/Niche-Specific Content

### 1. `astro.config.mjs`

```js
site: 'https://YOUR-DOMAIN.com',  // ← Change this
```

### 2. `src/layouts/BaseLayout.astro`

| Line/Section | What to Change |
|-------------|----------------|
| Google Analytics ID | `G-EQCRHDEN5M` → your GA4 ID |
| AdSense publisher ID | `ca-pub-1234567890123456` → your AdSense ID |
| `siteName` constant | `'TrendBriefly'` → your brand |
| `siteUrl` fallback | `'https://getnestdaily.xyz'` → your domain |
| Default `description` | Update to match your niche |
| `og:site_name` | Uses `siteName` variable (auto) |
| `twitter:site` | `@trendbrieflyHQ` → your Twitter handle |

### 3. `src/components/Footer.astro`

| Section | What to Change |
|---------|----------------|
| `siteName` default | Your brand name |
| `description` default | One-line niche description |
| Topics column links | Your actual categories (must match valid category slugs) |
| Domain text | `getnestdaily.xyz` → your domain |
| Footer bottom SEO strip | Rewrite for YOUR niche keywords |
| Copyright year/name | Auto uses `siteName` |

### 4. `src/components/Navbar.astro`

| Section | What to Change |
|---------|----------------|
| Logo SVG | Replace with your brand icon |
| Brand text | "TrendBriefly" → your name |
| Nav links | Adjust categories in the dropdown if needed |
| `aria-label` on home link | "TrendBriefly home" → "{YourBrand} home" |

### 5. `src/pages/index.astro`

| Section | What to Change |
|---------|----------------|
| `title` | Include your brand + niche keywords |
| `description` | Describe your site's content |
| `websiteSchema.name` | Your brand |
| `websiteSchema.url` | Your domain |
| `websiteSchema.description` | Your niche description |
| `organizationSchema.*` | Your brand, URL, logo, description |
| `<h1 class="sr-only">` | Your brand + topic |

### 6. `src/pages/blog/[slug].astro`

| Section | What to Change |
|---------|----------------|
| `siteUrl` constant | Your domain |
| `bios` record | Your author names and bios |
| Publisher name in JSON-LD | `"TrendBriefly"` → your brand |
| Publisher logo URL | Your logo URL |

### 7. `src/pages/pages/about/index.astro`

Rewrite entirely for your brand. Keep the BaseLayout props structure.

### 8. `src/pages/pages/contact/index.astro`

Update brand name in title/description. Keep form structure.

### 9. `public/manifest.json`

```json
{
  "name": "Your Brand Name",
  "short_name": "YourBrand",
  "theme_color": "#your-color",
  "background_color": "#your-bg"
}
```

### 10. `public/robots.txt`

```
Sitemap: https://YOUR-DOMAIN.com/sitemap-index.xml
```

---

## Files That Are REUSABLE (Do NOT Change)

These files are theme infrastructure — they work for any niche:

| File/Folder | Purpose |
|-------------|---------|
| `src/lib/posts.ts` | Post utilities, sorting, categories, slugify |
| `src/content.config.ts` | Collection schema (universal) |
| `src/styles/` | All CSS (colors use CSS variables — customize via `variables.css`) |
| `src/components/cards/` | Card components (BlogCard, HeroCard, etc.) |
| `src/components/Newsletter.astro` | Newsletter signup form |
| `src/components/ShareButtons.astro` | Social share buttons |
| `src/pages/pages/privacy-policy/` | Generic legal page (update company name only) |
| `src/pages/pages/terms-of-service/` | Generic legal page (update company name only) |
| `src/pages/pages/disclaimer/` | Generic legal page (update company name only) |
| `src/pages/pages/category/[slug].astro` | Auto-generates from posts (no changes needed) |
| `src/pages/pages/blog/index.astro` | Blog listing (update title/description for niche) |
| `src/pages/404.astro` | Error page (generic) |

---

## CSS Variables (Color Theme)

To change the visual theme, edit `src/styles/variables.css`:

```css
:root {
  --accent: #your-accent-color;
  --bg-primary: #your-background;
  --text-primary: #your-text-color;
  /* etc. */
}
```

No need to touch any component files for color changes.

---

## Category System

Categories are defined in THREE places that must stay in sync:

1. **`docs/ADD-NEW-POST.md`** — the "Valid Categories" table (source of truth for authors/agents)
2. **`src/components/Footer.astro`** — Topics column links
3. **poc-2 `ValidCategories`** — if using the automated publisher

When adding/removing categories:
- Update all three locations
- Category slugs are auto-generated via `slugify()` from the category string
- Category pages auto-generate from posts (no manual page creation needed)

---

## Deployment

- **Platform:** Cloudflare Pages
- **Build command:** `npm run build`
- **Output directory:** `dist/client/`
- **Adapter:** `@astrojs/cloudflare`

After pushing to GitHub, Cloudflare auto-deploys. No manual steps.
