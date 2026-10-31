// tests/helpers/static-checker.js
// Static code, CSS token, asset, and markdown verifier utilities

import fs from 'node:fs';
import path from 'node:path';

export const ROOT_DIR = path.resolve(import.meta.dirname, '..', '..');

export function checkFileExists(relPath) {
  const fullPath = path.resolve(ROOT_DIR, relPath);
  return {
    exists: fs.existsSync(fullPath),
    fullPath,
    stats: fs.existsSync(fullPath) ? fs.statSync(fullPath) : null,
  };
}

export function readFileContent(relPath) {
  const { exists, fullPath } = checkFileExists(relPath);
  if (!exists) return null;
  return fs.readFileSync(fullPath, 'utf8');
}

export function calculateLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function calculateContrastRatio(rgb1, rgb2) {
  const lum1 = calculateLuminance(...rgb1);
  const lum2 = calculateLuminance(...rgb2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

export function parseHexColor(hex) {
  hex = hex.replace('#', '');
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  const num = parseInt(hex, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

export function verifyCssContainsTokens(cssContent, expectedTokens) {
  const results = {};
  for (const token of expectedTokens) {
    results[token] = cssContent.includes(token);
  }
  return results;
}
