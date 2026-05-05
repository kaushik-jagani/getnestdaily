const fs = require('fs');

function normalizeLineEndings(text) {
    return text.replace(/\r\n/g, '\n');
}

function parseFrontmatterFile(filePath) {
    const raw = normalizeLineEndings(fs.readFileSync(filePath, 'utf-8'));
    const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);

    if (!match) {
        throw new Error(`Missing frontmatter in ${filePath}`);
    }

    const frontmatterRaw = match[1];
    const body = match[2] || '';
    const data = {};

    let currentArrayKey = null;
    const lines = frontmatterRaw.split('\n');

    for (const line of lines) {
        if (!line.trim()) continue;

        const listMatch = line.match(/^\s*-\s*(.+)$/);
        if (listMatch && currentArrayKey) {
            data[currentArrayKey].push(unquote(listMatch[1].trim()));
            continue;
        }

        currentArrayKey = null;

        const kvMatch = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
        if (!kvMatch) continue;

        const key = kvMatch[1];
        const value = kvMatch[2].trim();

        if (!value) {
            data[key] = [];
            currentArrayKey = key;
            continue;
        }

        if (value === 'true' || value === 'false') {
            data[key] = value === 'true';
        } else if (value.startsWith('[') && value.endsWith(']')) {
            const inner = value.slice(1, -1).trim();
            data[key] = inner
                ? inner.split(',').map(v => unquote(v.trim())).filter(Boolean)
                : [];
        } else {
            data[key] = unquote(value);
        }
    }

    return { data, body: body.trim() };
}

function serializeFrontmatter(data) {
    const lines = ['---'];
    const orderedKeys = [
        'id',
        'title',
        'category',
        'date',
        'author',
        'image',
        'featured',
        'reading_time',
        'tags',
        'meta_description',
        'keywords'
    ];

    for (const key of orderedKeys) {
        if (data[key] === undefined || data[key] === null) continue;

        const value = data[key];
        if (Array.isArray(value)) {
            lines.push(`${key}:`);
            value.forEach(item => lines.push(`  - ${quote(item)}`));
            continue;
        }

        if (typeof value === 'boolean') {
            lines.push(`${key}: ${value}`);
            continue;
        }

        lines.push(`${key}: ${quote(String(value))}`);
    }

    lines.push('---');
    return lines.join('\n');
}

function quote(value) {
    const escaped = String(value).replace(/"/g, '\\"');
    return `"${escaped}"`;
}

function unquote(value) {
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        return value.slice(1, -1).replace(/\\"/g, '"');
    }
    return value;
}

module.exports = {
    parseFrontmatterFile,
    serializeFrontmatter
};
