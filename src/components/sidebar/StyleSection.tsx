import { Monitor } from 'lucide-react';
import { useStore } from '../../store';
import { useTranslation } from '../../i18n';
import { SidebarSection, AdvancedToggle } from './SidebarSection';
import { DraggableNumberInput, ColorPicker, ParameterIcon } from './SidebarControls';

export const StyleSection = () => {
  const { cardStyle, updateCardStyle } = useStore();
  const t = useTranslation();

  return (
    <>
      {/* Border Style */}
      <SidebarSection title={t.border} icon={<Monitor size={16} />}>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className="text-[10px] uppercase tracking-wider opacity-60 mb-1 block">{t.width}</span>
            <DraggableNumberInput value={cardStyle.borderWidth} min={0} max={20} onChange={(val) => updateCardStyle({ borderWidth: val })} icon={<ParameterIcon type="border" />} />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider opacity-60 mb-1 block">{t.cornerRadius}</span>
            <DraggableNumberInput value={cardStyle.borderRadius} min={0} max={100} onChange={(val) => updateCardStyle({ borderRadius: val })} icon={<ParameterIcon type="radius" />} />
          </div>
        </div>
        <div className="mt-3">
          <ColorPicker 
            label={t.colors}
            color={cardStyle.borderColor}
            onChange={(val) => updateCardStyle({ borderColor: val })}
          />
        </div>
      </SidebarSection>

      {/* Shadow */}
      <SidebarSection 
        title={t.shadow} 
        icon={<Monitor size={16} />}
        rightElement={
          <button 
            onClick={() => updateCardStyle({ shadowEnabled: !cardStyle.shadowEnabled })}
            className={`w-10 h-5 rounded-full transition-colors relative ${cardStyle.shadowEnabled ? 'bg-slate-900 dark:bg-white/90' : 'bg-black/10 dark:bg-white/10'}`}
          >
            <div className={`w-3 h-3 rounded-full bg-white dark:bg-black/80 absolute top-1 transition-all ${cardStyle.shadowEnabled ? 'left-6' : 'left-1'}`} />
          </button>
        }
      >
        {cardStyle.shadowEnabled && (
          <div className="space-y-4">
             <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider opacity-60 mb-1 block">X {t.xOffset}</span>
                <DraggableNumberInput value={cardStyle.shadowConfig?.x ?? 0} min={-50} max={50} onChange={(val) => updateCardStyle({ shadowConfig: { ...cardStyle.shadowConfig, x: val } })} icon={<ParameterIcon type="x" />} />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider opacity-60 mb-1 block">Y {t.yOffset}</span>
                <DraggableNumberInput value={cardStyle.shadowConfig?.y ?? 10} min={-50} max={50} onChange={(val) => updateCardStyle({ shadowConfig: { ...cardStyle.shadowConfig, y: val } })} icon={<ParameterIcon type="y" />} />
              </div>
            </div>

            <AdvancedToggle label={t.advancedSettings}>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] uppercase tracking-wider opacity-60 mb-1 block">{t.blur}</span>
                  <DraggableNumberInput value={cardStyle.shadowConfig?.blur ?? 0} min={0} max={100} onChange={(val) => updateCardStyle({ shadowConfig: { ...cardStyle.shadowConfig, blur: val } })} icon={<ParameterIcon type="blur" />} />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider opacity-60 mb-1 block">{t.spread}</span>
                  <DraggableNumberInput value={cardStyle.shadowConfig?.spread ?? 0} min={-50} max={50} onChange={(val) => updateCardStyle({ shadowConfig: { ...cardStyle.shadowConfig, spread: val } })} icon={<ParameterIcon type="spread" />} />
                </div>
              </div>

              <ColorPicker 
                label={t.colors}
                color={cardStyle.shadowConfig?.color || '#000000'}
                onChange={(val) => updateCardStyle({ shadowConfig: { ...cardStyle.shadowConfig, color: val } })}
              />
              
              <div>
                <span className="text-[10px] uppercase tracking-wider opacity-60 mb-1 block">{t.opacity}</span>
                <DraggableNumberInput value={cardStyle.shadowConfig?.opacity ?? 0} min={0} max={1} step={0.01} onChange={(val) => updateCardStyle({ shadowConfig: { ...cardStyle.shadowConfig, opacity: val } })} icon={<ParameterIcon type="opacity" />} />
              </div>
            </AdvancedToggle>
          </div>
        )}
      </SidebarSection>
    </>
  );
};
