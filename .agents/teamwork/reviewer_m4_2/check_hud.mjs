import fs from 'node:fs';

const detailContent = fs.readFileSync('src/pages/ProjectDetail.jsx', 'utf8');

// Match each block in PROJECT_HUD
const hudBlockMatch = detailContent.match(/export const PROJECT_HUD = \{([\s\S]*?)\n\}/);
const hudBlock = hudBlockMatch[1];

// Extract individual project blocks
const entries = hudBlock.split(/\n\s{2}['"]?([a-z0-9-]+)['"]?:\s*\{/g);
// entries[0] is empty or whitespace
let incomplete = 0;
for (let i = 1; i < entries.length; i += 2) {
  const slug = entries[i];
  const body = entries[i + 1];
  const required = ['processor', 'sensors', 'protocols', 'software', 'tools'];
  for (const field of required) {
    if (!new RegExp(`${field}:\\s*['"]`).test(body)) {
      console.error(`Missing field ${field} in HUD for ${slug}`);
      incomplete++;
    }
  }
}

console.log('Incomplete HUD entries:', incomplete);
if (incomplete === 0) {
  console.log('All 17 project HUD entries have all 5 cells defined!');
}
