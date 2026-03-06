const {spawnSync} = require('child_process');
const root = '/Users/p0m08f9/Prerak/Dev/Tokis';
const fs = require('fs');

// Check portal exists
const portalPath = root + '/packages/react/src/components/portal/index.tsx';
fs.writeFileSync('/tmp/check.txt', 'portal exists: ' + fs.existsSync(portalPath) + '\n');

// Run tsc typecheck on react package
const r = spawnSync(root + '/node_modules/typescript/bin/tsc', ['--noEmit', '--pretty', 'false'], {
  cwd: root + '/packages/react',
  encoding: 'utf8',
  timeout: 60000
});
fs.writeFileSync('/tmp/tsc-react.txt', (r.stdout || '') + (r.stderr || '') + '\nExit: ' + r.status);
process.stdout.write('Done. Exit: ' + r.status + '\n');

