const fs = require('fs');
const path = require('path');

const pkgDir = process.cwd();
const sourceCss = path.join(pkgDir, 'src', 'css', 'index.css');
const targetCss = path.join(pkgDir, 'dist', 'css', 'index.css');

if (!fs.existsSync(sourceCss)) {
  console.error(`Source CSS not found: ${sourceCss}`);
  process.exit(1);
}

fs.mkdirSync(path.dirname(targetCss), { recursive: true });
fs.copyFileSync(sourceCss, targetCss);

const pkgName = require(path.join(pkgDir, 'package.json')).name;
console.log(`✓ Copied CSS export: ${pkgName}`);
