const fs = require('fs');

let code = fs.readFileSync('src/components/sidebar/PresetCard.tsx', 'utf-8');

code = code.replace(
  /if \(style\.backgroundType === 'gradient'\) \{/,
  `if (style.backgroundType === 'gradient' || style.backgroundType === 'mesh') {`
);

code = code.replace(
  /\} else if \(type === 'gradient'\) \{/,
  `} else if (type === 'gradient' || type === 'mesh') {`
);

fs.writeFileSync('src/components/sidebar/PresetCard.tsx', code);
