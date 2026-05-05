const fs = require('fs');
const path = require('path');
const { serializeFrontmatter } = require('./post-markdown-utils');

const ROOT = path.join(__dirname, '..');
const POSTS_JSON = path.join(ROOT, 'data', 'posts.json');
const POSTS_MD_DIR = path.join(ROOT, 'src', 'content', 'posts');

if (!fs.existsSync(POSTS_JSON)) {
    console.error('Missing data/posts.json');
    process.exit(1);
}

const posts = JSON.parse(fs.readFileSync(POSTS_JSON, 'utf-8'));
fs.mkdirSync(POSTS_MD_DIR, { recursive: true });

let created = 0;
let skipped = 0;

for (const post of posts) {
    if (!post.slug) {
        console.warn(`Skipping post without slug: ${post.title || post.id}`);
        skipped += 1;
        continue;
    }

    const mdPath = path.join(POSTS_MD_DIR, `${post.slug}.md`);
    if (fs.existsSync(mdPath)) {
        skipped += 1;
        continue;
    }

    const frontmatter = {
        id: String(post.id || ''),
        title: post.title || '',
        category: Array.isArray(post.category) ? post.category[0] || '' : (post.category || ''),
        date: post.date || '',
        author: post.author || '',
        image: post.image || '',
        featured: Boolean(post.featured),
        reading_time: post.reading_time || '',
        tags: Array.isArray(post.tags) ? post.tags : [],
        meta_description: post.meta_description || '',
        keywords: Array.isArray(post.keywords) ? post.keywords : []
    };

    const content = `${serializeFrontmatter(frontmatter)}\n\n${(post.content || '').trim()}\n`;
    fs.writeFileSync(mdPath, content, 'utf-8');
    created += 1;
}

console.log(`Created ${created} markdown posts.`);
console.log(`Skipped ${skipped} posts (already existed or invalid).`);
