// Local stand-in for Vercel: static files from the repo root + the real api/join.js.
// With no SUPABASE_URL set, starts an in-process fake of the join_waitlist RPC so the
// real handler runs end to end. Usage: node serve.mjs [port]   (default 8080)
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(process.argv[2] || process.env.PORT || 8080);
const handler = createRequire(import.meta.url)(path.join(root, 'api/join.js'));
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.webp': 'image/webp', '.pdf': 'application/pdf', '.svg': 'image/svg+xml' };

if (!process.env.SUPABASE_URL) {
  const seen = new Map();
  const fake = http.createServer((req, res) => {
    let b = ''; req.on('data', d => (b += d)); req.on('end', () => {
      const email = JSON.parse(b || '{}').p_email;
      const existing = seen.has(email);
      if (!existing) seen.set(email, seen.size + 1);
      res.setHeader('content-type', 'application/json');
      res.end(JSON.stringify([{ number: seen.get(email), existing }]));
    });
  }).listen(0, '127.0.0.1', () => {
    process.env.SUPABASE_URL = `http://127.0.0.1:${fake.address().port}`;
    process.env.SUPABASE_ANON_KEY = 'fake-key';
    console.log(`fake supabase on ${process.env.SUPABASE_URL}`);
  });
}

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  if (url.pathname === '/api/join') {
    let b = ''; req.on('data', d => (b += d)); req.on('end', () => {
      req.body = b;
      res.status = c => { res.statusCode = c; return res; };
      res.json = o => { res.setHeader('content-type', 'application/json'); res.end(JSON.stringify(o)); };
      handler(req, res);
    });
    return;
  }
  let p = path.join(root, decodeURIComponent(url.pathname));
  if (!p.startsWith(root)) { res.statusCode = 403; return res.end(); }
  if (fs.existsSync(p) && fs.statSync(p).isDirectory()) p = path.join(p, 'index.html');
  fs.readFile(p, (e, d) => {
    if (e) { res.statusCode = 404; return res.end('not found'); }
    res.setHeader('content-type', types[path.extname(p)] || 'application/octet-stream');
    res.end(d);
  });
}).listen(port, () => console.log(`ekstaz on http://localhost:${port}`));
