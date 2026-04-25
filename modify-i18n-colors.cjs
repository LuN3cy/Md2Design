const fs = require('fs');
let i18n = fs.readFileSync('src/i18n.ts', 'utf-8');

i18n = i18n.replace(
  /gradient: 'Gradient',\n\s*mesh: 'Mesh',/,
  `gradient: 'Gradient',\n    mesh: 'Mesh',\n    customColors: 'Custom Colors',\n    randomize: 'Randomize',\n    addColor: 'Add Color',`
);

i18n = i18n.replace(
  /gradient: '渐变',\n\s*mesh: '弥散',/,
  `gradient: '渐变',\n    mesh: '弥散',\n    customColors: '自定义颜色',\n    randomize: '随机生成',\n    addColor: '添加颜色',`
);

fs.writeFileSync('src/i18n.ts', i18n);
