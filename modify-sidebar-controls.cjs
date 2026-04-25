const fs = require('fs');

let controls = fs.readFileSync('src/components/sidebar/SidebarControls.tsx', 'utf-8');

controls = controls.replace(
  /import \{ PRESET_GRADIENTS \} from '\.\.\/\.\.\/store';/,
  `import { PRESET_GRADIENTS, PRESET_MESH_GRADIENTS } from '../../store';`
);

const meshPresetsComp = `export const MeshGradientPresets = ({ onSelect }: { onSelect: (value: string) => void }) => {
  return (
    <div className="grid grid-cols-4 gap-2 mt-2">
      {PRESET_MESH_GRADIENTS.map((g, i) => (
        <button
          key={i}
          onClick={() => onSelect(g.value)}
          className="w-full aspect-square rounded-md border border-black/10 dark:border-white/10 transition-transform active:scale-95 hover:scale-105 relative overflow-hidden"
          style={{ background: g.value }}
          title={g.name}
        >
          {/* A small overlay to make it look nicer if needed */}
        </button>
      ))}
    </div>
  );
};
`;

controls += '\n\n' + meshPresetsComp;

fs.writeFileSync('src/components/sidebar/SidebarControls.tsx', controls);
