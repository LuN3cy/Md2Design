const fs = require('fs');

let code = fs.readFileSync('src/components/sidebar/SidebarControls.tsx', 'utf-8');

code = code.replace(
  /import \{ ChevronDown, Check, X, Plus, RotateCcw \} from 'lucide-react';/,
  `import { ChevronDown, Check, X, Plus, RotateCcw, Shuffle } from 'lucide-react';`
);

const oldCustomizer = `
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
            <CompactColorPicker color={c} onChange={(newC) => {
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

const newCustomizer = `
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
      <label className="text-xs font-medium opacity-70 block">{t.customColors}</label>
      <div className="flex items-center gap-3">
        <div className="flex flex-wrap gap-2 flex-1">
          {colors.map((c, i) => (
            <div key={i} className="relative group flex items-center justify-center">
              <CompactColorPicker color={c} onChange={(newC) => {
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
        
        <button
          onClick={onRandomize}
          className="flex flex-col items-center justify-center h-8 px-3 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 rounded-md transition-colors shrink-0"
          title={t.randomize}
        >
          <div className="flex items-center gap-1.5">
            <Shuffle size={12} className="opacity-70" />
            <span className="text-[10px] font-medium opacity-70">{t.randomize}</span>
          </div>
        </button>
      </div>
    </div>
  );
};
`;

code = code.replace(oldCustomizer.trim(), newCustomizer.trim());

fs.writeFileSync('src/components/sidebar/SidebarControls.tsx', code);
