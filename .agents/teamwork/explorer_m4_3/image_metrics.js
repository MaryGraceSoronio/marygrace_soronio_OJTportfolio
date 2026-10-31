import fs from 'node:fs';
import path from 'node:path';

function getPngDimensions(buf) {
  if (buf.length > 24 && buf.toString('ascii', 1, 4) === 'PNG') {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }
  return null;
}

function getJpgDimensions(buf) {
  if (buf.length > 4 && buf[0] === 0xff && buf[1] === 0xd8) {
    let offset = 2;
    while (offset < buf.length) {
      if (buf[offset] !== 0xff) break;
      const marker = buf[offset + 1];
      if (marker === 0xc0 || marker === 0xc2) {
        return {
          height: buf.readUInt16BE(offset + 5),
          width: buf.readUInt16BE(offset + 7)
        };
      }
      const length = buf.readUInt16BE(offset + 2);
      offset += 2 + length;
    }
  }
  return null;
}

const publicDir = path.resolve('public/work');
console.log('=== PUBLIC/WORK IMAGES DIMENSIONS & ASPECT RATIOS ===');
for (const f of fs.readdirSync(publicDir)) {
  const filePath = path.join(publicDir, f);
  const buf = fs.readFileSync(filePath);
  const dims = getPngDimensions(buf) || getJpgDimensions(buf) || { width: '?', height: '?' };
  const ar = typeof dims.width === 'number' ? (dims.width / dims.height).toFixed(2) : 'AVIF/other';
  console.log(`${f.padEnd(32)} ${(buf.length / 1024).toFixed(1).padStart(7)} KB | ${String(dims.width).padStart(4)}x${String(dims.height).padStart(4)} | AR: ${ar}`);
}

const sourcesDir = path.resolve('Sources/PROJECT PICTURES');
console.log('\n=== SOURCES/PROJECT PICTURES IMAGES DIMENSIONS & ASPECT RATIOS ===');
for (const folder of fs.readdirSync(sourcesDir)) {
  const folderPath = path.join(sourcesDir, folder);
  if (fs.statSync(folderPath).isDirectory()) {
    console.log(`\nFolder: ${folder}`);
    for (const f of fs.readdirSync(folderPath)) {
      if (f.endsWith('.pdf')) continue;
      const filePath = path.join(folderPath, f);
      const buf = fs.readFileSync(filePath);
      const dims = getPngDimensions(buf) || getJpgDimensions(buf) || { width: '?', height: '?' };
      const ar = typeof dims.width === 'number' ? (dims.width / dims.height).toFixed(2) : 'AVIF/other';
      console.log(`  ${f.padEnd(32)} ${(buf.length / 1024).toFixed(1).padStart(7)} KB | ${String(dims.width).padStart(4)}x${String(dims.height).padStart(4)} | AR: ${ar}`);
    }
  }
}
