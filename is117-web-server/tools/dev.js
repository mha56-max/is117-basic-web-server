// Run with npm run dev from either project folder.
// Nodemon restarts Node; BrowserSync updates the browser. They do different jobs.
const path = require('node:path');
const nodemon = require('nodemon');
const browserSync = require('browser-sync').create();

const studentDirectory = path.resolve(__dirname, '..');
const entry = path.resolve(process.cwd(), 'index.js');
const browserPort = Number(process.env.PORT || 3000);
const appPort = Number(process.env.APP_PORT || 3001);
let startingBrowser = false;
let stopping = false;
let output = '';

if (browserPort === appPort) {
  console.error('PORT and APP_PORT must be different: the browser and Express use separate ports.');
  process.exit(1);
}

// Keep the public browser URL on port 3000. Express runs behind it on port 3001.
// The proxy adds the browser connection script to HTML automatically, so the
// regular npm start command and production HTML need no live-reload script.
function serverReady() {
  if (browserSync.active) {
    // Wait for Express to be listening before refreshing after a server restart.
    browserSync.reload();
    return;
  }
  if (startingBrowser) return;
  startingBrowser = true;
  browserSync.init({
    proxy: `http://127.0.0.1:${appPort}`,
    port: browserPort,
    listen: '127.0.0.1',
    // Watch page assets separately: changing CSS should not restart Express
    // or erase the classroom API's message stored in memory.
    files: [path.join(studentDirectory, 'public', '**', '*')],
    injectChanges: true,
    reloadDebounce: 150,
    open: false,
    notify: false,
    ui: false,
    online: false,
    ghostMode: false,
  }, error => {
    if (error) {
      console.error(error.message);
      shutdown(1);
      return;
    }
    console.log(`\nLive reload ready: http://localhost:${browserPort}`);
    console.log('Save HTML/JS to refresh; save CSS to update styles; save server code to restart.');
    console.log('Server restarts clear the in-memory classroom message. Ctrl+C stops everything.\n');
  });
}

// Nodemon also inherits the helper's environment. Set the child's PORT here
// after saving browserPort above, so a custom browser PORT is not reused by Express.
process.env.PORT = String(appPort);
process.env.HOST = '127.0.0.1';
const monitor = nodemon({
  script: entry,
  exec: process.execPath,
  watch: [...new Set([entry, path.join(studentDirectory, 'index.js')])],
  ext: 'js',
  delay: 200,
  stdout: false,
  env: { PORT: String(appPort), HOST: '127.0.0.1' },
});

monitor.on('stdout', data => {
  process.stdout.write(data);
  output += data.toString();
  const lines = output.split('\n');
  output = lines.pop();
  for (const line of lines) {
    if (line.includes('Server running at http://localhost:')) serverReady();
  }
});
monitor.on('stderr', data => process.stderr.write(data));
monitor.on('restart', () => console.log('[dev] Server changed. Restarting Express…'));
monitor.on('crash', () => console.error('[dev] Express stopped. Fix the error and save to try again.'));

function shutdown(code = 0) {
  if (stopping) return;
  stopping = true;
  browserSync.exit();
  // Let Nodemon terminate its child too, so no orphan server keeps port 3001.
  monitor.once('exit', () => process.exit(code));
  monitor.emit('quit', code);
}
process.on('SIGINT', () => shutdown());
process.on('SIGTERM', () => shutdown());
