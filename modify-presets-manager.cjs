const fs = require('fs');

let presets = fs.readFileSync('src/components/sidebar/PresetsManager.tsx', 'utf-8');

presets = presets.replace(
  /\? \(preset\.style\.backgroundType === 'gradient' \? preset\.style\.backgroundValue : \(preset\.style\.backgroundType === 'solid' \? preset\.style\.backgroundValue : '#000'\)\)/,
  `? (preset.style.backgroundType === 'gradient' || preset.style.backgroundType === 'mesh' ? preset.style.backgroundValue : (preset.style.backgroundType === 'solid' ? preset.style.backgroundValue : '#000'))`
);

presets = presets.replace(
  /: \(preset\.style\.cardBackgroundType === 'gradient' \? preset\.style\.cardGradientValue : preset\.style\.backgroundColor\)/,
  `: (preset.style.cardBackgroundType === 'gradient' || preset.style.cardBackgroundType === 'mesh' ? preset.style.cardGradientValue : preset.style.backgroundColor)`
);

fs.writeFileSync('src/components/sidebar/PresetsManager.tsx', presets);
