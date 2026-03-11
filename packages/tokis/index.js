/**
 * @tokis/tokis — Performance-first, token-native UI design system
 *
 * This meta-package re-exports everything from the Tokis ecosystem:
 *   @tokis/react   — React components, hooks, and context
 *   @tokis/theme   — Precompiled CSS (variables, reset, component styles)
 *   @tokis/core    — Headless primitives (state machines, a11y, focus)
 *   @tokis/tokens  — Design token definitions (TypeScript + JSON)
 *   @tokis/icons   — Tree-shakable SVG icons with Lucide support
 */
'use strict';

const react = require('@tokis/react');
const icons = require('@tokis/icons');

module.exports = { ...react, ...icons };
