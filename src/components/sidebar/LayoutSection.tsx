import { Layout, Monitor, Monitor as MonitorIcon, Smartphone, StretchHorizontal, Frame } from 'lucide-react';
import { useStore, type CardStyle } from '../../store';
import { useTranslation } from '../../i18n';
import { SidebarSection } from './SidebarSection';
import { DraggableNumberInput, ParameterIcon, MarginIcon } from './SidebarControls';

const RatioIcon = ({ ratio, orientation }: { ratio: string, orientation: 'portrait' | 'landscape' }) => {
  if (ratio === 'custom') return <Layout size={14} className="opacity-70" />;
  let [w, h] = ratio.split(':').map(Number);
  
  // Swap if portrait to match visual expectation
  if (orientation === 'portrait') {
    [w, h] = [h, w];
  }

  // Fit within 14x14 box
  const maxDim = 14;
  let width, height;
  
  if (w >= h) {
      width = maxDim;
      height = width * (h / w);
  } else {
      height = maxDim;
      width = height * (w / h);
  }

  return (
    <div 
      className="border border-current opacity-70 mb-1"
      style={{ width: `${width}px`, height: `${height}px` }}
    />
  );
};

export const LayoutSection = () => {
  const { cardStyle, updateCardStyle } = useStore();
  const t = useTranslation();

  const ASPECT_RATIOS = [
    { label: '1:1', value: '1:1' },
    { label: '4:3', value: '4:3' },
    { label: '3:2', value: '3:2' },
    { label: '16:9', value: '16:9' },
    { label: 'Custom', value: 'custom' },
  ] as const;

  return (
    <SidebarSection title={t.layout} icon={<Layout size={16} />} defaultOpen={true}>
      {/* Orientation & Layout Mode */}
      <div className="flex p-1 bg-black/5 dark:bg-white/5 rounded-lg border border-black/10 dark:border-white/10">
        {['portrait', 'landscape', 'long', 'flexible'].map((m) => (
          <button
            key={m}
            onClick={() => {
              const mode = m as 'portrait' | 'landscape' | 'long' | 'flexible';
              const updates: Partial<CardStyle> = { layoutMode: mode };
              
              if (mode === 'portrait') {
                updates.orientation = 'portrait';
                updates.autoHeight = false;
              } else if (mode === 'landscape') {
                updates.orientation = 'landscape';
                updates.autoHeight = false;
              } else if (mode === 'long') {
                updates.autoHeight = true;
              } else if (mode === 'flexible') {
                // updates.fullWidth = true; // Removed as it's not in CardStyle
              }
              
              updateCardStyle(updates);
            }}
            className={`flex-1 flex flex-col items-center gap-1.5 py-3.5 rounded-md transition-all ${
              cardStyle.layoutMode === m 
                ? 'bg-white dark:bg-[#3a3a3a] shadow-xl text-blue-600 dark:text-blue-400 scale-[1.02] z-10' 
                : 'text-black/40 dark:text-white/40 hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            {m === 'portrait' && <Smartphone size={18} />}
            {m === 'landscape' && <MonitorIcon size={18} />}
            {m === 'long' && <StretchHorizontal size={18} className="rotate-90" />}
            {m === 'flexible' && <Frame size={18} />}
            <span className="text-[10px] font-bold uppercase tracking-tighter">{t[m as keyof typeof t] || m}</span>
          </button>
        ))}
      </div>

      {cardStyle.layoutMode !== 'long' && cardStyle.layoutMode !== 'flexible' && (
        <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => updateCardStyle({ orientation: 'portrait' })}
              className={`flex-1 py-2 px-3 rounded-lg border flex items-center justify-center gap-2 transition-all ${
                cardStyle.orientation === 'portrait'
                  ? 'bg-black text-white dark:bg-white dark:text-black border-transparent shadow-lg'
                  : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-black/60 dark:text-white/60 hover:bg-black/10'
              }`}
            >
              <Smartphone size={14} />
              <span className="text-xs font-medium">{t.portrait}</span>
            </button>
            <button 
              onClick={() => updateCardStyle({ orientation: 'landscape' })}
              className={`flex-1 py-2 px-3 rounded-lg border flex items-center justify-center gap-2 transition-all ${
                cardStyle.orientation === 'landscape'
                  ? 'bg-black text-white dark:bg-white dark:text-black border-transparent shadow-lg'
                  : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-black/60 dark:text-white/60 hover:bg-black/10'
              }`}
            >
              <Monitor size={14} />
              <span className="text-xs font-medium">{t.landscape}</span>
            </button>
          </div>

          <div>
             <label className="text-xs font-medium mb-3 block opacity-70">{t.aspectRatio}</label>
             <div className="grid grid-cols-5 gap-2">
               {ASPECT_RATIOS.map((r) => (
                 <button
                   key={r.value}
                   onClick={() => updateCardStyle({ aspectRatio: r.value })}
                   className={`flex flex-col items-center justify-center py-2.5 rounded-lg border transition-all ${
                     cardStyle.aspectRatio === r.value 
                       ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-500 text-blue-600 dark:text-blue-400 font-bold' 
                       : 'bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/5 text-black/40 dark:text-white/40 hover:bg-black/10'
                   }`}
                 >
                   <RatioIcon ratio={r.value} orientation={cardStyle.orientation} />
                   <span className="text-[10px]">{r.label}</span>
                 </button>
               ))}
             </div>
          </div>
          
          {cardStyle.aspectRatio === 'custom' && (
            <div className="grid grid-cols-2 gap-3 animate-in zoom-in-95 duration-200">
               <div>
                  <label className="text-[10px] uppercase tracking-wider opacity-60 mb-1 block">{t.width}</label>
                  <DraggableNumberInput value={cardStyle.width} min={400} max={2500} onChange={(val) => updateCardStyle({ width: val })} icon={<ParameterIcon type="width" />} />
               </div>
               <div>
                  <label className="text-[10px] uppercase tracking-wider opacity-60 mb-1 block">{t.height}</label>
                  <DraggableNumberInput value={cardStyle.height} min={400} max={5000} onChange={(val) => updateCardStyle({ height: val })} icon={<ParameterIcon type="width" />} />
               </div>
            </div>
          )}
        </div>
      )}

      {/* Margins & Spacing */}
      <div className="mt-4 pt-4 border-t border-black/5 dark:border-white/5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] uppercase tracking-wider opacity-60 mb-1 block">{t.cardWidth}</label>
            <DraggableNumberInput value={cardStyle.width} min={300} max={2000} onChange={(val) => updateCardStyle({ width: val })} icon={<ParameterIcon type="width" />} />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider opacity-60 mb-1 block">{t.cornerRadius}</label>
            <DraggableNumberInput value={cardStyle.borderRadius} min={0} max={100} onChange={(val) => updateCardStyle({ borderRadius: val })} icon={<ParameterIcon type="radius" />} />
          </div>
        </div>

        <div>
           <label className="text-xs font-medium mb-2 block opacity-70">{t.margins}</label>
           <div className="grid grid-cols-2 gap-3">
             <DraggableNumberInput value={cardStyle.padding} label={t.all} min={0} max={200} onChange={(val) => updateCardStyle({ padding: val })} icon={<MarginIcon side="all" />} />
             <DraggableNumberInput value={cardStyle.cardPadding.top} label={t.vertical} min={0} max={200} onChange={(val) => updateCardStyle({ cardPadding: { ...cardStyle.cardPadding, top: val, bottom: val } })} icon={<MarginIcon side="top" />} />
           </div>
        </div>
      </div>
    </SidebarSection>
  );
};
