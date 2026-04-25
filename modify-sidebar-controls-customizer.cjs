const fs = require('fs');
let code = fs.readFileSync('src/components/sidebar/SidebarControls.tsx', 'utf-8');

code = code.replace(
  /import { ChevronDown, Check } from 'lucide-react';/,
  `import { ChevronDown, Check, X, Plus, RotateCcw } from 'lucide-react';\nimport { useTranslation } from '../../i18n';`
);

const customizerCode = `
export const generateMeshGradient = (colors: string[]) => {
  if (!colors || colors.length === 0) return '';
  const noiseSVG = \`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E")\`;
  
  const baseColor = colors[colors.length - 1]; // Use last color as base
  const radials = colors.slice(0, colors.length - 1).map((col) => {
    const x = Math.floor(Math.random() * 100);
    const y = Math.floor(Math.random() * 100);
    const spread = Math.floor(Math.random() * 40) + 40; // 40-80%
    return \`radial-gradient(at \${x}% \${y}%, \${col} 0px, transparent \${spread}%)\`;
  });
  
  // If there's only 1 color, radials is empty
  if (colors.length === 1) {
    return \`\${noiseSVG}, \${baseColor}\`;
  }
  return \`\${noiseSVG}, \${radials.join(', ')}, \${baseColor}\`;
};

export const MeshColorCustomizer = ({
  colors,
  onChange,
  onRandomize
}: {
  colors: string[];
  onChange: (colors: string[]) => void;
  onRandomize: () => void;
}) => {
  const t = useTranslation();
  return (
    <div className="space-y-3 mt-4 pt-4 border-t border-black/10 dark:border-white/10">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium opacity-70">{t.customColors}</label>
        <button
          onClick={onRandomize}
          className="flex items-center justify-center p-1.5 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 rounded-md transition-colors"
          title={t.randomize}
        >
          <RotateCcw size={14} />
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {colors.map((c, i) => (
          <div key={i} className="relative group flex items-center justify-center">
            <ColorPicker color={c} onChange={(newC) => {
              const newColors = [...colors];
              newColors[i] = newC;
              onChange(newColors);
            }} />
            {colors.length > 2 && (
              <button
                onClick={() => {
                  onChange(colors.filter((_, idx) => idx !== i));
                }}
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-[2px] opacity-0 group-hover:opacity-100 transition-opacity scale-75"
              >
                <X size={10} />
              </button>
            )}
          </div>
        ))}
        {colors.length < 5 && (
          <button
            onClick={() => onChange([...colors, '#ffffff'])}
            className="w-8 h-8 rounded-full border border-black/20 dark:border-white/20 border-dashed flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            title={t.addColor}
          >
            <Plus size={14} className="opacity-50" />
          </button>
        )}
      </div>
    </div>
  );
};
`;

code += '\n' + customizerCode;

fs.writeFileSync('src/components/sidebar/SidebarControls.tsx', code);
