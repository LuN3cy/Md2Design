const fs = require('fs');
let i18n = fs.readFileSync('src/i18n.ts', 'utf-8');

i18n = i18n.replace(
  /customColors: 'Custom Colors',/,
  `customColors: 'Custom Colors',\n    noiseControls: 'Noise Controls',\n    enableNoise: 'Enable Noise',\n    noiseDensity: 'Density',\n    noiseSize: 'Size',`
);

i18n = i18n.replace(
  /customColors: '自定义颜色',/,
  `customColors: '自定义颜色',\n    noiseControls: '噪点控制',\n    enableNoise: '开启噪点',\n    noiseDensity: '密度',\n    noiseSize: '尺寸',`
);

fs.writeFileSync('src/i18n.ts', i18n);
