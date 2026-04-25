const fs = require('fs');
let store = fs.readFileSync('src/store.ts', 'utf-8');

store = store.replace(
  /backgroundType: 'solid' \| 'gradient' \| 'image';/,
  `backgroundType: 'solid' | 'gradient' | 'image' | 'mesh';`
);

store = store.replace(
  /cardBackgroundType: 'solid' \| 'gradient' \| 'image';/,
  `cardBackgroundType: 'solid' | 'gradient' | 'image' | 'mesh';`
);

const meshPresets = `export const PRESET_MESH_GRADIENTS = [
  {
    name: "Cosmic Magic",
    value: "url(\\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E\\"), radial-gradient(at 80% 0%, hsla(289,100%,56%,1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(335,100%,53%,1) 0px, transparent 50%), radial-gradient(at 80% 50%, hsla(240,100%,56%,1) 0px, transparent 50%), radial-gradient(at 0% 100%, hsla(22,100%,77%,1) 0px, transparent 50%), #341d65",
    color: "#341d65"
  },
  {
    name: "Sunset Vibes",
    value: "url(\\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E\\"), radial-gradient(at 40% 20%, hsla(28,100%,74%,1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(355,100%,76%,1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355,100%,93%,1) 0px, transparent 50%), radial-gradient(at 80% 100%, hsla(22,100%,77%,1) 0px, transparent 50%), #ff9a9e",
    color: "#ff9a9e"
  },
  {
    name: "Ocean Depths",
    value: "url(\\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E\\"), radial-gradient(at 40% 20%, hsla(210,100%,44%,1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(230,100%,63%,1) 0px, transparent 50%), radial-gradient(at 80% 100%, hsla(180,100%,70%,1) 0px, transparent 50%), #09203f",
    color: "#09203f"
  },
  {
    name: "Minty Dream",
    value: "url(\\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E\\"), radial-gradient(at 20% 20%, hsla(140,100%,74%,1) 0px, transparent 50%), radial-gradient(at 80% 10%, hsla(160,100%,56%,1) 0px, transparent 50%), radial-gradient(at 10% 80%, hsla(180,100%,63%,1) 0px, transparent 50%), radial-gradient(at 80% 90%, hsla(120,100%,70%,1) 0px, transparent 50%), #a8ff78",
    color: "#a8ff78"
  },
  {
    name: "Peach Sorbet",
    value: "url(\\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E\\"), radial-gradient(at 10% 10%, hsla(350,100%,84%,1) 0px, transparent 50%), radial-gradient(at 90% 20%, hsla(20,100%,76%,1) 0px, transparent 50%), radial-gradient(at 30% 80%, hsla(40,100%,83%,1) 0px, transparent 50%), radial-gradient(at 80% 90%, hsla(330,100%,70%,1) 0px, transparent 50%), #ffecd2",
    color: "#ffecd2"
  },
  {
    name: "Neon Glow",
    value: "url(\\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E\\"), radial-gradient(at 20% 20%, hsla(290,100%,54%,1) 0px, transparent 50%), radial-gradient(at 80% 10%, hsla(220,100%,56%,1) 0px, transparent 50%), radial-gradient(at 10% 80%, hsla(330,100%,63%,1) 0px, transparent 50%), radial-gradient(at 80% 90%, hsla(260,100%,70%,1) 0px, transparent 50%), #ff0844",
    color: "#ff0844"
  },
  {
    name: "Soft Lavender",
    value: "url(\\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E\\"), radial-gradient(at 10% 20%, hsla(260,100%,84%,1) 0px, transparent 50%), radial-gradient(at 80% 10%, hsla(280,100%,76%,1) 0px, transparent 50%), radial-gradient(at 20% 80%, hsla(240,100%,83%,1) 0px, transparent 50%), radial-gradient(at 90% 90%, hsla(300,100%,70%,1) 0px, transparent 50%), #e0c3fc",
    color: "#e0c3fc"
  },
  {
    name: "Golden Hour",
    value: "url(\\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E\\"), radial-gradient(at 20% 10%, hsla(30,100%,64%,1) 0px, transparent 50%), radial-gradient(at 80% 20%, hsla(10,100%,56%,1) 0px, transparent 50%), radial-gradient(at 10% 90%, hsla(50,100%,63%,1) 0px, transparent 50%), radial-gradient(at 90% 80%, hsla(340,100%,70%,1) 0px, transparent 50%), #f6d365",
    color: "#f6d365"
  }
];\n\n`;

store = store.replace(
  /export const PRESET_GRADIENTS = \[/,
  meshPresets + `export const PRESET_GRADIENTS = [`
);

fs.writeFileSync('src/store.ts', store);
