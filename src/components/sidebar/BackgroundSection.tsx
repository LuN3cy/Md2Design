import { Image as ImageIcon, Upload, Palette } from 'lucide-react';
import { useStore } from '../../store';
import { useTranslation } from '../../i18n';
import { SidebarSection, AdvancedToggle } from './SidebarSection';
import { DraggableNumberInput, ColorPicker, ParameterIcon, GradientPresets, MarginIcon } from './SidebarControls';

export const BackgroundSection = () => {
  const { cardStyle, updateCardStyle } = useStore();
  const t = useTranslation();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'background' | 'cardBackground') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const url = event.target.result as string;
          if (target === 'background') {
            updateCardStyle({ backgroundImage: url });
          } else {
            updateCardStyle({ cardBackgroundImage: url });
          }
        }
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  return (
    <>
      {/* Background Fill */}
      <SidebarSection 
        title={t.backgroundFill} 
        icon={<ImageIcon size={16} />}
        rightElement={
          <button 
            onClick={() => updateCardStyle({ enableBackground: !cardStyle.enableBackground })}
            className={`w-10 h-5 rounded-full transition-colors relative ${cardStyle.enableBackground ? 'bg-slate-900 dark:bg-white/90' : 'bg-black/10 dark:bg-white/10'}`}
          >
            <div className={`w-3 h-3 rounded-full bg-white dark:bg-black/80 absolute top-1 transition-all ${cardStyle.enableBackground ? 'left-6' : 'left-1'}`} />
          </button>
        }
      >
        {cardStyle.enableBackground && (
          <div className="space-y-4">
            <div className="flex p-1 bg-black/5 dark:bg-white/5 rounded mb-2">
              {['solid', 'gradient', 'image'].map((type) => (
                <button 
                  key={type}
                  onClick={() => updateCardStyle({ backgroundType: type as 'solid' | 'gradient' | 'image' })}
                  className={`flex-1 py-1 text-[10px] rounded transition-all capitalize ${cardStyle.backgroundType === type ? 'bg-black/10 dark:bg-white/20 text-slate-900 dark:text-white' : 'text-black/50 dark:text-white/50'}`}
                >
                  {t[type as keyof typeof t] || type}
                </button>
              ))}
            </div>

            {cardStyle.backgroundType === 'solid' && (
              <ColorPicker 
                label={t.background}
                color={cardStyle.backgroundValue.startsWith('#') ? cardStyle.backgroundValue : '#ffffff'}
                onChange={(val) => updateCardStyle({ backgroundValue: val })}
              />
            )}

            {cardStyle.backgroundType === 'gradient' && (
              <div className="space-y-3">
                <GradientPresets 
                  onSelect={(start, end) => {
                    const angle = cardStyle.gradientAngle || 135;
                    updateCardStyle({ 
                      gradientStart: start,
                      gradientEnd: end,
                      backgroundValue: `linear-gradient(${angle}deg, ${start} 0%, ${end} 100%)` 
                    });
                  }}
                />
                <AdvancedToggle label={t.gradientSettings}>
                  <ColorPicker 
                    label={t.startColor}
                    color={cardStyle.gradientStart || '#667eea'}
                    onChange={(val) => {
                      const start = val;
                      const end = cardStyle.gradientEnd || '#764ba2';
                      const angle = cardStyle.gradientAngle || 135;
                      updateCardStyle({ 
                        gradientStart: start,
                        backgroundValue: `linear-gradient(${angle}deg, ${start} 0%, ${end} 100%)` 
                      });
                    }}
                  />

                  <ColorPicker 
                    label={t.endColor}
                    color={cardStyle.gradientEnd || '#764ba2'}
                    onChange={(val) => {
                      const start = cardStyle.gradientStart || '#667eea';
                      const end = val;
                      const angle = cardStyle.gradientAngle || 135;
                      updateCardStyle({ 
                        gradientEnd: end,
                        backgroundValue: `linear-gradient(${angle}deg, ${start} 0%, ${end} 100%)` 
                      });
                    }}
                  />

                  <div>
                    <label className="text-[10px] uppercase tracking-wider opacity-60 mb-1 block">{t.angle} (°)</label>
                    <DraggableNumberInput value={cardStyle.gradientAngle || 135} min={0} max={360} onChange={(val) => {
                      const angle = val;
                      const start = cardStyle.gradientStart || '#667eea';
                      const end = cardStyle.gradientEnd || '#764ba2';
                      updateCardStyle({ 
                        gradientAngle: angle,
                        backgroundValue: `linear-gradient(${angle}deg, ${start} 0%, ${end} 100%)` 
                      });
                    }} icon={<ParameterIcon type="angle" />} />
                  </div>
                </AdvancedToggle>
              </div>
            )}

            {cardStyle.backgroundType === 'image' && (
               <div className="space-y-3">
                 <div className="relative">
                   <input 
                     type="file" 
                     accept="image/*"
                     onChange={(e) => handleImageUpload(e, 'background')}
                     className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                   />
                   <button className="w-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-xs py-2 rounded transition-colors flex items-center justify-center gap-2">
                     <Upload size={14} /> {t.uploadImage}
                   </button>
                 </div>
                 
                 {cardStyle.backgroundImage && (
                   <AdvancedToggle label={t.imageSettings}>
                     <div className="aspect-video w-full rounded-lg overflow-hidden bg-black/5 relative mb-3">
                       <img src={cardStyle.backgroundImage} className="w-full h-full object-cover" />
                     </div>
                     
                     <div className="grid grid-cols-2 gap-3">
                       <div>
                         <label className="text-[10px] uppercase tracking-wider opacity-60 mb-1 block">X Offset</label>
                         <DraggableNumberInput value={cardStyle.backgroundConfig?.x || 0} min={-100} max={100} onChange={(val) => updateCardStyle({ backgroundConfig: { ...cardStyle.backgroundConfig, x: val } })} icon={<ParameterIcon type="x" />} />
                       </div>
                       <div>
                         <label className="text-[10px] uppercase tracking-wider opacity-60 mb-1 block">Y Offset</label>
                         <DraggableNumberInput value={cardStyle.backgroundConfig?.y || 0} min={-100} max={100} onChange={(val) => updateCardStyle({ backgroundConfig: { ...cardStyle.backgroundConfig, y: val } })} icon={<ParameterIcon type="y" />} />
                       </div>
                     </div>
                     <div>
                       <label className="text-[10px] uppercase tracking-wider opacity-60 mb-1 block">{t.scale}</label>
                       <DraggableNumberInput value={cardStyle.backgroundConfig?.scale || 1} min={0.1} max={3} step={0.1} onChange={(val) => updateCardStyle({ backgroundConfig: { ...cardStyle.backgroundConfig, scale: val } })} icon={<ParameterIcon type="scale" />} />
                     </div>
                     <div>
                       <label className="text-[10px] uppercase tracking-wider opacity-60 mb-1 block">{t.blur}</label>
                       <DraggableNumberInput value={cardStyle.backgroundConfig?.blur || 0} min={0} max={20} onChange={(val) => updateCardStyle({ backgroundConfig: { ...cardStyle.backgroundConfig, blur: val } })} icon={<ParameterIcon type="blur" />} />
                     </div>
                   </AdvancedToggle>
                 )}
               </div>
            )}

            <div className="pt-2">
              <label className="text-[10px] uppercase tracking-wider opacity-60 mb-1 block">{t.padding}</label>
              <DraggableNumberInput value={cardStyle.padding} min={0} max={100} onChange={(val) => updateCardStyle({ padding: val })} icon={<MarginIcon side="all" />} />
            </div>
          </div>
        )}
      </SidebarSection>

      {/* Card Background */}
      <SidebarSection title={t.cardBackground} icon={<Palette size={16} />}>
        <div className="flex p-1 bg-black/5 dark:bg-white/5 rounded mb-2">
          {['solid', 'gradient', 'image'].map((type) => (
            <button 
              key={type}
              onClick={() => updateCardStyle({ cardBackgroundType: type as 'solid' | 'gradient' | 'image' })}
              className={`flex-1 py-1 text-[10px] rounded transition-all capitalize ${cardStyle.cardBackgroundType === type ? 'bg-black/10 dark:bg-white/20 text-slate-900 dark:text-white' : 'text-black/50 dark:text-white/50'}`}
            >
              {t[type as keyof typeof t] || type}
            </button>
          ))}
        </div>

        {cardStyle.cardBackgroundType === 'solid' && (
            <ColorPicker 
              label={t.solid}
              color={cardStyle.backgroundColor}
              onChange={(val) => updateCardStyle({ backgroundColor: val })}
            />
        )}

        {cardStyle.cardBackgroundType === 'gradient' && (
          <div className="space-y-3">
            <GradientPresets 
              onSelect={(start, end) => {
                const angle = cardStyle.cardGradientAngle || 135;
                updateCardStyle({ 
                  cardGradientStart: start,
                  cardGradientEnd: end,
                  cardGradientValue: `linear-gradient(${angle}deg, ${start} 0%, ${end} 100%)` 
                });
              }}
            />
            <AdvancedToggle label={t.gradientSettings}>
              <ColorPicker 
                label={t.startColor}
                color={cardStyle.cardGradientStart || '#ffffff'}
                onChange={(val) => {
                  const start = val;
                  const end = cardStyle.cardGradientEnd || '#f8f9fa';
                  const angle = cardStyle.cardGradientAngle || 135;
                  updateCardStyle({ 
                    cardGradientStart: start,
                    cardGradientValue: `linear-gradient(${angle}deg, ${start} 0%, ${end} 100%)` 
                  });
                }}
              />

              <ColorPicker 
                label={t.endColor}
                color={cardStyle.cardGradientEnd || '#f8f9fa'}
                onChange={(val) => {
                  const start = cardStyle.cardGradientStart || '#ffffff';
                  const end = val;
                  const angle = cardStyle.cardGradientAngle || 135;
                  updateCardStyle({ 
                    cardGradientEnd: end,
                    cardGradientValue: `linear-gradient(${angle}deg, ${start} 0%, ${end} 100%)` 
                  });
                }}
              />

              <div>
                <label className="text-[10px] uppercase tracking-wider opacity-60 mb-1 block">{t.angle} (°)</label>
                <DraggableNumberInput value={cardStyle.cardGradientAngle || 135} min={0} max={360} onChange={(val) => {
                  const angle = val;
                  const start = cardStyle.cardGradientStart || '#ffffff';
                  const end = cardStyle.cardGradientEnd || '#f8f9fa';
                  updateCardStyle({ 
                    cardGradientAngle: angle,
                    cardGradientValue: `linear-gradient(${angle}deg, ${start} 0%, ${end} 100%)` 
                  });
                }} icon={<ParameterIcon type="angle" />} />
              </div>
            </AdvancedToggle>
          </div>
        )}

        {cardStyle.cardBackgroundType === 'image' && (
           <div className="space-y-3">
             <div className="relative">
               <input 
                 type="file" 
                 accept="image/*"
                 onChange={(e) => handleImageUpload(e, 'cardBackground')}
                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
               />
               <button className="w-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-xs py-2 rounded transition-colors flex items-center justify-center gap-2">
                 <Upload size={14} /> {t.uploadImage}
               </button>
             </div>
             
             {cardStyle.cardBackgroundImage && (
               <AdvancedToggle label={t.imageSettings}>
                 <div className="aspect-video w-full rounded-lg overflow-hidden bg-black/5 relative mb-3">
                   <img src={cardStyle.cardBackgroundImage} className="w-full h-full object-cover" />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-3">
                   <div>
                     <label className="text-[10px] uppercase tracking-wider opacity-60 mb-1 block">X Offset</label>
                     <DraggableNumberInput value={cardStyle.cardBackgroundConfig?.x || 0} min={-100} max={100} step={0.1} onChange={(val) => updateCardStyle({ cardBackgroundConfig: { ...cardStyle.cardBackgroundConfig, x: val } })} icon={<ParameterIcon type="x" />} />
                   </div>
                   <div>
                     <label className="text-[10px] uppercase tracking-wider opacity-60 mb-1 block">Y Offset</label>
                     <DraggableNumberInput value={cardStyle.cardBackgroundConfig?.y || 0} min={-100} max={100} step={0.1} onChange={(val) => updateCardStyle({ cardBackgroundConfig: { ...cardStyle.cardBackgroundConfig, y: val } })} icon={<ParameterIcon type="y" />} />
                   </div>
                 </div>
                 <div>
                   <label className="text-[10px] uppercase tracking-wider opacity-60 mb-1 block">{t.scale}</label>
                   <DraggableNumberInput value={cardStyle.cardBackgroundConfig?.scale || 1} min={0.1} max={3} step={0.01} onChange={(val) => updateCardStyle({ cardBackgroundConfig: { ...cardStyle.cardBackgroundConfig, scale: val } })} icon={<ParameterIcon type="scale" />} />
                 </div>
                 <div>
                   <label className="text-[10px] uppercase tracking-wider opacity-60 mb-1 block">{t.blur}</label>
                   <DraggableNumberInput value={cardStyle.cardBackgroundConfig?.blur || 0} min={0} max={20} step={0.1} onChange={(val) => updateCardStyle({ cardBackgroundConfig: { ...cardStyle.cardBackgroundConfig, blur: val } })} icon={<ParameterIcon type="blur" />} />
                 </div>
               </AdvancedToggle>
             )}
           </div>
        )}
      </SidebarSection>
    </>
  );
};
