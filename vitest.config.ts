import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

// ESM-safe __dirname (works on all platforms including Windows)
const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./scripts/test-setup.ts'],
    include: ['packages/*/src/**/*.test.{ts,tsx}'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'json-summary', 'html'],
      reportsDirectory: './coverage',
      include: [
        'packages/core/src/**/*.{ts,tsx}',
        'packages/react/src/**/*.{ts,tsx}',
        'packages/icons/src/**/*.{ts,tsx}',
      ],
      exclude: [
        '**/*.d.ts',
        '**/index.ts',
        '**/*.types.ts',
        '**/__tests__/**',
        '**/test-setup.ts',
        '**/node_modules/**',
      ],
    },
  },
  resolve: {
    alias: {
      '@tokis/core': resolve(__dirname, 'packages/core/src/index.ts'),
      '@tokis/tokens': resolve(__dirname, 'packages/tokens/src/index.ts'),
      '@tokis/icons': resolve(__dirname, 'packages/icons/src/index.ts'),
    },
    // Strip .js from imports so Vitest resolves the TypeScript source
    extensions: ['.mts', '.cts', '.ts', '.tsx', '.mjs', '.cjs', '.js', '.jsx', '.json'],
  },
});
