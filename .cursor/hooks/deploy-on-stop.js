/**
 * On successful agent stop, always deploy to Vercel when website files were edited.
 * Reads stop-hook JSON from stdin.
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.resolve(__dirname, '..', '..');
const flagPath = path.join(root, '.cursor', '.deploy-pending');
const logPath = path.join(root, '.cursor', 'deploy-log.txt');
const PROD_URL = 'https://agilix-collective-website.vercel.app';

function respond(obj) {
  process.stdout.write(JSON.stringify(obj || {}) + '\n');
}

function log(line) {
  try {
    fs.mkdirSync(path.dirname(logPath), { recursive: true });
    fs.appendFileSync(logPath, `[${new Date().toISOString()}] ${line}\n`, 'utf8');
  } catch (_) {}
}

function runDeploy() {
  log('Starting auto deploy (npx vercel --prod --yes)…');
  const result = spawnSync('npx', ['--yes', 'vercel', '--prod', '--yes'], {
    cwd: root,
    encoding: 'utf8',
    shell: true,
    timeout: 240000,
    env: Object.assign({}, process.env, {
      FORCE_COLOR: '0',
      CI: '1'
    })
  });

  const out = `${result.stdout || ''}\n${result.stderr || ''}`.trim();
  if (out) log(out.slice(-6000));

  if (result.error) {
    log(`Deploy spawn error: ${result.error.message}`);
    return false;
  }
  if (result.status === 0) {
    log('Deploy succeeded');
    return true;
  }
  log(`Deploy failed (code ${result.status})`);
  return false;
}

let raw = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  raw += chunk;
});
process.stdin.on('end', () => {
  let status = 'completed';
  try {
    const payload = JSON.parse(raw || '{}');
    status = payload.status || 'completed';
  } catch (_) {}

  log(`Stop hook fired (status=${status})`);

  // Only auto-deploy after a successful prompt/agent turn
  if (status !== 'completed') {
    log('Skipping deploy: agent did not complete successfully');
    respond({});
    process.exit(0);
    return;
  }

  if (!fs.existsSync(flagPath)) {
    log('Skipping deploy: no site edits marked in this turn');
    respond({});
    process.exit(0);
    return;
  }

  let edited = [];
  try {
    const pending = JSON.parse(fs.readFileSync(flagPath, 'utf8'));
    edited = pending.files || (pending.file ? [pending.file] : []);
  } catch (_) {}

  try {
    fs.unlinkSync(flagPath);
  } catch (_) {}

  log(`Deploying after edits: ${edited.join(', ') || '(unknown)'}`);
  const ok = runDeploy();

  if (ok) {
    respond({
      user_message: `Auto-deployed to ${PROD_URL}`
    });
  } else {
    // Re-mark so a retry / manual deploy still knows something was pending
    try {
      fs.writeFileSync(
        flagPath,
        JSON.stringify({ at: new Date().toISOString(), files: edited, failed: true }, null, 2),
        'utf8'
      );
    } catch (_) {}
    respond({
      user_message: `Auto-deploy failed. Check .cursor/deploy-log.txt or run: npm run deploy`
    });
  }
  process.exit(0);
});
