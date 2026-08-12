/**
 * sessionStart: ensure browser-sync local site is running on port 3000.
 * Idempotent — skips if something is already listening.
 */
const { spawn } = require('child_process');
const net = require('net');
const path = require('path');
const fs = require('fs');

const root = path.resolve(__dirname, '..', '..');
const logPath = path.join(root, '.cursor', 'deploy-log.txt');
const PORT = 3000;

function log(line) {
  try {
    fs.appendFileSync(logPath, `[${new Date().toISOString()}] ${line}\n`, 'utf8');
  } catch (_) {}
}

function readStdin() {
  return new Promise((resolve) => {
    let raw = '';
    if (process.stdin.isTTY) {
      resolve({});
      return;
    }
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => {
      raw += chunk;
    });
    process.stdin.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (_) {
        resolve({});
      }
    });
    setTimeout(() => resolve({}), 200);
  });
}

function portInUse(port) {
  return new Promise((resolve) => {
    const socket = net.connect({ port, host: '127.0.0.1' }, () => {
      socket.end();
      resolve(true);
    });
    socket.on('error', () => resolve(false));
  });
}

function startServer() {
  const args = [
    'browser-sync',
    'start',
    '--server',
    '--files',
    '**/*.html, **/*.css, **/*.js, assets/**',
    '--port',
    String(PORT),
    '--no-open'
  ];

  const child = spawn('npx', args, {
    cwd: root,
    detached: true,
    stdio: 'ignore',
    shell: true,
    windowsHide: true
  });
  child.unref();
}

async function main() {
  await readStdin();

  try {
    if (await portInUse(PORT)) {
      log('dev-server: already running on :' + PORT);
      process.stdout.write(
        JSON.stringify({
          additional_context:
            'Local site is running at http://localhost:3000 — open that URL for the Agilix site.'
        })
      );
      return;
    }

    startServer();
    log('dev-server: started browser-sync on :' + PORT);
    process.stdout.write(
      JSON.stringify({
        additional_context:
          'Started local site at http://localhost:3000 — open that URL for the Agilix site.'
      })
    );
  } catch (err) {
    log('dev-server: failed — ' + (err && err.message ? err.message : String(err)));
    process.stdout.write(JSON.stringify({}));
  }
}

main();
