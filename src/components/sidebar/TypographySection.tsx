import { Plus, Type } from 'lucide-react';
import { useStore } from '../../store';
import { useTranslation } from '../../i18n';
import { SidebarSection, AdvancedToggle } from './SidebarSection';
import { DraggableNumberInput, ParameterIcon, CustomSelect } from './SidebarControls';
import type { LocalFont } from '../../utils/fonts';

interface TypographySectionProps {
  localFonts: LocalFont[];
}

export const TypographySection = ({ localFonts }: TypographySectionProps) => {
  const { cardStyle, updateCardStyle, addCustomFont } = useStore();
  const t = useTranslation();

  return (
    <SidebarSection title={t.typography} icon={<Type size={16} />}>
      {/* Current Font Display */}
      <div className="bg-black/5 dark:bg-white/5 p-4 rounded-lg border border-black/10 dark:border-white/10 mb-4 text-center">
        <div className="text-xs opacity-50 mb-1 uppercase tracking-wider">{t.currentFont}</div>
        <div className="text-xl font-bold truncate" style={{ fontFamily: cardStyle.fontFamily }}>
          {cardStyle.fontFamily}
        </div>
      </div>

      {/* Preset Fonts */}
      <div className="mb-4">
        <label className="text-xs font-medium mb-2 block opacity-70">{t.presetFonts}</label>
        <div className="grid grid-cols-2 gap-2">
          {['GoogleSans-Regular', 'serif', 'monospace', 'Arial'].map((font) => (
            <button
              key={font}
              onClick={() => updateCardStyle({ fontFamily: font })}
              className={`p-2 rounded text-xs border transition-all ${
                cardStyle.fontFamily === font 
                  ? 'bg-black/10 dark:bg-white/20 border-black/20 dark:border-white/40 shadow-sm' 
                  : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10'
              }`}
              style={{ fontFamily: font }}
            >
              {font}
            </button>
          ))}
        </div>
      </div>
      
      {/* More Local Preset Fonts */}
      <div className="mb-4">
        <label className="text-xs font-medium mb-2 block opacity-70">{t.morePresets}</label>
        <CustomSelect
          value={localFonts.some(f => f.name === cardStyle.fontFamily) ? cardStyle.fontFamily : ""}
          options={localFonts.map(f => ({ name: f.name, value: f.name }))}
          placeholder={t.morePresets}
          onChange={(fontName) => {
            updateCardStyle({ fontFamily: fontName });
          }}
        />
      </div>
      
      <div className="mb-4">
        <label className="text-xs font-medium opacity-70 mb-2 block">{t.fontSize}</label>
        <DraggableNumberInput value={cardStyle.fontSize} min={12} max={96} onChange={(val) => updateCardStyle({ fontSize: val })} icon={<ParameterIcon type="fontSize" />} />
      </div>

      <AdvancedToggle label={t.advancedTypography}>
        {/* Custom Fonts Selection */}
        {cardStyle.customFonts.length > 0 && (
          <div className="mb-4">
            <label className="text-xs font-medium mb-2 block opacity-70">{t.customFonts}</label>
            <div className="grid grid-cols-2 gap-2 mb-2">
              {cardStyle.customFonts.map(font => (
                <button
                  key={font.name}
                  onClick={() => updateCardStyle({ fontFamily: font.name })}
                  className={`p-2 rounded text-xs border transition-all truncate ${
                    cardStyle.fontFamily === font.name 
                      ? 'bg-black/10 dark:bg-white/20 border-black/20 dark:border-white/40 shadow-sm' 
                      : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10'
                  }`}
                  style={{ fontFamily: font.name }}
                >
                  {font.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Add Custom Font */}
        <div className="mb-4">
           <div className="relative">
             <input 
               type="file" 
               accept=".ttf,.otf,.woff,.woff2"
               onChange={(e) => {
                 const file = e.target.files?.[0];
                 if (file) {
                   const name = file.name.replace(/\.[^/.]+$/, "");
                   const reader = new FileReader();
                   reader.onload = (event) => {
                     if (event.target?.result) {
                       const url = event.target.result as string;
                       
                       const exists = cardStyle.customFonts.some(f => f.name === name);
                       
                       const isVariable = name.toLowerCase().includes('variable') || 
                                          name.toLowerCase().includes('var') ||
                                          name.toLowerCase().includes('vf');
                       
                       if (!exists) {
                         addCustomFont({ 
                           name, 
                           url, 
                           weight: isVariable ? 'variable' : 'normal' 
                         });
                       }
                       
                       setTimeout(() => {
                         updateCardStyle({ fontFamily: name });
                       }, 100);
                     }
                   };
                   reader.readAsDataURL(file);
                 }
                 e.target.value = '';
               }}
               className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
             />
             <button className="w-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-xs py-2 rounded transition-colors flex items-center justify-center gap-2">
               <Plus size={14} /> {t.uploadFont}
             </button>
           </div>
           
           {cardStyle.customFonts.find(f => f.name === cardStyle.fontFamily) && (
             <div className="mt-2 flex items-center justify-between px-1">
               <label className="text-[10px] opacity-60 cursor-pointer flex items-center gap-2">
                 <input 
                   type="checkbox"
                   checked={cardStyle.customFonts.find(f => f.name === cardStyle.fontFamily)?.weight === 'variable'}
                   onChange={(e) => {
                     const font = cardStyle.customFonts.find(f => f.name === cardStyle.fontFamily);
                     if (font) {
                       const newFonts = cardStyle.customFonts.map(f => 
                         f.name === font.name ? { ...f, weight: e.target.checked ? 'variable' : 'normal' } : f
                       );
                       updateCardStyle({ customFonts: newFonts });
                     }
                   }}
                   className="rounded border-black/20 dark:border-white/20 bg-black/10 dark:bg-white/10"
                 />
                 <span>{t.variableFont} ({t.enableAllWeights})</span>
               </label>
             </div>
           )}
        </div>
        
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div>
            <label className="text-[10px] uppercase tracking-wider opacity-60 mb-1 block">{t.h1FontSize}</label>
            <DraggableNumberInput value={cardStyle.h1FontSize} min={16} max={48} onChange={(val) => updateCardStyle({ h1FontSize: val })} icon={<ParameterIcon type="fontSize" />} />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider opacity-60 mb-1 block">{t.h2FontSize}</label>
            <DraggableNumberInput value={cardStyle.h2FontSize} min={14} max={36} onChange={(val) => updateCardStyle({ h2FontSize: val })} icon={<ParameterIcon type="fontSize" />} />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider opacity-60 mb-1 block">{t.h3FontSize}</label>
            <DraggableNumberInput value={cardStyle.h3FontSize} min={12} max={24} onChange={(val) => updateCardStyle({ h3FontSize: val })} icon={<ParameterIcon type="fontSize" />} />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium opacity-70 mb-2 block">{t.headingScale}</label>
          <DraggableNumberInput value={cardStyle.headingScale} min={0.5} max={2.0} step={0.1} onChange={(val) => updateCardStyle({ headingScale: val })} icon={<ParameterIcon type="fontSize" />} />
        </div>
      </AdvancedToggle>
    </SidebarSection>
  );
};
