const fs = require('fs');

let store = fs.readFileSync('src/store.ts', 'utf-8');

store = store.replace(
  /backgroundType: 'solid' \| 'gradient' \| 'image' \| 'mesh';/,
  `backgroundType: 'solid' | 'gradient' | 'image' | 'mesh';\n  meshColors: string[];`
);

store = store.replace(
  /cardBackgroundType: 'solid' \| 'gradient' \| 'image' \| 'mesh';/,
  `cardBackgroundType: 'solid' | 'gradient' | 'image' | 'mesh';\n  cardMeshColors: string[];`
);

store = store.replace(
  /backgroundValue: 'linear-gradient\(135deg, #d4dcdd 0%, #94b1cc 100%\)',/,
  `backgroundValue: 'linear-gradient(135deg, #d4dcdd 0%, #94b1cc 100%)',\n  meshColors: ['#ff9a9e', '#fecfef', '#a1c4fd'],`
);

store = store.replace(
  /cardGradientValue: 'linear-gradient\(135deg, #ffffff 0%, #f0f0f0 100%\)',/,
  `cardGradientValue: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',\n  cardMeshColors: ['#ff9a9e', '#fecfef', '#a1c4fd'],`
);

store = store.replace(/version: 7,/, 'version: 8,');

const migration = `if (version <= 7) {
          if (persistedState.cardStyle) {
            persistedState.cardStyle = {
              ...persistedState.cardStyle,
              meshColors: persistedState.cardStyle.meshColors || ['#ff9a9e', '#fecfef', '#a1c4fd'],
              cardMeshColors: persistedState.cardStyle.cardMeshColors || ['#ff9a9e', '#fecfef', '#a1c4fd'],
            };
          }
        }

        if (version <= 6) {`;

store = store.replace(/if \(version <= 6\) \{/, migration);

fs.writeFileSync('src/store.ts', store);
