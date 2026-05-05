const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const port = Number(process.argv[2] || 8000);
const types = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp'
};

function resolveRequestPath(urlPath) {
    let cleanPath = decodeURIComponent(urlPath.split('?')[0]);
    if (cleanPath.endsWith('/')) cleanPath += 'index.html';
    const filePath = path.normalize(path.join(root, cleanPath));
    if (!filePath.startsWith(root)) return null;
    return filePath;
}

http.createServer((req, res) => {
    let filePath = resolveRequestPath(req.url);
    if (!filePath) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }

    fs.stat(filePath, (statError, stats) => {
        if (statError || stats.isDirectory()) {
            filePath = path.join(filePath, 'index.html');
        }

        fs.readFile(filePath, (readError, data) => {
            if (readError) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Not found');
                return;
            }

            res.writeHead(200, { 'Content-Type': types[path.extname(filePath)] || 'application/octet-stream' });
            res.end(data);
        });
    });
}).listen(port, '127.0.0.1', () => {
    console.log(`Dev server running at http://localhost:${port}/`);
});
