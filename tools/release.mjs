// Publica una versión nueva de la app. GitHub la compila y el teléfono la ofrece para actualizar.
//
//   npm run release              1.0.0 → 1.0.1
//   npm run release -- 1.2.0     versión exacta
//   npm run release -- --same    publica la versión actual (la primera vez)
//
// Sube el número en VERSION, hace commit, crea la etiqueta vX.Y.Z, la sube a GitHub y espera
// a que termine la compilación (.github/workflows/android.yml).
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPO = 'gaqlh/reactor-swipe';
const VERSION_FILE = path.join(ROOT, 'VERSION');
const PKG = path.join(ROOT, 'package.json');

function run(cmd, args, quiet) {
  const r = spawnSync(cmd, args, { cwd: ROOT, stdio: quiet ? 'pipe' : 'inherit', encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`Falló: ${cmd} ${args.join(' ')}\n${(r.stderr || '').trim()}`);
  return (r.stdout || '').trim();
}

function nextVersion(v) {
  const p = v.split('.').map((x) => parseInt(x, 10) || 0);
  while (p.length < 3) p.push(0);
  p[2] += 1;
  return p.slice(0, 3).join('.');
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const arg = process.argv[2];
  const current = fs.existsSync(VERSION_FILE) ? fs.readFileSync(VERSION_FILE, 'utf8').trim() : '1.0.0';
  const version = arg === '--same' ? current : /^\d+\.\d+\.\d+$/.test(arg || '') ? arg : nextVersion(current);
  const tag = `v${version}`;

  fs.writeFileSync(VERSION_FILE, version + '\n');
  const pkg = JSON.parse(fs.readFileSync(PKG, 'utf8'));
  pkg.version = version;
  fs.writeFileSync(PKG, JSON.stringify(pkg, null, 2) + '\n');
  console.log(`\n▶ Reactor Swipe ${version}`);

  run('git', ['add', '-A']);
  const pendingChanges = run('git', ['status', '--porcelain'], true);
  if (pendingChanges) run('git', ['commit', '-q', '-m', `Reactor Swipe ${version}\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`]);
  run('git', ['tag', '-a', tag, '-m', `Reactor Swipe ${version}`]);
  run('git', ['push', '-q', 'origin', 'HEAD']);
  run('git', ['push', '-q', 'origin', tag]);
  console.log('▶ Compilando en GitHub…');

  let runId = '';
  for (let i = 0; i < 30 && !runId; i++) {
    await sleep(4000);
    const out = run('gh', ['run', 'list', '--repo', REPO, '--workflow', 'android.yml', '--branch', tag, '--limit', '1', '--json', 'databaseId', '--jq', '.[0].databaseId // ""'], true);
    runId = out.trim();
  }
  if (!runId) throw new Error('No encontré la compilación en GitHub. Revisa la pestaña Actions del repositorio.');
  run('gh', ['run', 'watch', runId, '--repo', REPO, '--exit-status', '--interval', '15']);

  console.log(`\n✔ Versión ${version} publicada.`);
  console.log(`  Enlace para instalar: https://github.com/${REPO}/releases/latest/download/reactor-swipe.apk`);
}

main().catch((e) => {
  console.error('\n✖ ' + e.message);
  process.exit(1);
});
