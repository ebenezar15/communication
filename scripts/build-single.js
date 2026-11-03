#!/usr/bin/env node
/*
 * Bundle Rostrum into ONE self-contained HTML file (CSS and JS inlined).
 * Used for sharing as a single page, e.g. a claude.ai artifact link.
 * Usage: node scripts/build-single.js [out-file]   (default: dist/rostrum.html)
 * The output omits <!doctype>/<html>/<head>/<body>: hosts like claude.ai wrap the page themselves,
 * and browsers render it fine either way.
 */
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const out = process.argv[2] || path.join(root, 'dist', 'rostrum.html');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const safe = (js) => js.replace(/<\/script/gi, '<\\/script');

const title = html.match(/<title>[\s\S]*?<\/title>/)[0];
const desc = (html.match(/<meta name="description"[^>]*>/) || [''])[0];
const theme = (html.match(/<meta name="theme-color"[^>]*>/) || [''])[0];
const body = html.slice(html.indexOf('<body>') + 6, html.indexOf('</body>'));
const markup = body.replace(/<script src="[^"]+"><\/script>\s*/g, '').trim();
const scripts = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map((m) => m[1]);

const page = [
  '<meta charset="utf-8">',
  title,
  desc,
  theme,
  '<style>\n' + read('css/app.css') + '\n</style>',
  markup,
  '<script>window.ROSTRUM_SINGLE_FILE = true;</script>',
  ...scripts.map((s) => '<script>/* ' + s + ' */\n' + safe(read(s)) + '\n</script>'),
  ''
].join('\n');

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, page);
console.log('Wrote ' + path.relative(process.cwd(), out) + ' (' + Math.round(page.length / 1024) + ' KB)');
