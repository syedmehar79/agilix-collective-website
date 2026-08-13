const fs = require('fs');
const path = require('path');

const pages = [
  'index.html', 'about.html', 'products.html', 'services.html',
  'careers.html', 'blogs.html', 'privacy.html', 'terms.html'
];

const required = [
  'css/base.css', 'css/layout.css', 'css/components.css',
  'css/pages/home.css', 'css/pages/about.css', 'css/pages/services.css',
  'css/pages/careers.css', 'css/pages/blogs.css', 'css/pages/products.css',
  'css/pages/legal.css', 'js/main.js', 'js/components/site-widget.js',
  'js/pages/careers.js', 'partials/float-widget.html',
  'vendor/jquery/jquery.min.js', 'assets/icons/favicon.svg'
];

function hasOldSitePath(text) {
  return /(?:["'(]|^)(?:\/agilix-collective\/|\.\/agilix-collective\/|https:\/\/agilixcollective\.com\/agilix-collective\/)/m.test(text)
    || /(?:href|src)=["']\/agilix-collective\//.test(text);
}

let failed = false;
for (const file of required) {
  if (!fs.existsSync(file)) {
    console.error('missing ' + file);
    failed = true;
  }
}

const skip = new Set(['node_modules', '.git', '.vercel', 'docs', 'agilix-collective', '.superpowers', '.cursor']);
function walk(dir, acc) {
  if (!fs.existsSync(dir)) return;
  for (const name of fs.readdirSync(dir)) {
    if (skip.has(name)) continue;
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full, acc);
    else if (/\.(html|js|css)$/.test(name)) acc.push(full);
  }
}

const files = pages.slice();
for (const dir of ['css', 'js', 'partials', 'vendor']) {
  walk(dir, files);
}

for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  if (hasOldSitePath(text)) {
    console.error('old path in ' + file);
    failed = true;
  }
}

const hrefRe = /(?:href|src)=["'](\/[^"']+)["']/g;
for (const page of pages) {
  const html = fs.readFileSync(page, 'utf8');
  let match;
  while ((match = hrefRe.exec(html))) {
    const url = match[1].split('#')[0].split('?')[0];
    if (!url || url.startsWith('/http') || url.endsWith('/')) continue;
    const disk = url.replace(/^\//, '');
    if (!fs.existsSync(disk)) {
      console.error(page + ' missing ' + url);
      failed = true;
    }
  }
}

if (failed) process.exit(1);
console.log('structure ok');
