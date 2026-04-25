const fs = require('fs');
let store = fs.readFileSync('src/store.ts', 'utf-8');

store = store.replace(/value:\s*"([^"]*?transparent 50%\))",\s*color:\s*"([^"]+)"/g, (match, val, col) => {
  return `value: "${val}, ${col}",\n    color: "${col}"`;
});

fs.writeFileSync('src/store.ts', store);
