const fs = require('fs');

let store = fs.readFileSync('src/store.ts', 'utf-8');

store = store.replace(
  /meshColors: string\[\];/,
  `meshColors: string[];\n  meshNoiseEnable: boolean;\n  meshNoiseOpacity: number;\n  meshNoiseSize: number;`
);

store = store.replace(
  /cardMeshColors: string\[\];/,
  `cardMeshColors: string[];\n  cardMeshNoiseEnable: boolean;\n  cardMeshNoiseOpacity: number;\n  cardMeshNoiseSize: number;`
);

store = store.replace(
  /meshColors: \['#ff9a9e', '#fecfef', '#a1c4fd'\],/,
  `meshColors: ['#ff9a9e', '#fecfef', '#a1c4fd'],\n  meshNoiseEnable: true,\n  meshNoiseOpacity: 0.15,\n  meshNoiseSize: 0.8,`
);

store = store.replace(
  /cardMeshColors: \['#ff9a9e', '#fecfef', '#a1c4fd'\],/,
  `cardMeshColors: ['#ff9a9e', '#fecfef', '#a1c4fd'],\n  cardMeshNoiseEnable: true,\n  cardMeshNoiseOpacity: 0.15,\n  cardMeshNoiseSize: 0.8,`
);

store = store.replace(/version: 8,/, 'version: 9,');

const migration = `if (version <= 8) {
          if (persistedState.cardStyle) {
            persistedState.cardStyle = {
              ...persistedState.cardStyle,
              meshNoiseEnable: persistedState.cardStyle.meshNoiseEnable ?? true,
              meshNoiseOpacity: persistedState.cardStyle.meshNoiseOpacity ?? 0.15,
              meshNoiseSize: persistedState.cardStyle.meshNoiseSize ?? 0.8,
              cardMeshNoiseEnable: persistedState.cardStyle.cardMeshNoiseEnable ?? true,
              cardMeshNoiseOpacity: persistedState.cardStyle.cardMeshNoiseOpacity ?? 0.15,
              cardMeshNoiseSize: persistedState.cardStyle.cardMeshNoiseSize ?? 0.8,
            };
          }
        }

        if (version <= 7) {`;

store = store.replace(/if \(version <= 7\) \{/, migration);

fs.writeFileSync('src/store.ts', store);
