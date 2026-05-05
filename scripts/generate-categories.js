/**
 * TrendBriefly — Category Page Generator
 * 
 * Usage: node scripts/generate-categories.js
 * 
 * Reads all unique categories from data/posts.json and creates
 * a category folder+page for each one under pages/category/<slug>/
 * 
 * Run this after adding a new post with a new category.
 * Safe to re-run — it will skip existing folders.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const postsFile = path.join(ROOT, 'data', 'posts.json');
const posts = JSON.parse(fs.readFileSync(postsFile, 'utf8'));

function slugify(str) {
    return String(str).toLowerCase().trim()
        .replace(/&/g, '-and-')
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function capitalize(str) {
    return str.replace(/-/g, ' ').split(' ').filter(Boolean)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

// Collect unique categories
const categories = new Set();
posts.forEach(p => {
    if (Array.isArray(p.category)) p.category.forEach(c => categories.add(c));
    else if (p.category) categories.add(p.category);
});

function template(catSlug) {
    const displayName = capitalize(catSlug);
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${displayName} — TrendBriefly</title>
    <meta name="description" content="Browse all articles about ${displayName} on TrendBriefly.">
    <meta name="robots" content="index, follow">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">

    <link rel="stylesheet" href="../../../css/variables.css">
    <link rel="stylesheet" href="../../../css/style.css">
    <link rel="stylesheet" href="../../../css/responsive.css">
</head>
<body>
    <nav class="navbar">
        <div class="container nav-container">
            <div class="logo"><a href="../../../">TrendBriefly</a></div>
            <div class="nav-center" id="navMenu">
                <a href="../../../" class="nav-link">Home</a>
                <a href="../../blog" class="nav-link">Blog</a>
                <a href="../../about" class="nav-link">About</a>
                <a href="../../contact" class="nav-link">Contact</a>
            </div>
            <div class="nav-right">
                <button class="theme-toggle" id="themeToggle" aria-label="Toggle theme">
                    <span class="theme-icon">\u2600\uFE0F</span>
                </button>
                <button class="hamburger" id="hamburger" aria-label="Menu">
                    <span></span><span></span><span></span>
                </button>
            </div>
        </div>
    </nav>

    <section class="page-header">
        <div class="container">
            <h1 id="categoryTitle">${displayName}</h1>
            <p id="categoryDesc">Articles about ${displayName}</p>
        </div>
    </section>

    <section class="blog-section">
        <div class="container">
            <div class="posts-grid" id="postsContainer"></div>
        </div>
    </section>

    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3>TrendBriefly</h3>
                    <p>Your source for technology insights, productivity tips, and side income ideas.</p>
                </div>
                <div class="footer-section">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="../../../">Home</a></li>
                        <li><a href="../../blog">Blog</a></li>
                        <li><a href="../../about">About</a></li>
                        <li><a href="../../contact">Contact</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4>Legal</h4>
                    <ul>
                        <li><a href="../../privacy-policy">Privacy Policy</a></li>
                        <li><a href="../../terms-of-service">Terms of Service</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2026 TrendBriefly. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <script src="../../../js/config.js"></script>
    <script src="../../../js/theme.js"></script>
    <script src="../../../js/analytics.js"></script>
    <script src="../../../js/posts.js"></script>
    <script src="../../../js/components/cards.js"></script>
    <script src="../../../js/pages/home.js"></script>
    <script src="../../../js/pages/blog.js"></script>
    <script src="../../../js/pages/post.js"></script>
    <script src="../../../js/pages/contact.js"></script>
    <script src="../../../js/app.js"></script>
</body>
</html>`;
}

let created = 0;
let skipped = 0;

[...categories].sort().forEach(cat => {
    const slug = slugify(cat);
    const dir = path.join(ROOT, 'pages', 'category', slug);
    if (fs.existsSync(path.join(dir, 'index.html'))) {
        console.log(`  Exists: pages/category/${slug}/`);
        skipped++;
        return;
    }
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), template(slug), 'utf8');
    console.log(`  Created: pages/category/${slug}/index.html`);
    created++;
});

console.log(`\nDone! Created ${created}, skipped ${skipped} existing.`);
