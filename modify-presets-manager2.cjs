const fs = require('fs');

let presets = fs.readFileSync('src/components/sidebar/PresetsManager.tsx', 'utf-8');

presets = presets.replace(
  /background: preset\.style\.cardBackgroundType === 'gradient' \? preset\.style\.cardGradientValue : preset\.style\.backgroundColor,/,
  `background: preset.style.cardBackgroundType === 'gradient' || preset.style.cardBackgroundType === 'mesh' ? preset.style.cardGradientValue : preset.style.backgroundColor,`
);

fs.writeFileSync('src/components/sidebar/PresetsManager.tsx', presets);
