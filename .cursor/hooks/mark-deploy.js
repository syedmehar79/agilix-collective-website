/**
 * Marks a Vercel deploy as pending when website source files change.
 * Reads afterFileEdit JSON from stdin.
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', '..');
const flagPath = path.join(root, '.cursor', '.deploy-pending');
const logPath = path.join(root, '.cursor', 'deploy-log.txt');

const IGNORE = [
  /^\.cursor[\\/]/i,
  /^node_modules[\\/]/i,
  /^\.vercel[\\/]/i,
  /^package-lock\.json$/i,
  /\.bw-bak$/i,
  /^index-live-temp\.html$/i
];

const ALLOW_EXT =
  /\.(html|css|js|mjs|cjs|svg|png|jpe?g|webp|gif|ico|json|txt|xml|webmanifest)$/i;

function log(line) {
  try {
    fs.appendFileSync(logPath, `[${new Date().toISOString()}] ${line}\n`, 'utf8');
  } catch (_) {}
}

function relFromRoot(filePath) {
  const abs = path.resolve(filePath);
  return path.relative(root, abs).replace(/\//g, path.sep);
}

function shouldDeploy(rel) {
  if (!rel || rel.startsWith('..')) return false;
  if (IGNORE.some((re) => re.test(rel))) return false;
  return ALLOW_EXT.test(rel);
}

let raw = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  raw += chunk;
});
process.stdin.on('end', () => {
  try {
    const payload = JSON.parse(raw || '{}');
    const filePath = payload.file_path || payload.path || '';
    const rel = relFromRoot(filePath);
    if (shouldDeploy(rel)) {
      fs.mkdirSync(path.dirname(flagPath), { recursive: true });
      let files = [];
      try {
        if (fs.existsSync(flagPath)) {
          const prev = JSON.parse(fs.readFileSync(flagPath, 'utf8'));
          if (Array.isArray(prev.files)) files = prev.files;
        }
      } catch (_) {}
      if (files.indexOf(rel) === -1) files.push(rel);
      fs.writeFileSync(
        flagPath,
        JSON.stringify(
          {
            at: new Date().toISOString(),
            file: rel,
            files: files
          },
          null,
          2
        ),
        'utf8'
      );
      log(`Marked deploy pending after edit: ${rel}`);
    } else {
      log(`Skipped mark (not a site file): ${rel || '(empty)'}`);
    }
  } catch (err) {
    log(`mark-deploy error: ${err && err.message ? err.message : err}`);
  }
  process.exit(0);
});
