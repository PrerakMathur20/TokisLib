#!/usr/bin/env node

/**
 * Synchronizes the version across all publishable packages.
 *
 * With a version argument — sets that version in the root package.json
 * and all sub-packages, then updates cross-package dependency ranges:
 *   node scripts/set-version.js 1.1.0
 *
 * Without an argument — reads the current version from the root
 * package.json and syncs it to all sub-packages (useful after manually
 * editing the root version):
 *   node scripts/set-version.js
 */

const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

const root = join(__dirname, '..');
const rootPkgPath = join(root, 'package.json');

const PACKAGES = [
  'packages/tokens/package.json',
  'packages/core/package.json',
  'packages/theme/package.json',
  'packages/react/package.json',
  'packages/tokis/package.json',
];

const TOKIS_SCOPE = /^@tokis\//;

// Resolve version: from CLI arg, or fall back to root package.json
let version = process.argv[2];

if (version) {
  if (!/^\d+\.\d+\.\d+(-[\w.]+)?$/.test(version)) {
    console.error('Invalid semver. Usage: node scripts/set-version.js [x.y.z]');
    process.exit(1);
  }
  // Update root package.json
  const rootPkg = JSON.parse(readFileSync(rootPkgPath, 'utf8'));
  rootPkg.version = version;
  writeFileSync(rootPkgPath, JSON.stringify(rootPkg, null, 2) + '\n', 'utf8');
  console.log(`  tokis-ui-monorepo (root) → ${version}`);
} else {
  // Read version from root as the source of truth
  const rootPkg = JSON.parse(readFileSync(rootPkgPath, 'utf8'));
  version = rootPkg.version;
  if (!version) {
    console.error('No version found in root package.json');
    process.exit(1);
  }
  console.log(`Syncing from root version: ${version}`);
}

// Sync all sub-packages
for (const relPath of PACKAGES) {
  const absPath = join(root, relPath);
  const pkg = JSON.parse(readFileSync(absPath, 'utf8'));

  pkg.version = version;

  // Update cross-references to other @tokis/* packages
  for (const depKey of ['dependencies', 'peerDependencies']) {
    if (!pkg[depKey]) continue;
    for (const name of Object.keys(pkg[depKey])) {
      if (TOKIS_SCOPE.test(name)) {
        pkg[depKey][name] = `^${version}`;
      }
    }
  }

  writeFileSync(absPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
  console.log(`  ${pkg.name} → ${version}`);
}

console.log(`\nAll packages set to v${version} ✓`);
