/**
 * TrendBriefly — New Post Generator
 * 
 * Usage: node scripts/new-post.js "my-post-slug"
 * 
 * This creates:
 *   blog/my-post-slug/index.html      (post page shell)
 *   assets/images/posts/my-post-slug/ (image folder)
 *   src/content/posts/my-post-slug.md (markdown source)
 * 
 * Then edit markdown and run sync script:
 *   node scripts/sync-posts-from-md.js
 */

const fs = require('fs');
const path = require('path');

const slug = process.argv[2];
if (!slug) {
    console.error('Usage: node scripts/new-post.js "my-post-slug"');
    process.exit(1);
}

const ROOT = path.join(__dirname, '..');
const postDir = path.join(ROOT, 'blog', slug);
const imageDir = path.join(ROOT, 'assets', 'images', 'posts', slug);
const mdDir = path.join(ROOT, 'src', 'content', 'posts');
const mdFile = path.join(mdDir, `${slug}.md`);

if (fs.existsSync(postDir) || fs.existsSync(mdFile)) {
    console.error(`Post already exists for slug: ${slug}`);
    process.exit(1);
}

fs.mkdirSync(mdDir, { recursive: true });

const template = `<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-8H8J4V3ZWY"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-8H8J4V3ZWY', {
        send_page_view: true,
        anonymize_ip: true
      });
    </script>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blog Post — TrendBriefly</title>
    <meta name="description" content="Read the latest article on TrendBriefly.">
    <meta name="robots" content="index, follow">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">

    <link rel="stylesheet" href="../../css/variables.css">
    <link rel="stylesheet" href="../../css/style.css">
    <link rel="stylesheet" href="../../css/responsive.css">

    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='80' font-size='80' font-weight='bold' fill='%232563eb'>T</text></svg>">
</head>
<body>
    <!-- Reading Progress -->
    <div class="reading-progress" id="readingProgress"></div>

    <!-- Navigation -->
    <nav class="navbar">
        <div class="container nav-container">
            <div class="logo"><a href="../../">TrendBriefly</a></div>
            <div class="nav-center" id="navMenu">
                <a href="../../" class="nav-link">Home</a>
                <a href="../../pages/blog" class="nav-link active">Blog</a>
                <a href="../../pages/about" class="nav-link">About</a>
                <a href="../../pages/contact" class="nav-link">Contact</a>
            </div>
            <div class="nav-right">
                <button class="theme-toggle" id="themeToggle" aria-label="Toggle theme">
                    <span class="theme-icon">☀️</span>
                </button>
                <button class="hamburger" id="hamburger" aria-label="Menu">
                    <span></span><span></span><span></span>
                </button>
            </div>
        </div>
    </nav>

    <!-- Article -->
    <article class="article-container">
        <div class="container">
            <div id="postMeta"></div>
            <div class="post-featured-image" id="featuredImage"></div>
            <div class="table-of-contents" id="tableOfContents"></div>
            <div class="post-content" id="postContent"></div>
            <div class="author-bio" id="authorBio"></div>
            <div class="share-section">
                <h4>Share This Article</h4>
                <div class="share-buttons">
                    <a href="#" class="share-btn facebook">Facebook</a>
                    <a href="#" class="share-btn twitter">Twitter</a>
                    <a href="#" class="share-btn linkedin">LinkedIn</a>
                    <a href="#" class="share-btn copy">Copy Link</a>
                </div>
            </div>
        </div>
    </article>

    <!-- Related Posts -->
    <section class="related-posts-section">
        <div class="container">
            <h2>Related Articles</h2>
            <div class="posts-grid" id="relatedPosts"></div>
        </div>
    </section>

    <!-- Footer -->
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
                        <li><a href="../../">Home</a></li>
                        <li><a href="../../pages/blog">Blog</a></li>
                        <li><a href="../../pages/about">About</a></li>
                        <li><a href="../../pages/contact">Contact</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4>Legal</h4>
                    <ul>
                        <li><a href="../../pages/privacy-policy">Privacy Policy</a></li>
                        <li><a href="../../pages/terms-of-service">Terms of Service</a></li>
                        
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2026 TrendBriefly. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <script type="application/ld+json" id="structuredData">
    {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": "",
        "image": "",
        "datePublished": "",
        "dateModified": "",
        "author": { "@type": "Person", "name": "" }
    }
    </script>

    <script src="../../js/config.js"></script>
    <script src="../../js/theme.js"></script>
    <script src="../../js/analytics.js"></script>
    <script src="../../js/posts.js"></script>
    <script src="../../js/components/cards.js"></script>
    <script src="../../js/pages/home.js"></script>
    <script src="../../js/pages/blog.js"></script>
    <script src="../../js/pages/post.js"></script>
    <script src="../../js/pages/contact.js"></script>
    <script src="../../js/app.js"></script>
</body>
</html>`;

fs.mkdirSync(postDir, { recursive: true });
fs.mkdirSync(imageDir, { recursive: true });
fs.writeFileSync(path.join(postDir, 'index.html'), template);

const today = new Date().toISOString().split('T')[0];
const mdTemplate = `---
id: ""
title: "Your Post Title Here"
category: "technology"
date: "${today}"
author: "Global Info Nest Team"
image: "assets/images/posts/${slug}/featured.jpg"
featured: false
reading_time: "5 min"
tags:
    - "tag1"
    - "tag2"
meta_description: "A compelling 150-160 character description for search engines."
keywords:
    - "keyword1"
    - "keyword2"
---

<p>Your HTML content here...</p>
`;

fs.writeFileSync(mdFile, mdTemplate, 'utf-8');

console.log(`✅ Created: blog/${slug}/index.html`);
console.log(`✅ Created: assets/images/posts/${slug}/`);
console.log(`✅ Created: src/content/posts/${slug}.md`);
console.log(`\n📝 Next steps:`);
console.log(`   1. Add image at assets/images/posts/${slug}/featured.jpg`);
console.log(`   2. Edit src/content/posts/${slug}.md`);
console.log(`   3. Run: node scripts/sync-posts-from-md.js`);
