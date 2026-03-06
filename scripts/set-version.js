#!/usr/bin/env node

/**
 * Synchronizes the version across all publishable packages.
 *
 * Usage:
 *   node scripts/set-version.js 0.2.0
 *
 * This updates the "version" field in every package.json and
 * adjusts cross-package dependency ranges (e.g. /core: "^0.2.0").
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const version = process.argv[2];
if (!version || !/^\d+\.\d+\.\d+(-[\w.]+)?$/.test(version)) {
  console.error('Usage: node scripts/set-version.js <semver>');
  console.error('  e.g. node scripts/set-version.js 0.2.0');
  process.exit(1);
}

const PACKAGES = [
  'packages/tokens/package.json',
  'packages/core/package.json',
  'packages/theme/package.json',
  'packages/react/package.json',
  'packages/tokis/package.json',
];

const TOKIS_SCOPE = /^@tokis\//;

for (const relPath of PACKAGES) {
  const absPath = join(root, relPath);
  const pkg = JSON.parse(readFileSync(absPath, 'utf8'));

  pkg.version = version;

  // Update cross-references to other /* packages
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

console.log(`\nAll packages set to v${version}`);
