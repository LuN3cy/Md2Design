import { Stamp } from 'lucide-react';
import { useStore, type CardStyle } from '../../store';
import { useTranslation } from '../../i18n';
import { SidebarSection, AdvancedToggle } from './SidebarSection';
import { DraggableNumberInput, ColorPicker, ParameterIcon } from './SidebarControls';

export const ContentSection = () => {
  const { cardStyle, updateCardStyle } = useStore();
  const t = useTranslation();

  return (
    <SidebarSection title={`${t.watermark} / ${t.pageNumber}`} icon={<Stamp size={16} />}>
        {/* Watermark */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium opacity-70">{t.watermark}</span>
            <button 
              onClick={() => updateCardStyle({ watermark: { ...(cardStyle.watermark || {}), enabled: !cardStyle.watermark?.enabled } } as Partial<CardStyle>)}
              className={`w-10 h-5 rounded-full transition-colors relative ${cardStyle.watermark?.enabled ? 'bg-slate-900 dark:bg-white/90' : 'bg-black/10 dark:bg-white/10'}`}
            >
              <div className={`w-3 h-3 rounded-full bg-white dark:bg-black/80 absolute top-1 transition-all ${cardStyle.watermark?.enabled ? 'left-6' : 'left-1'}`} />
            </button>
          </div>
          
          {cardStyle.watermark?.enabled && (
            <div className="p-3 bg-black/5 dark:bg-white/5 rounded-lg border border-black/5 dark:border-white/5 space-y-3">
              <input 
                id="watermark-content"
                name="watermark-content"
                type="text"
                value={cardStyle.watermark?.content || ''}
                onChange={(e) => updateCardStyle({ watermark: { ...(cardStyle.watermark || {}), content: e.target.value } } as Partial<CardStyle>)}
                placeholder={t.watermarkPlaceholder}
                className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded px-2 py-1.5 text-xs focus:outline-none"
              />
              <AdvancedToggle label={t.advancedSettings}>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider opacity-60 mb-1 block">{t.opacity}</span>
                    <DraggableNumberInput value={cardStyle.watermark?.opacity || 0.3} min={0} max={1} step={0.05} onChange={(val) => updateCardStyle({ watermark: { ...(cardStyle.watermark || {}), opacity: val } } as Partial<CardStyle>)} icon={<ParameterIcon type="opacity" />} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider opacity-60 mb-1 block">{t.fontSize}</span>
                    <DraggableNumberInput value={cardStyle.watermark?.fontSize || 14} min={8} max={72} step={1} onChange={(val) => updateCardStyle({ watermark: { ...(cardStyle.watermark || {}), fontSize: val } } as Partial<CardStyle>)} icon={<ParameterIcon type="fontSize" />} />
                  </div>
                </div>
                <ColorPicker 
                  label={t.text}
                  color={cardStyle.watermark?.color || cardStyle.textColor} 
                  onChange={(val) => updateCardStyle({ watermark: { ...(cardStyle.watermark || {}), color: val } } as Partial<CardStyle>)} 
                />

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-black/5 dark:border-white/5">
                  <span className="text-[10px] uppercase tracking-wider opacity-60">{t.uppercase}</span>
                  <button 
                    onClick={() => updateCardStyle({ watermark: { ...(cardStyle.watermark || {}), uppercase: !cardStyle.watermark?.uppercase } } as Partial<CardStyle>)}
                    className={`w-8 h-4 rounded-full transition-colors relative ${cardStyle.watermark?.uppercase ? 'bg-slate-900 dark:bg-white/90' : 'bg-black/10 dark:bg-white/10'}`}
                  >
                    <div className={`w-2.5 h-2.5 rounded-full bg-white dark:bg-black/80 absolute top-0.75 transition-all ${cardStyle.watermark?.uppercase ? 'left-4.5' : 'left-1'}`} />
                  </button>
                </div>
              </AdvancedToggle>
            </div>
          )}
        </div>

        {/* Page Number */}
        <div className="space-y-3 mt-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium opacity-70">{t.pageNumber}</span>
            <button 
              onClick={() => updateCardStyle({ pageNumber: { ...(cardStyle.pageNumber || {}), enabled: !cardStyle.pageNumber?.enabled } } as Partial<CardStyle>)}
              className={`w-10 h-5 rounded-full transition-colors relative ${cardStyle.pageNumber?.enabled ? 'bg-slate-900 dark:bg-white/90' : 'bg-black/10 dark:bg-white/10'}`}
            >
              <div className={`w-3 h-3 rounded-full bg-white dark:bg-black/80 absolute top-1 transition-all ${cardStyle.pageNumber?.enabled ? 'left-6' : 'left-1'}`} />
            </button>
          </div>
          
          {cardStyle.pageNumber?.enabled && (
            <div className="p-3 bg-black/5 dark:bg-white/5 rounded-lg border border-black/5 dark:border-white/5 space-y-3">
              <AdvancedToggle label={t.advancedSettings}>
                  <div>
                      <span className="text-[10px] uppercase tracking-wider opacity-60 mb-1 block">{t.position}</span>
                      <div className="flex bg-black/5 dark:bg-white/5 rounded p-1">
                        {['left', 'center', 'right'].map((pos) => (
                          <button
                            key={pos}
                            onClick={() => updateCardStyle({ pageNumber: { ...(cardStyle.pageNumber || {}), position: pos as 'left' | 'center' | 'right' } } as Partial<CardStyle>)}
                            className={`flex-1 py-1 text-[10px] rounded transition-all capitalize ${cardStyle.pageNumber?.position === pos ? 'bg-black/10 dark:bg-white/20 text-slate-900 dark:text-white' : 'text-black/50 dark:text-white/50'}`}
                          >
                            {t[pos as keyof typeof t] || pos}
                          </button>
                        ))}
                      </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider opacity-60 mb-1 block">{t.opacity}</span>
                      <DraggableNumberInput value={cardStyle.pageNumber?.opacity || 0.5} min={0} max={1} step={0.05} onChange={(val) => updateCardStyle({ pageNumber: { ...(cardStyle.pageNumber || {}), opacity: val } } as Partial<CardStyle>)} icon={<ParameterIcon type="opacity" />} />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider opacity-60 mb-1 block">{t.fontSize}</span>
                      <DraggableNumberInput value={cardStyle.pageNumber?.fontSize || 12} min={6} max={64} step={1} onChange={(val) => updateCardStyle({ pageNumber: { ...(cardStyle.pageNumber || {}), fontSize: val } } as Partial<CardStyle>)} icon={<ParameterIcon type="fontSize" />} />
                    </div>
                  </div>
                  <ColorPicker 
                    label={t.text}
                    color={cardStyle.pageNumber?.color || cardStyle.textColor} 
                    onChange={(val) => updateCardStyle({ pageNumber: { ...(cardStyle.pageNumber || {}), color: val } } as Partial<CardStyle>)} 
                  />
              </AdvancedToggle>
            </div>
          )}
        </div>
    </SidebarSection>
  );
};
