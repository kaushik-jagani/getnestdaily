# Brand Configuration — TrendBriefly (getnestdaily.xyz)

> **This file contains ALL brand-specific values for this site instance.**
> When copying this theme to a new site, duplicate this file and update every value below.
> Agents: reference this file for any brand-related decisions.

---

## Identity

| Property | Value |
|----------|-------|
| Brand Name | TrendBriefly |
| Domain | getnestdaily.xyz |
| Full URL | https://getnestdaily.xyz |
| Tagline | Independent coverage of AI, software engineering & technology trends |
| Language | English (en) |
| Locale | en_US |

---

## Niche & Content Focus

| Topic Area | Covered? |
|------------|----------|
| Artificial Intelligence | ✅ Primary |
| Software Engineering | ✅ Primary |
| Technology News | ✅ Primary |
| Productivity Tools | ✅ Secondary |
| Gadgets & Hardware | ✅ Secondary |
| Business & Industry | ✅ Secondary |
| Energy/Market Trends | ✅ Occasional |
| Gaming | ❌ Not core (avoid in descriptions) |
| SEO / Branding / Marketing | ❌ Not covered |

> **Target Audience:** Developers, tech enthusiasts, power users, and professionals who want clear, research-backed tech analysis.

---

## Authors

| Name | Bio | Use For |
|------|-----|---------|
| Kaushik Jagani | Tech writer and software enthusiast exploring the intersection of AI, development, and the future of work. | Primary author, tech content |
| Global Info Nest Team | A team of tech writers and industry analysts covering AI, software engineering, and emerging technology trends. | Team articles, general content |

---

## Categories (Canonical List)

| Slug | Display Name | Description |
|------|-------------|-------------|
| `technology` | Technology | General tech news, industry analysis |
| `artificial-intelligence` | Artificial Intelligence | AI models, tools, research, ethics |
| `software` | Software | Dev tools, frameworks, languages |
| `gadgets` | Gadgets | Hardware, devices, peripherals |
| `productivity` | Productivity | Workflows, tools, time management |
| `business-and-industry` | Business & Industry | Tech business, startups, economics |
| `energy-market-trends` | Energy Market Trends | Oil, renewables, energy policy |

---

## Analytics & Monetization

| Service | ID / Value |
|---------|-----------|
| Google Analytics 4 | `G-EQCRHDEN5M` |
| Google AdSense | `ca-pub-1234567890123456` (placeholder — update when approved) |
| Twitter/X Handle | `@trendbrieflyHQ` |

---

## SEO Defaults

| Property | Value |
|----------|-------|
| Default meta description | Independent coverage of AI developments, software engineering, technology news, and productivity tools. Expert guides for tech enthusiasts and developers. |
| Default OG image | `/assets/images/og-default.jpg` (1200×630px) |
| Title separator | ` — ` (em dash with spaces) |
| Title pattern (posts) | `{Post Title} — TrendBriefly` |
| Title pattern (categories) | `{Category} Articles & Guides \| TrendBriefly` |
| Title pattern (pages) | `{Page Name} — TrendBriefly` |
| Robots default | `index, follow` |

---

## Technical Stack

| Component | Technology |
|-----------|-----------|
| Framework | Astro 6.2.x |
| Hosting | Cloudflare Pages |
| Adapter | @astrojs/cloudflare |
| Build output | `dist/client/` |
| Content source | `src/content/posts/*.md` (Astro Content Collections) |
| Image hosting | Self-hosted at `public/assets/images/posts/` |
| Font | Inter Variable (self-hosted woff2) |
| Sitemap | Auto-generated via @astrojs/sitemap |

---

## Publisher Integration (poc-2)

| Property | Value |
|----------|-------|
| GitHub Repo | Push target for automated posts |
| Markdown path | `src/content/posts/{slug}.md` |
| Image path | `public/assets/images/posts/{slug}/` |
| Valid categories | Must match the list above exactly |
| Auto-deploy | Yes — Cloudflare Pages triggers on push |

---

## What Agents MUST Know

1. **Image paths are RELATIVE** — `assets/images/posts/{slug}/featured.jpg` (no leading `/`, no full URL)
2. **Only use valid categories** — never invent new ones
3. **Title format** uses em dash ` — ` not hyphen ` - `
4. **meta_description** must be 150–160 characters, never empty
5. **keywords** array must have 5–10 items, never empty
6. **Internal links** use trailing slash: `/blog/{slug}/`
7. **Content** is HTML inside `.md` files (not raw Markdown syntax)
8. **No external image URLs** in frontmatter `image` field
9. **Featured** is reserved for 3–4 best articles, not every post
10. **reading_time** format is `"X min"` — calculate from word count ÷ 200
