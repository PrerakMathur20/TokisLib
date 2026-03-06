const fs = require('fs');
const path = require('path');

const base = '/Users/p0m08f9/Prerak/Dev/Tokis';

const dirs = [
  'packages/theme/src/base',
  'packages/theme/src/components',
  'packages/theme/src/utilities',
  'packages/core/src/primitives/accordion',
  'packages/core/src/primitives/checkbox',
  'packages/core/src/primitives/dialog',
  'packages/core/src/primitives/drawer',
  'packages/core/src/primitives/menu',
  'packages/core/src/primitives/select',
  'packages/core/src/primitives/switch',
  'packages/core/src/primitives/tabs',
  'packages/core/src/primitives/tooltip',
  'packages/react/src/components/accordion',
  'packages/react/src/components/alert',
  'packages/react/src/components/avatar',
  'packages/react/src/components/badge',
  'packages/react/src/components/breadcrumbs',
  'packages/react/src/components/card',
  'packages/react/src/components/checkbox',
  'packages/react/src/components/chip',
  'packages/react/src/components/dialog',
  'packages/react/src/components/divider',
  'packages/react/src/components/drawer',
  'packages/react/src/components/input',
  'packages/react/src/components/layout',
  'packages/react/src/components/link',
  'packages/react/src/components/list',
  'packages/react/src/components/menu',
  'packages/react/src/components/pagination',
  'packages/react/src/components/popover',
  'packages/react/src/components/portal',
  'packages/react/src/components/progress',
  'packages/react/src/components/radio',
  'packages/react/src/components/select',
  'packages/react/src/components/skeleton',
  'packages/react/src/components/slider',
  'packages/react/src/components/snackbar',
  'packages/react/src/components/spinner',
  'packages/react/src/components/switch',
  'packages/react/src/components/table',
  'packages/react/src/components/tabs',
  'packages/react/src/components/tag',
  'packages/react/src/components/tooltip',
  'packages/react/src/components/typography',
];

dirs.forEach(d => {
  const full = path.join(base, d);
  fs.mkdirSync(full, { recursive: true });
});
console.log('Created ' + dirs.length + ' directories');

