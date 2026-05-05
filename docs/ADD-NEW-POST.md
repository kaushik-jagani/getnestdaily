# Adding a New Blog Post — Agent Instructions

> **This file is the SINGLE SOURCE OF TRUTH for creating posts.**
> AI agents and human authors MUST follow these rules exactly.

---

## File Location

Posts live at: `src/content/posts/{slug}.md`

The slug is the filename without `.md`. It becomes the URL:
`https://{SITE_DOMAIN}/blog/{slug}/`

---

## Frontmatter Schema (REQUIRED — All Fields)

```yaml
---
title: "Full SEO-Optimized Title (50–65 characters ideal)"
category: "technology"
date: "YYYY-MM-DD"
author: "Author Name"
image: "assets/images/posts/{slug}/featured.jpg"
featured: false
reading_time: "7 min"
tags:
  - "Tag One"
  - "Tag Two"
  - "Tag Three"
meta_description: "150–160 character SEO description with primary keyword near the start."
keywords:
  - "primary keyword"
  - "secondary keyword"
  - "long-tail keyword"
---
```

### Field Rules

| Field | Type | Rules |
|-------|------|-------|
| `title` | string | 50–65 chars. Include primary keyword. No site name suffix. |
| `category` | string | **Must be one of the valid categories** (see below). Single value only. |
| `date` | string | ISO format `YYYY-MM-DD`. Publication date. |
| `author` | string | Use exact author names from the authors list below. |
| `image` | string | **Relative path from project root** (see Image Rules below). |
| `featured` | boolean | `true` only for high-quality cornerstone content (max 3–4 at a time). |
| `reading_time` | string | Format: `"X min"`. Calculate: word_count / 200, round up. |
| `tags` | string[] | 3–8 tags. Title Case. Specific, not generic. |
| `meta_description` | string | 150–160 chars. Includes primary keyword. Compelling for click-through. |
| `keywords` | string[] | 5–10 keywords/phrases for SEO. Include long-tail variations. |

---

## Valid Categories

These are the ONLY allowed category values:

| Category Slug | Display Name |
|---------------|-------------|
| `technology` | Technology |
| `artificial-intelligence` | Artificial Intelligence |
| `software` | Software |
| `gadgets` | Gadgets |
| `productivity` | Productivity |
| `business-and-industry` | Business & Industry |
| `energy-market-trends` | Energy Market Trends |

> **⚠️ DO NOT invent new categories.** If content doesn't fit, use the closest match.
> The poc-2 publisher and this site share the same category list.

---

## Valid Authors

| Author Name | Used For |
|-------------|----------|
| `Kaushik Jagani` | Primary author / tech content |
| `Global Info Nest Team` | Team-authored / general content |

> Use exact spelling. Case-sensitive.

---

## Image Rules — CRITICAL

### Image Path Format

The `image` field supports TWO formats:

```yaml
# ✅ CORRECT — relative path for self-hosted images (no leading slash)
image: "assets/images/posts/my-post-slug/featured.jpg"

# ✅ CORRECT — full URL for external/CDN images
image: "https://images.unsplash.com/photo-123..."
image: "https://cdn.example.com/posts/my-image.jpg"

# ❌ WRONG — leading slash (breaks OG image URL resolution)
image: "/assets/images/posts/my-post-slug/featured.jpg"
```

**How it works:**
- Relative path (`assets/...`) → the system prepends `/` for display and full domain for OG meta
- Full URL (`https://...`) → used as-is everywhere
- Leading slash (`/assets/...`) → **AVOID** — causes double-slash issues in OG meta tags

### Image File Location

Images go in: `public/assets/images/posts/{slug}/`

Standard structure:
```
public/assets/images/posts/{slug}/
  ├── featured.jpg       (required — hero/card image, 1200×630px)
  └── {other-name}.jpg   (optional — in-article images)
```

### In-Article Images

When using images inside post content, use the SAME relative format:

```html
<!-- ✅ CORRECT -->
<figure class="post-image">
  <img src="assets/images/posts/{slug}/diagram.jpg" alt="Descriptive alt text" loading="lazy">
  <figcaption>Caption describing the image.</figcaption>
</figure>

<!-- ❌ WRONG — no external hotlinks -->
<img src="https://external-site.com/image.jpg">
```

### Image Requirements

- Format: `.jpg` or `.webp` (prefer `.jpg` for compatibility)
- Featured image: 1200×630px (OG/social card ratio)
- Max file size: 200KB (compress before adding)
- Always include descriptive `alt` text for accessibility/SEO
- Always add `loading="lazy"` for non-hero images

---

## Content (Post Body)

Write content in HTML (not raw Markdown) inside the `.md` file:

```html
<p>Opening paragraph — hook the reader. Include primary keyword naturally.</p>

<h2>First Section Heading</h2>
<p>Content...</p>

<h2>Second Section Heading</h2>
<p>Content...</p>

<h2>Conclusion or Final Thoughts</h2>
<p>Summarize key points. End with a forward-looking statement.</p>
```

### Content Rules

| Rule | Details |
|------|---------|
| Headings | Use `<h2>` for main sections, `<h3>` for subsections. Never use `<h1>` (page has one already). |
| Length | Minimum 1000 words, ideal 1500–2500 words. |
| Structure | 5–10 `<h2>` sections minimum for proper TOC generation. |
| Links | Internal links to related posts: `<a href="/blog/{slug}/">text</a>` (include trailing slash). |
| HTML entities | Use `&mdash;` `&rsquo;` `&ldquo;` `&rdquo;` — NOT raw unicode special chars. |
| No scripts | Never include `<script>` tags in post content. |
| Paragraphs | Every paragraph in `<p>` tags. No naked text. |

### SEO Content Checklist

- [ ] Primary keyword appears in first 100 words
- [ ] Primary keyword in at least one `<h2>`
- [ ] Meta description contains primary keyword
- [ ] Title contains primary keyword
- [ ] At least 2 internal links to other posts
- [ ] At least one image with descriptive alt text
- [ ] Content answers search intent (informational/transactional)

---

## Complete Example

File: `src/content/posts/example-ai-tool-review.md`

```yaml
---
title: "Example AI Tool Review 2026 — Features, Pricing, and Alternatives"
category: "artificial-intelligence"
date: "2026-05-05"
author: "Kaushik Jagani"
image: "assets/images/posts/example-ai-tool-review/featured.jpg"
featured: false
reading_time: "8 min"
tags:
  - "AI Tools"
  - "Product Review"
  - "Productivity"
meta_description: "A detailed review of Example AI Tool in 2026. We cover features, pricing, pros & cons, and the best alternatives for developers and teams."
keywords:
  - "Example AI tool review"
  - "Example AI pricing 2026"
  - "best AI tools for developers"
  - "AI tool alternatives"
---

<p>Opening paragraph with primary keyword "Example AI Tool" within first 100 words...</p>

<h2>What Is Example AI Tool?</h2>
<p>Description of the tool...</p>

<h2>Key Features</h2>
<p>Feature breakdown...</p>
```

---

## Automated Publishing (poc-2 / ASP.NET Publisher)

The poc-2 app pushes posts via GitHub API:
- Markdown → `src/content/posts/{slug}.md`
- Images → `public/assets/images/posts/{slug}/`

After push, Cloudflare Pages auto-builds. No manual steps needed.

---

## Common Agent Mistakes — AVOID THESE

| Mistake | Fix |
|---------|-----|
| Leading `/` in image path | Use relative `assets/...` or full `https://...` URL — never `/assets/...` |
| Inventing new categories | Only use categories from the valid list above |
| Title too short or generic | 50–65 chars with primary keyword |
| Empty `meta_description` | Always write 150–160 chars |
| Empty `keywords` array | Always include 5–10 keywords |
| Empty `reading_time` | Calculate from word count |
| Using `<h1>` in content | Only `<h2>` and `<h3>` — the page template adds `<h1>` |
| No internal links | Include 2+ links to other posts on the site |
| Raw unicode emojis/special chars | Use HTML entities instead |
| `featured: true` on every post | Reserve for 3–4 cornerstone articles |
