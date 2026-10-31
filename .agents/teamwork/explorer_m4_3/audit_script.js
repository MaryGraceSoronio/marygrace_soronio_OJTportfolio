import fs from 'node:fs';
import path from 'node:path';
import { projects } from '../../../src/data/projects.js';

const publicWorkDir = path.resolve('public/work');
const sourcesPicsDir = path.resolve('Sources/PROJECT PICTURES');

console.log('=== 1. FILES IN public/work ===');
const publicFiles = fs.readdirSync(publicWorkDir);
console.log(`Total: ${publicFiles.length} files`);
for (const f of publicFiles) {
  const stat = fs.statSync(path.join(publicWorkDir, f));
  console.log(`- ${f} (${(stat.size / 1024).toFixed(1)} KB)`);
}

console.log('\n=== 2. SOURCES / PROJECT PICTURES INVENTORY ===');
const sourceFolders = fs.readdirSync(sourcesPicsDir);
const sourcesInventory = {};
for (const folder of sourceFolders) {
  const folderPath = path.join(sourcesPicsDir, folder);
  if (fs.statSync(folderPath).isDirectory()) {
    const files = fs.readdirSync(folderPath);
    sourcesInventory[folder] = files.map(f => {
      const s = fs.statSync(path.join(folderPath, f));
      return { file: f, size: s.size };
    });
  }
}

for (const [folder, files] of Object.entries(sourcesInventory)) {
  console.log(`\nFolder: [${folder}] (${files.length} items)`);
  for (const item of files) {
    console.log(`  • ${item.file} (${(item.size / 1024).toFixed(1)} KB)`);
  }
}

console.log('\n=== 3. AUDIT OF 17 PROJECTS IN src/data/projects.js ===');
for (const p of projects) {
  console.log(`\n--------------------------------------------------`);
  console.log(`Project #${p.order}: [${p.slug}] - ${p.title}`);
  console.log(`Category: ${p.category} (${p.categoryLabel})`);
  console.log(`Image: ${p.image}`);
  const imgPath = p.image ? path.resolve('public', p.image.replace(/^\//, '')) : null;
  const imgExists = imgPath && fs.existsSync(imgPath);
  console.log(`  -> Exists in public? ${imgExists} (${imgPath})`);

  console.log(`Gallery (${p.gallery ? p.gallery.length : 0} items):`);
  if (p.gallery) {
    for (const g of p.gallery) {
      const gPath = path.resolve('public', g.replace(/^\//, ''));
      const gExists = fs.existsSync(gPath);
      console.log(`  -> ${g}: ${gExists ? 'EXISTS' : 'MISSING'}`);
    }
  }
}
