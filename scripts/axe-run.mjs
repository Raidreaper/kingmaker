// Run axe-core CLI against local preview
import { spawn } from 'node:child_process';

const preview = spawn('npm', ['run', 'preview'], { stdio: 'pipe', shell: true });

let url = '';
preview.stdout.on('data', (d) => {
  const s = d.toString();
  process.stdout.write(s);
  const m = s.match(/Local:\s*(http:\/\/[^\s]+)/i);
  if (m && !url) {
    url = m[1];
    runAxe(url);
  }
});

preview.on('exit', (code) => {
  process.exit(code || 0);
});

function runAxe(base) {
  const targets = [`${base}/index.html`, `${base}/projects.html`];
  const axe = spawn('npx', ['axe', ...targets, '--exit'], { stdio: 'inherit', shell: true });
  axe.on('exit', (code) => {
    preview.kill('SIGINT');
    process.exit(code || 0);
  });
}


