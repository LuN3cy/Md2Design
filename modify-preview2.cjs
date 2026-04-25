const fs = require('fs');

let preview = fs.readFileSync('src/components/Preview.tsx', 'utf-8');

preview = preview.replace(
  /\} else if \(cardStyle\.backgroundType === 'gradient'\) \{/,
  `} else if (cardStyle.backgroundType === 'gradient' || cardStyle.backgroundType === 'mesh') {`
);

fs.writeFileSync('src/components/Preview.tsx', preview);
