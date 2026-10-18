import fs from 'node:fs';
import path from 'node:path';
import { esc } from './layout.mjs';

export const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

export const host = url => {
  try { return new URL(url).host.replace(/^www\./, ''); } catch { return ''; }
};

// Reads the real pixel size of a webp so every <img> gets width/height (no layout shift).
const sizeCache = new Map();
export function webpSize(rel) {
  if (sizeCache.has(rel)) return sizeCache.get(rel);
  const file = path.join(ROOT, rel);
  let out = null;
  try {
    const b = fs.readFileSync(file);
    const fourcc = b.toString('ascii', 12, 16);
    if (fourcc === 'VP8X') out = { w: 1 + b.readUIntLE(24, 3), h: 1 + b.readUIntLE(27, 3) };
    else if (fourcc === 'VP8 ') out = { w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff };
    else if (fourcc === 'VP8L') { const n = b.readUInt32LE(21); out = { w: (n & 0x3fff) + 1, h: ((n >> 14) & 0x3fff) + 1 }; }
  } catch { /* missing image */ }
  sizeCache.set(rel, out);
  return out;
}

export const hasShot = (slug, file) => fs.existsSync(path.join(ROOT, 'assets/work', slug, `${file}.webp`));

// Desktop shots: <file>.webp (2x) + <file>-1440.webp (1x). Phone shots: <file>.webp (3x) + <file>-390.webp.
export function shotImg(p, file, { sizes = '100vw', alt = '', lazy = true, phone = false, cls = '' } = {}) {
  const base = `/assets/work/${p.slug}/${file}`;
  const small = phone ? `${base}-390.webp` : `${base}-1440.webp`;
  const big = `${base}.webp`;
  const dim = webpSize(small.slice(1)) || (phone ? { w: 390, h: 844 } : { w: 1440, h: 900 });
  const bigW = webpSize(big.slice(1))?.w || dim.w * 2;
  return `<img${cls ? ` class="${cls}"` : ''} src="${small}" srcset="${small} ${dim.w}w, ${big} ${bigW}w" sizes="${sizes}" width="${dim.w}" height="${dim.h}" alt="${esc(alt)}"${lazy ? ' loading="lazy" decoding="async"' : ' decoding="async"'}>`;
}
