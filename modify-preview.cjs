const fs = require('fs');

let preview = fs.readFileSync('src/components/Preview.tsx', 'utf-8');

preview = preview.replace(
  /\} else if \(type === 'gradient'\) \{/,
  `} else if (type === 'gradient' || type === 'mesh') {`
);

fs.writeFileSync('src/components/Preview.tsx', preview);
