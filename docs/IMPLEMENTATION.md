# TrendBriefly — Implementation Guide

> **READ THIS FIRST before making any changes to the project.**
> This document describes the full architecture, conventions, and step-by-step procedures for every common task.

---

## Project Overview

TrendBriefly is a static blog built with vanilla HTML, CSS, and JavaScript. Posts are stored in a single JSON file and rendered dynamically. No build tools or frameworks are used.

- **Live Server:** Open `index.html` with VS Code Live Server (port 5500)
- **GA4 ID:** `G-8H8J4V3ZWY`
- **Author:** Kaushik Jagani

---

## Folder Structure

```
getnestdaily/
├── index.html                  # Homepage
├── robots.txt                  # Crawler rules
├── manifest.json               # PWA manifest
├── ads.txt                     # AdSense ads.txt
│
├── assets/
│   └── images/
│       └── posts/
│           └── {slug}/         # Each post has its own image folder
│               ├── featured.jpg
│               └── [other-images].jpg
│
├── blog/                       # Clean URL post folders (2 levels deep)
│   └── {slug}/
│       └── index.html
│
├── css/
│   ├── variables.css           # Design tokens, CSS custom properties
│   ├── style.css               # All component styles
│   └── responsive.css          # Mobile breakpoints
│
├── data/
│   └── posts.json              # All blog post data (single source of truth)
│
├── docs/
│   ├── IMPLEMENTATION.md       # You are here
│   ├── ADD-NEW-POST.md         # Step-by-step post creation guide
│   └── ADSENSE-RULES.md        # AdSense compliance rules
│
├── js/
│   ├── config.js               # Constants, path helpers, slugify(), utilities
│   ├── theme.js                # Dark/light theme system
│   ├── analytics.js            # GA4 page view tracking
│   ├── posts.js                # Data loading, sorting, filtering
│   ├── app.js                  # Orchestrator (init, routing, events)
│   ├── components/
│   │   └── cards.js            # Blog card & featured post builders
│   └── pages/
│       ├── home.js             # Home page logic
│       ├── blog.js             # Blog listing, category page, search
│       ├── post.js             # Single post rendering, TOC, sharing
│       └── contact.js          # Contact form & newsletter
│
├── pages/                      # Static page templates (2 levels deep)
│   ├── blog/index.html
│   ├── about/index.html
│   ├── contact/index.html
│   ├── privacy-policy/index.html
│   ├── terms-of-service/index.html
│   └── category/              # Category pages (3 levels deep)
│       ├── index.html          # Base category page (redirects)
│       ├── technology/index.html
│       ├── gadgets/index.html
│       └── energy-market-trends/index.html
│
└── scripts/
    ├── new-post.js             # Post scaffold generator
    ├── generate-categories.js  # Category page generator
    └── validate-adsense.js     # AdSense compliance checker
```

---

## URL Structure

| Page | URL | File |
|------|-----|------|
| Home | `/` | `index.html` |
| Blog listing | `/pages/blog/` | `pages/blog/index.html` |
| Blog post | `/blog/{slug}/` | `blog/{slug}/index.html` |
| Category | `/pages/category/{slug}/` | `pages/category/{slug}/index.html` |
| About | `/pages/about/` | `pages/about/index.html` |
| Contact | `/pages/contact/` | `pages/contact/index.html` |

> **Category URL examples:**
> - `/pages/category/technology/` (from category name `"technology"`)
> - `/pages/category/energy-market-trends/` (from category name `"Energy Market Trends"`)
> - The `slugify()` function in `config.js` converts names to URL slugs

---

## JS Module Load Order

Scripts are loaded in this exact order via `<script>` tags in every HTML file:

```
1. config.js          → Constants, ROOT_PATH, PAGES_PATH, BLOG_PATH, utilities
2. theme.js           → Dark/light mode (reads THEME_KEY from config)
3. analytics.js       → GA4 trackPageView()
4. posts.js           → loadPostsData(), getSortedPosts(), getFilteredPosts()
5. components/cards.js → createBlogCardElement(), createFeaturedPostElement()
6. pages/home.js      → loadHomePage(), loadFeaturedPosts(), loadCategories()
7. pages/blog.js      → loadBlogPage(), loadCategoryPage(), performSearch()
8. pages/post.js      → loadPostPage(), loadPostContent(), setupShareButtons()
9. pages/contact.js   → setupContactForm(), handleNewsletterSubscription()
10. app.js            → DOMContentLoaded listener, initializePage(), setupEventListeners()
```

**Important:** All modules share the global scope. Functions defined in earlier scripts are available in later ones. `config.js` must always load first.

---

## Path Resolution System

The site runs from 4 different depths. `config.js` auto-detects the depth:

| Context | ROOT_PATH | PAGES_PATH | BLOG_PATH | CATEGORY_PATH | Example page |
|---------|-----------|------------|-----------|---------------|--------------|
| Root (`/`) | `''` | `'pages/'` | `'blog/'` | `'pages/category/'` | `index.html` |
| Pages (`/pages/*/`) | `'../../'` | `'../'` | `'../../blog/'` | `'../category/'` | `pages/blog/index.html` |
| Blog post (`/blog/slug/`) | `'../../'` | `'../../pages/'` | `'../'` | `'../../pages/category/'` | `blog/slug/index.html` |
| Category (`/pages/category/slug/`) | `'../../../'` | `'../../'` | `'../../../blog/'` | `'../'` | `pages/category/technology/index.html` |

**Use these constants in JS:**
- `ROOT_PATH + 'data/posts.json'` → always resolves to the JSON file
- `resolveImagePath(src)` → prepends ROOT_PATH to local image paths
- `BLOG_PATH + slug + '/'` → link to a blog post
- `categoryUrl(categoryName)` → clean category URL (e.g. `pages/category/technology/`)
- `slugify(name)` → converts any string to a URL slug
- `sanitizeUrl(url)` → validates URLs, allows relative paths, blocks `javascript:` etc.

> **⚠️ NEVER use query parameters for category URLs.** Always use `categoryUrl()` which generates clean slug paths.

---

## posts.json Schema

```json
{
  "id": "1",
  "title": "Full article title",
  "slug": "kebab-case-url-slug",
  "category": "technology",
  "date": "2026-04-15",
  "author": "Kaushik Jagani",
  "image": "assets/images/posts/{slug}/featured.jpg",
  "tags": ["AI", "Software Development"],
  "meta_description": "SEO description under 160 chars",
  "keywords": ["keyword1", "keyword2"],
  "content": "<p>Full HTML content...</p>"
}
```

**Rules:**
- `category` — **Must be a single string** (NOT an array). One category per post.
- `id` — String, sequential ("1", "2", "3"...)
- `slug` — Must match the folder name in `blog/` and `assets/images/posts/`
- `image` — Relative path from root (no leading `../`)
- `content` — Valid HTML. Use `<h2>` for sections (generates TOC). Escape quotes with `\"`
- Images inside `content` — Use paths relative to root: `assets/images/posts/{slug}/image.jpg`

---

## How to Add a New Blog Post

### Step 1: Generate the post folder

```bash
node scripts/new-post.js "my-new-post-slug"
```

This creates:
- `blog/my-new-post-slug/index.html` (post template)
- `assets/images/posts/my-new-post-slug/` (image folder)

### Step 2: Add images

Place images in `assets/images/posts/my-new-post-slug/`:
- `featured.jpg` — Card thumbnail & hero image
- Any other images referenced in the content

### Step 3: Add post data to `data/posts.json`

Add a new object to the array:

```json
{
  "id": "2",
  "title": "Your Post Title",
  "slug": "my-new-post-slug",
  "category": "technology",
  "date": "2026-04-20",
  "author": "Kaushik Jagani",
  "image": "assets/images/posts/my-new-post-slug/featured.jpg",
  "tags": ["Tag1", "Tag2"],
  "meta_description": "Brief SEO description.",
  "keywords": ["keyword1", "keyword2"],
  "content": "<p>Your HTML content here...</p>"
}
```

### Step 4: Generate category pages (if new category)

```bash
node scripts/generate-categories.js
```

This reads all categories from `posts.json` and creates `pages/category/{slug}/index.html` for any new ones. Safe to re-run — skips existing folders.

### Step 5: Run AdSense Compliance Validator

```bash
node scripts/validate-adsense.js
```

This checks ALL posts in `posts.json` against Google AdSense policies:
- Prohibited content keywords (violence, hate, drugs, weapons, etc.)
- Content length (minimum 500 words)
- Meta description length (under 160 chars)
- Image path validity
- Excessive profanity check
- Clickbait/deceptive title patterns

**If any violations are found, fix them BEFORE publishing.**
See `docs/ADSENSE-RULES.md` for the full policy reference.

### Step 6: Test

1. Hard refresh (`Ctrl+Shift+R`)
2. Check home page shows the new post
3. Check `/blog/my-new-post-slug/` loads correctly
4. Check images render
5. Check mobile responsive

---

## How to Add a New Author

In `js/pages/post.js`, add to the `bios` object in `loadAuthorBio()`:

```js
const bios = {
    'Kaushik Jagani': 'Tech writer and software enthusiast...',
    'New Author': 'Their bio here.'
};
```

---

## How to Add a New Category

1. Use the new category name as a string in the post's `"category"` field in `posts.json`
2. Run `node scripts/generate-categories.js` to create the category page folder
3. The category auto-appears in:
   - Topics dropdown in the navbar
   - Blog page sidebar categories widget
   - Home page sidebar

> **URL format:** Category name is converted to a slug via `slugify()`. Example: `"Energy Market Trends"` → `/pages/category/energy-market-trends/`

---

## How to Add a New Page

1. Create `pages/new-page.html` (copy structure from `about.html`)
2. Add navigation link in:
   - `index.html` (nav + footer)
   - All files in `pages/` (nav + footer)
   - All files in `blog/*/` (nav + footer)
3. Add route detection in `js/app.js` → `initializePage()`
4. Add page-specific JS in `js/pages/new-page.js` if needed
5. Add script tag to all HTML files

---

## Styling Conventions

- **CSS Variables** defined in `css/variables.css`:
  - Colors: `--accent`, `--bg-primary`, `--bg-secondary`, `--text-primary`, `--text-secondary`
  - Spacing: `--space-1` through `--space-12`
  - Typography: `--text-sm`, `--text-base`, `--text-lg`, `--text-xl`, etc.
  - Radius: `--radius-sm`, `--radius-md`, `--radius-lg`
  - Leading: `--leading-relaxed`
- **Dark mode** uses `[data-theme="dark"]` selector overrides in `variables.css`
- **Responsive** breakpoints in `responsive.css`: 768px, 480px

---

## Content HTML Patterns

Use these in `posts.json` content field:

```html
<!-- Heading (auto-generates TOC entry) -->
<h2>Section Title</h2>

<!-- Paragraph -->
<p>Text content here.</p>

<!-- List -->
<ul>
  <li>Item one.</li>
  <li>Item two.</li>
</ul>

<!-- Image with caption -->
<figure class="post-image">
  <img src="assets/images/posts/{slug}/image-name.jpg" alt="Description" loading="lazy">
  <figcaption>Caption text here.</figcaption>
</figure>

<!-- Smart quotes -->
&ldquo;quoted text&rdquo;
```

**Note:** Image `src` in content should be relative to root (no `../`). The `loadPostContent()` function in `post.js` auto-resolves paths using `resolveImagePath()`.

---

## Caching

- Posts data is fetched fresh from `posts.json` on every page load (no localStorage caching)
- Theme preference cached under `TrendBriefly-theme` in localStorage

---

## SEO Checklist for New Posts

- [ ] `meta_description` under 160 characters
- [ ] `keywords` array with 5-7 relevant terms
- [ ] `image` field points to a valid featured image
- [ ] `alt` text on all images in content
- [ ] `sitemap.xml` updated with new post URL
- [ ] Structured data auto-generated (JSON-LD in post template)
- [ ] Open Graph tags updated dynamically via `updateMetaTags()` in `config.js`

---

## Google AdSense Compliance Checklist for New Posts

> **MANDATORY** — Run `node scripts/validate-adsense.js` after every post creation.
> Full policy reference: `docs/ADSENSE-RULES.md`

### Content Compliance
- [ ] No prohibited content (illegal, sexual, violent, hateful, dangerous)
- [ ] No restricted content (weapons, drugs, tobacco, gambling, shocking)
- [ ] Content is 100% original (not copied/scraped)
- [ ] No copyrighted material without proper attribution
- [ ] No misleading claims or fake endorsements
- [ ] No harmful health/science misinformation
- [ ] No deceptive clickbait titles
- [ ] All factual claims are accurate and verifiable
- [ ] No excessive profanity

### Quality Compliance
- [ ] Post has 500+ words of substantive content
- [ ] Content provides genuine value to readers
- [ ] Images are original, licensed, or properly attributed
- [ ] Title accurately represents the content
- [ ] No keyword stuffing

### Technical Compliance
- [ ] `robots.txt` does not block Google crawling
- [ ] `ads.txt` has correct publisher ID
- [ ] Privacy policy page exists and discloses cookie/ad usage
- [ ] `validate-adsense.js` passes with no violations

---

## Common Pitfalls

| Issue | Cause | Fix |
|-------|-------|-----|
| Images broken | `sanitizeUrl()` was blocking relative paths | Fixed — now allows relative paths |
| Old data showing | localStorage cache | Bump `POSTS_CACHE_KEY` version or `Ctrl+Shift+R` |
| Post page blank | Slug mismatch | Ensure `slug` in posts.json matches the folder name in `blog/` |
| Links wrong from blog post | Path depth not detected | Check `IS_BLOG_POST` detection in `config.js` |
| Styles missing on post | Wrong CSS path | Blog posts use `../../css/` (2 levels deep) |

---

## Quick Reference Commands

```bash
# Create new post scaffold
node scripts/new-post.js "post-slug-here"

# Generate category pages (run after adding posts with new categories)
node scripts/generate-categories.js

# Validate AdSense compliance
node scripts/validate-adsense.js

# Check JSON syntax
node -e "JSON.parse(require('fs').readFileSync('data/posts.json','utf8')); console.log('Valid JSON')"

# Start local server (VS Code Live Server)
# Right-click index.html → Open with Live Server
```
