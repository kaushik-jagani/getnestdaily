const fs = require('fs');
const path = require('path');
const { parseFrontmatterFile } = require('./post-markdown-utils');

const ROOT = path.join(__dirname, '..');
const POSTS_MD_DIR = path.join(ROOT, 'src', 'content', 'posts');
const POSTS_JSON = path.join(ROOT, 'data', 'posts.json');

if (!fs.existsSync(POSTS_MD_DIR)) {
    console.error('Missing src/content/posts directory');
    process.exit(1);
}

const mdFiles = fs.readdirSync(POSTS_MD_DIR)
    .filter(name => name.toLowerCase().endsWith('.md'));

const posts = mdFiles.map((fileName) => {
    const slug = fileName.replace(/\.md$/i, '');
    const filePath = path.join(POSTS_MD_DIR, fileName);
    const { data, body } = parseFrontmatterFile(filePath);

    if (!data.title) {
        throw new Error(`Missing title in ${fileName}`);
    }

    return {
        id: String(data.id || ''),
        title: data.title,
        slug,
        category: data.category || 'technology',
        date: data.date || '',
        author: data.author || 'Global Info Nest Team',
        image: data.image || `assets/images/posts/${slug}/featured.jpg`,
        featured: Boolean(data.featured),
        reading_time: data.reading_time || '',
        tags: Array.isArray(data.tags) ? data.tags : [],
        meta_description: data.meta_description || '',
        keywords: Array.isArray(data.keywords) ? data.keywords : [],
        content: body || ''
    };
});

posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

let nextId = 1;
for (const post of posts) {
    if (post.id && /^\d+$/.test(post.id)) {
        nextId = Math.max(nextId, Number(post.id) + 1);
    }
}
for (const post of posts) {
    if (!post.id || !/^\d+$/.test(post.id)) {
        post.id = String(nextId++);
    }
}

fs.writeFileSync(POSTS_JSON, `${JSON.stringify(posts, null, 2)}\n`, 'utf-8');
console.log(`Synced ${posts.length} posts from markdown to data/posts.json`);
