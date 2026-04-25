const fs = require('fs');
let code = fs.readFileSync('src/components/sidebar/SidebarControls.tsx', 'utf-8');

const newGen = `
export const generateMeshGradient = (colors: string[], enable: boolean = true, opacity: number = 0.15, size: number = 0.8) => {
  if (!colors || colors.length === 0) return '';
  const noiseSVG = \`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='\${size}' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='\${opacity}'/%3E%3C/svg%3E")\`;

  const baseColor = colors[colors.length - 1]; // Use last color as base
  const radials = colors.slice(0, colors.length - 1).map((col) => {
    const x = Math.floor(Math.random() * 100);
    const y = Math.floor(Math.random() * 100);
    const spread = Math.floor(Math.random() * 40) + 40; // 40-80%
    return \`radial-gradient(at \${x}% \${y}%, \${col} 0px, transparent \${spread}%)\`;
  });

  // If there's only 1 color, radials is empty
  if (colors.length === 1) {
    return enable ? \`\${noiseSVG}, \${baseColor}\` : baseColor;
  }
  return enable ? \`\${noiseSVG}, \${radials.join(', ')}, \${baseColor}\` : \`\${radials.join(', ')}, \${baseColor}\`;
};
`;

code = code.replace(
  /export const generateMeshGradient = \([\s\S]*?return `\$\{noiseSVG\}, \$\{radials\.join\(', '\)\}, \$\{baseColor\}`;[\s\n]*\};/,
  newGen.trim()
);

fs.writeFileSync('src/components/sidebar/SidebarControls.tsx', code);
