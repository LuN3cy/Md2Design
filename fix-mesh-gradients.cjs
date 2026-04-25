const fs = require('fs');
let store = fs.readFileSync('src/store.ts', 'utf-8');

store = store.replace(/value: "(url[^"]+)",\s*color: "([^"]+)"/g, 'value: "$1, $2",\n    color: "$2"');

fs.writeFileSync('src/store.ts', store);
