const fs = require('fs');
let code = fs.readFileSync('src/components/sidebar/SidebarControls.tsx', 'utf-8');

code = code.replace(/export const generateMeshGradient = \(\(colors: string\[\]\)\) => \{/g, 'export const generateMeshGradient = (colors: string[], enable: boolean = true, opacity: number = 0.15, size: number = 0.8) => {');

code = code.replace(
  /export const generateMeshGradient = \(colors: string\[\]\) => \{[\s\S]*?const noiseSVG = `url\("data:image\/svg\+xml,.*?\"\)`(;)?/,
  `export const applyNoise = (str: string, enable: boolean, opacity: number, size: number) => {
  const stripped = str.replace(/url\\("data:image\\/svg\\+xml,[^"]*"\\)(,\\s*)?/, '');
  if (!enable) return stripped;
  const noiseSVG = \`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='\${size}' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='\${opacity}'/%3E%3C/svg%3E")\`;
  return \`\${noiseSVG}, \${stripped}\`;
};

export const generateMeshGradient = (colors: string[], enable: boolean = true, opacity: number = 0.15, size: number = 0.8) => {
  if (!colors || colors.length === 0) return '';
  const noiseSVG = \`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='\${size}' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='\${opacity}'/%3E%3C/svg%3E")\`;`
);

fs.writeFileSync('src/components/sidebar/SidebarControls.tsx', code);
