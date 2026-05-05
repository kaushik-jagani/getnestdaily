# Syncing Features Between Projects — Agent Guide

> **READ THIS before syncing, porting, or adding functionality from another project.**
> This prevents agents from blindly copying entire folders/files and breaking brand-specific content.

---

## The Problem This Solves

When asked to "sync missing features from Project A to Project B", agents often:
- ❌ Copy entire folders (overwriting brand-specific content)
- ❌ Replace files instead of merging changes
- ❌ Bring over brand names, domains, categories from the source project
- ❌ Duplicate code that already exists in slightly different form

**This guide teaches the CORRECT approach.**

---

## Golden Rules

1. **NEVER copy an entire file** — always diff first, then apply only the NEW parts
2. **NEVER overwrite brand-specific values** — domain, site name, categories, authors, descriptions
3. **Identify WHAT is new** before touching any code
4. **Apply changes surgically** — edit existing files, don't replace them
5. **Test after each change** — run `npm run build` to verify nothing broke

---

## Step-by-Step Sync Process

### Step 1: Identify What's New (READ ONLY)

Compare the two projects at the **structural level** first:

```
Ask yourself:
- Are there NEW files that don't exist in the target? (e.g., a new component)
- Are there NEW features WITHIN existing files? (e.g., new props, new schema fields)
- Are there NEW dependencies in package.json?
```

**Do this by reading files in BOTH projects. Do NOT modify anything yet.**

### Step 2: Classify Each Difference

For each difference found, classify it:

| Type | Action | Example |
|------|--------|---------|
| **New reusable component** | Copy file, update brand references | A new card component |
| **New prop/feature in existing file** | Edit target file to add the prop | Adding `keywords` prop to BaseLayout |
| **New page** | Copy structure, rewrite brand content | A new `/pages/disclaimer/` |
| **New utility function** | Copy the function only | New helper in `lib/posts.ts` |
| **Performance improvement** | Apply same pattern, don't copy verbatim | Deferred script loading |
| **SEO enhancement** | Apply pattern with target's brand values | JSON-LD structured data |
| **Brand-specific content** | DO NOT COPY — skip entirely | About page text, footer description |
| **Config change** | Apply concept, use target's values | New astro.config option |

### Step 3: Apply Changes (One at a Time)

For each classified change:

1. **Read the TARGET file** first (understand what's already there)
2. **Read the SOURCE file** (understand what's new)
3. **Edit the TARGET file** — add only the new functionality
4. **Replace brand values** with the target project's values
5. **Build and verify** before moving to the next change

---

## What Is BRAND-SPECIFIC (Never Copy Blindly)

These values are DIFFERENT between projects. Always use the TARGET project's values:

| Value | Where to Find Target's Version |
|-------|-------------------------------|
| Site name | `docs/BRAND-CONFIG.md` → Identity table |
| Domain / URL | `docs/BRAND-CONFIG.md` → Identity table |
| Categories | `docs/BRAND-CONFIG.md` → Categories table |
| Authors | `docs/BRAND-CONFIG.md` → Authors table |
| Analytics IDs | `docs/BRAND-CONFIG.md` → Analytics table |
| Meta descriptions | `docs/BRAND-CONFIG.md` → SEO Defaults |
| Niche/topic keywords | `docs/BRAND-CONFIG.md` → Niche table |
| Footer text | Target's `src/components/Footer.astro` |
| About page content | Target's `src/pages/pages/about/` |
| OG image defaults | Target's BaseLayout |
| localStorage keys | Uses brand name (e.g., `'RealEstateWorld-theme'`) |

---

## What Is REUSABLE (Safe to Port)

These are infrastructure/theme features that work for any site:

| Category | Examples |
|----------|----------|
| **Layout props** | New BaseLayout props (e.g., `articleDate`, `keywords`) |
| **Performance patterns** | Deferred GA loading, preconnect hints, `decoding="async"` |
| **SEO patterns** | JSON-LD schemas (WebSite, BlogPosting, BreadcrumbList) |
| **Accessibility** | `aria-label`, `sr-only` class, semantic HTML |
| **Utility functions** | New helpers in `lib/posts.ts` |
| **CSS features** | New utility classes, responsive improvements |
| **Component structure** | New card layouts, new sections |
| **Build config** | New Astro integrations, vite options |

---

## Example: Correct Way to Sync a Feature

### Scenario: Source project added BreadcrumbList JSON-LD to blog posts. Target doesn't have it.

**❌ WRONG approach:**
```
Copy source/src/pages/blog/[slug].astro → target/src/pages/blog/[slug].astro
```
This overwrites the target's brand name, domain, author bios, etc.

**✅ CORRECT approach:**

1. Read source's `blog/[slug].astro` — find the breadcrumb schema code
2. Read target's `blog/[slug].astro` — find where to insert it
3. Add ONLY the breadcrumb schema to target, using TARGET's domain:

```javascript
// Use TARGET's domain, not source's
const siteUrl = 'https://TARGET-DOMAIN.com';  // from target's BRAND-CONFIG.md

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": siteUrl },
    { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${siteUrl}/pages/blog/` },
    { "@type": "ListItem", "position": 3, "name": post.title, "item": postCanonical }
  ]
};
```

4. Add the `<script>` tag in the `<Fragment slot="head">` section
5. Build and verify

---

## Example: Correct Way to Sync a New Component

### Scenario: Source has a `Newsletter.astro` that target is missing.

1. Copy the component file (it's purely structural)
2. Check if it references any brand-specific text inside
3. If yes → replace with target's brand name/description
4. Import and use in the target page where appropriate
5. Build and verify

---

## Sync Checklist Template

When syncing features, fill this out mentally before starting:

```
Source project: _______________
Target project: _______________
Feature to sync: _______________

Files affected in target:
- [ ] File 1: ___ (edit / create new)
- [ ] File 2: ___ (edit / create new)

Brand values to substitute:
- Site name: _______________
- Domain: _______________
- Categories: _______________

Dependencies needed: (none / list them)

Verification: npm run build passes? [ ]
```

---

## Common Mistakes When Syncing

| Mistake | Why It Happens | Prevention |
|---------|---------------|------------|
| Copying entire `src/pages/` folder | Agent interprets "sync" as "make identical" | Explicitly say "add ONLY the missing feature" |
| Source's domain appears in target | Copied code without substituting values | Always check `BRAND-CONFIG.md` for target values |
| Duplicate imports/functions | Feature already exists in slightly different form | Read target file FIRST before adding |
| Breaking existing functionality | New code conflicts with target's existing code | Build after every file edit |
| Copying `node_modules` or `dist` | Agent copies everything | Never touch `node_modules/`, `dist/`, `.astro/` |

---

## Files to NEVER Copy Between Projects

| Path | Reason |
|------|--------|
| `node_modules/` | Install from package.json instead |
| `dist/` | Generated by build |
| `.astro/` | Generated cache |
| `.wrangler/` | Local dev state |
| `package-lock.json` | Regenerates from package.json |
| `agent.md` | Brand-specific |
| `docs/BRAND-CONFIG.md` | Brand-specific |
| `src/pages/pages/about/` | Brand-specific content |
| `public/favicon.svg` | Brand-specific |
| `public/manifest.json` | Brand-specific |

---

## TL;DR for Agents

```
1. READ both projects first (don't modify yet)
2. IDENTIFY only what's genuinely NEW in source
3. CLASSIFY each difference (reusable vs brand-specific)
4. EDIT target files surgically (don't replace whole files)
5. SUBSTITUTE brand values from target's BRAND-CONFIG.md
6. BUILD and verify after each change
7. NEVER copy: node_modules, dist, agent.md, BRAND-CONFIG.md, about page
```
