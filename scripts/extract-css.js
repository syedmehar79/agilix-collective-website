const fs = require('fs');

const src = fs.readFileSync('agilix-collective/style.css', 'utf8').split(/\r?\n/);
if (src.length !== 7131) {
  console.error('Expected 7131 lines, got ' + src.length);
  process.exit(1);
}

const ranges = {
  'css/base.css': [[1, 35]],
  'css/layout.css': [[37, 43], [336, 417], [2211, 2881], [4543, 5004], [6062, 6068]],
  'css/pages/home.css': [[45, 335], [419, 1465]],
  'css/pages/products.css': [[1466, 1776], [6627, 6632]],
  'css/components.css': [[1777, 1811], [2882, 3128], [4317, 4541], [5005, 6061], [7048, 7131]],
  'css/pages/blogs.css': [[1812, 2168], [6633, 7047]],
  'css/pages/legal.css': [[2169, 2210]],
  'css/pages/careers.css': [[3129, 4316]],
  'css/pages/about.css': [[6070, 6079]],
  'css/pages/services.css': [[6081, 6626]]
};

const claimed = new Array(src.length + 1).fill(false);
for (const [dest, list] of Object.entries(ranges)) {
  const parts = [];
  for (const [start, end] of list) {
    for (let i = start; i <= end; i++) {
      if (claimed[i]) {
        console.error('Overlap at line ' + i);
        process.exit(1);
      }
      claimed[i] = true;
    }
    parts.push(src.slice(start - 1, end).join('\n'));
  }
  fs.mkdirSync(require('path').dirname(dest), { recursive: true });
  fs.writeFileSync(dest, parts.join('\n\n') + '\n');
}

const skipped = [];
for (let i = 1; i <= src.length; i++) {
  if (!claimed[i] && src[i - 1].trim() !== '') skipped.push(i);
}
if (skipped.length) {
  console.error('Unassigned non-blank lines: ' + skipped.join(', '));
  process.exit(1);
}
console.log('css extract ok');
