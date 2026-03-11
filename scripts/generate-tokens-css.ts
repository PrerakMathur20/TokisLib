#!/usr/bin/env node
/**
 * scripts/generate-tokens-css.ts
 *
 * Regenerates `packages/theme/src/base/variables.css` from the TypeScript
 * token definitions in `packages/tokens/src/`.
 *
 * Run via:
 *   pnpm tokens:generate
 *   # or directly:
 *   npx tsx scripts/generate-tokens-css.ts
 *
 * Add this to CI to catch token drift:
 *   pnpm tokens:generate && git diff --exit-code packages/theme/src/base/variables.css
 */

import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Dynamic import so the script works both before and after the tokens
// package has been built (we import from source, not dist).
const __dir = dirname(fileURLToPath(import.meta.url));

async function main() {
  const { generateAllCssVars } = await import(
    resolve(__dir, '../packages/tokens/src/css/generate-css-vars.js')
  );

  const css = generateAllCssVars();
  const outPath = resolve(__dir, '../packages/theme/src/base/variables.css');
  writeFileSync(outPath, css, 'utf-8');

  console.log(`✅  Tokens CSS written to ${outPath.replace(resolve(__dir, '..'), '.')}`);
}

main().catch((err) => {
  console.error('❌  Token generation failed:', err);
  process.exit(1);
});
