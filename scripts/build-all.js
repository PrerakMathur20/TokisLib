const {spawnSync} = require('child_process');
const path = require('path');
const fs = require('fs');
const root = '/Users/p0m08f9/Prerak/Dev/Tokis';
const log = (msg) => fs.appendFileSync('/tmp/tokis-build-log.txt', msg + '\n');

fs.writeFileSync('/tmp/tokis-build-log.txt', '=== Tokis Build ===\n');

const pkgs = ['tokens', 'core', 'react'];
let allOk = true;

for (const pkg of pkgs) {
  log(`\n--- Building /${pkg} ---`);
  const r = spawnSync('npm', ['run', 'build'], {
    cwd: path.join(root, 'packages', pkg),
    encoding: 'utf8',
    timeout: 120000
  });
  if (r.stdout) log(r.stdout);
  if (r.stderr) log(r.stderr);
  log(`Exit: ${r.status}`);
  if (r.status !== 0) { allOk = false; }
}

log('\n=== ' + (allOk ? 'ALL BUILDS OK' : 'BUILD FAILED') + ' ===');
process.exit(allOk ? 0 : 1);
