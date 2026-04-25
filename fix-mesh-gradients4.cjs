const fs = require('fs');
let store = fs.readFileSync('src/store.ts', 'utf-8');

store = store.replace(/transparent 50%\)"/g, 'transparent 50%)"');
const parts = store.split('export const PRESET_MESH_GRADIENTS = [');
if (parts.length > 1) {
  let sub = parts[1].split('];')[0];
  sub = sub.replace(/value: (["'].*?transparent 50%\)["']),\s*color:\s*["']([^"']+)["']/g, (m, val, col) => {
    return `value: ${val.slice(0, -1)}, ${col}",\n    color: "${col}"`;
  });
  store = parts[0] + 'export const PRESET_MESH_GRADIENTS = [' + sub + '];' + parts[1].split('];')[1];
  fs.writeFileSync('src/store.ts', store);
}
