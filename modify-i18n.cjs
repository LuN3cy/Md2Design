const fs = require('fs');
let i18n = fs.readFileSync('src/i18n.ts', 'utf-8');

i18n = i18n.replace(
  /gradient: 'Gradient',/,
  `gradient: 'Gradient',\n    mesh: 'Mesh',`
);

i18n = i18n.replace(
  /gradient: '渐变',/,
  `gradient: '渐变',\n    mesh: '弥散',`
);

fs.writeFileSync('src/i18n.ts', i18n);
