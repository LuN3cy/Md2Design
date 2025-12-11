import { useState } from 'react';
import { useStore } from '../store';
import { useTranslation } from '../i18n';
import type { CardStyle } from '../store';
import { Palette, Type, Layout, Monitor, ChevronRight, ChevronLeft, Smartphone, Monitor as MonitorIcon, Plus, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Sidebar = () => {
  const { cardStyle, updateCardStyle, addCustomFont } = useStore();
  const t = useTranslation();
  const [isOpen, setIsOpen] = useState(true);

  const handleColorChange = (key: keyof CardStyle, value: string) => {
    updateCardStyle({ [key]: value });
  };

  

  const ASPECT_RATIOS = [
    { label: '1:1', value: '1:1' },
    { label: '4:3', value: '4:3' },
    { label: '3:2', value: '3:2' },
    { label: '16:9', value: '16:9' },
    { label: 'Custom', value: 'custom' },
  ] as const;

  const RatioIcon = ({ ratio }: { ratio: string }) => {
    if (ratio === 'custom') return <Layout size={14} className="opacity-70" />;
    const [w, h] = ratio.split(':').map(Number);
    // Base width 14px
    const width = 14;
    const height = width * (h / w);
    return (
      <div 
        className="border border-current opacity-70 mb-1"
        style={{ width: `${width}px`, height: `${height}px` }}
      />
    );
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            initial={{ x: 350, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 350, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute right-6 top-20 bottom-6 w-[350px] glass-panel rounded-2xl flex flex-col z-40 overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-black/10 dark:border-white/10">
               <div className="flex items-center gap-2 text-sm font-semibold opacity-80">
                <Palette size={16} />
                <span>{t.styleSettings}</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {/* Layout */}
              <div className="mb-8 space-y-4">
                <h2 className="text-sm font-semibold mb-4 opacity-80 flex items-center gap-2">
                   <Layout size={16} /> {t.layout}
                </h2>
                
                {/* Orientation */}
                <div className="flex p-1 bg-black/5 dark:bg-white/5 rounded-lg border border-black/10 dark:border-white/10 mb-4">
                  {(['portrait', 'landscape'] as const).map((o) => (
                    <button
                      key={o}
                      onClick={() => updateCardStyle({ orientation: o })}
                      className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-medium rounded-md transition-all ${
                        cardStyle.orientation === o
                          ? 'bg-white text-black shadow-sm'
                          : 'text-inherit hover:bg-black/5 dark:hover:bg-white/5 opacity-60 hover:opacity-100'
                      }`}
                    >
                      {o === 'portrait' ? <Smartphone size={14} /> : <MonitorIcon size={14} />}
                      <span className="capitalize">{t[o]}</span>
                    </button>
                  ))}
                </div>

                {/* Aspect Ratio */}
                <div className="grid grid-cols-5 gap-2 mb-4">
                  {ASPECT_RATIOS.map((ratio) => (
                     <button
                       key={ratio.value}
                       onClick={() => updateCardStyle({ aspectRatio: ratio.value })}
                       className={`p-2 rounded-lg border text-xs flex flex-col items-center justify-center gap-1 transition-all h-14 ${
                         cardStyle.aspectRatio === ratio.value
                           ? 'bg-black/10 dark:bg-white/20 border-black/20 dark:border-white/40 shadow-sm text-slate-900 dark:text-white' 
                           : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 text-slate-600 dark:text-white/60'
                       }`}
                     >
                       <RatioIcon ratio={ratio.value} />
                       {ratio.label}
                     </button>
                  ))}
                </div>

                {/* Custom Dimensions */}
                {cardStyle.aspectRatio === 'custom' && (
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <label className="text-[10px] uppercase tracking-wider opacity-60 mb-1 block">{t.width}</label>
                      <input 
                        type="number" 
                        value={cardStyle.width}
                        onChange={(e) => updateCardStyle({ width: parseInt(e.target.value) || 0 })}
                        className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded p-2 text-xs focus:border-black/30 dark:focus:border-white/30 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-wider opacity-60 mb-1 block">{t.height}</label>
                      <input 
                        type="number" 
                        value={cardStyle.height}
                        onChange={(e) => updateCardStyle({ height: parseInt(e.target.value) || 0 })}
                        className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded p-2 text-xs focus:border-black/30 dark:focus:border-white/30 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Border Radius */}
                 <div>
                  <label className="text-xs font-medium mb-2 block opacity-70">{t.cornerRadius} ({cardStyle.borderRadius}px)</label>
                  <input 
                    type="range" 
                    min="0" 
                    max="48" 
                    value={cardStyle.borderRadius}
                    onChange={(e) => updateCardStyle({ borderRadius: parseInt(e.target.value) })}
                    className="w-full accent-black/80 dark:accent-white/80"
                  />
                </div>
                
                {/* Border */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium opacity-70">{t.border} ({cardStyle.borderWidth}px)</label>
                    <div className="relative overflow-hidden w-5 h-5 rounded-full border border-black/20 dark:border-white/20 shadow-sm">
                      <input 
                        type="color" 
                        value={cardStyle.borderColor}
                        onChange={(e) => updateCardStyle({ borderColor: e.target.value })}
                        className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] cursor-pointer p-0 m-0 opacity-0"
                      />
                      <div className="w-full h-full" style={{ backgroundColor: cardStyle.borderColor }} />
                    </div>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="20" 
                    value={cardStyle.borderWidth}
                    onChange={(e) => updateCardStyle({ borderWidth: parseInt(e.target.value) })}
                    className="w-full accent-black/80 dark:accent-white/80"
                  />
                </div>
                {/* Shadow */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium opacity-70">{t.shadow}</label>
                    <button 
                      onClick={() => updateCardStyle({ shadowEnabled: !cardStyle.shadowEnabled })}
                      className={`w-10 h-5 rounded-full transition-colors relative ${cardStyle.shadowEnabled ? 'bg-slate-900 dark:bg-white/90' : 'bg-black/10 dark:bg-white/10'}`}
                    >
                      <div className={`w-3 h-3 rounded-full bg-white dark:bg-black/80 absolute top-1 transition-all ${cardStyle.shadowEnabled ? 'left-6' : 'left-1'}`} />
                    </button>
                  </div>
                  
                  {cardStyle.shadowEnabled && (
                    <div className="space-y-3 p-3 bg-black/5 dark:bg-white/5 rounded-lg border border-black/5 dark:border-white/5">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] uppercase tracking-wider opacity-60 mb-1 block">{t.xOffset} ({cardStyle.shadowConfig?.x ?? 0})</label>
                          <input 
                            type="range" 
                            min="-50"
                            max="50"
                            value={cardStyle.shadowConfig?.x ?? 0}
                            onChange={(e) => updateCardStyle({ shadowConfig: { ...cardStyle.shadowConfig, x: parseInt(e.target.value) || 0 } })}
                            className="w-full accent-black/80 dark:accent-white/80"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-wider opacity-60 mb-1 block">{t.yOffset} ({cardStyle.shadowConfig?.y ?? 0})</label>
                          <input 
                            type="range" 
                            min="-50"
                            max="50"
                            value={cardStyle.shadowConfig?.y ?? 0}
                            onChange={(e) => updateCardStyle({ shadowConfig: { ...cardStyle.shadowConfig, y: parseInt(e.target.value) || 0 } })}
                            className="w-full accent-black/80 dark:accent-white/80"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] uppercase tracking-wider opacity-60 mb-1 block">{t.blur} ({cardStyle.shadowConfig?.blur ?? 0})</label>
                          <input 
                            type="range" 
                            min="0"
                            max="100"
                            value={cardStyle.shadowConfig?.blur ?? 0}
                            onChange={(e) => updateCardStyle({ shadowConfig: { ...cardStyle.shadowConfig, blur: parseInt(e.target.value) || 0 } })}
                            className="w-full accent-black/80 dark:accent-white/80"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-wider opacity-60 mb-1 block">{t.spread} ({cardStyle.shadowConfig?.spread ?? 0})</label>
                          <input 
                            type="range" 
                            min="-50"
                            max="50"
                            value={cardStyle.shadowConfig?.spread ?? 0}
                            onChange={(e) => updateCardStyle({ shadowConfig: { ...cardStyle.shadowConfig, spread: parseInt(e.target.value) || 0 } })}
                            className="w-full accent-black/80 dark:accent-white/80"
                          />
                        </div>
                      </div>

                      <div>
                         <div className="flex items-center justify-between mb-2">
                           <span className="text-xs opacity-70">{t.colors}</span>
                           <div className="flex items-center gap-2">
                             <div className="relative overflow-hidden w-6 h-6 rounded-full border border-black/20 dark:border-white/20 shadow-sm">
                               <input 
                                 type="color" 
                                 value={cardStyle.shadowConfig?.color || '#000000'}
                                 onChange={(e) => updateCardStyle({ shadowConfig: { ...cardStyle.shadowConfig, color: e.target.value } })}
                                 className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] cursor-pointer p-0 m-0 opacity-0"
                               />
                               <div className="w-full h-full" style={{ backgroundColor: cardStyle.shadowConfig?.color || '#000000' }} />
                             </div>
                           </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-xs opacity-70 mb-2 block">{t.opacity} ({cardStyle.shadowConfig?.opacity ?? 0})</label>
                        <input 
                          type="range" 
                          min="0" 
                          max="1" 
                          step="0.01"
                          value={cardStyle.shadowConfig?.opacity ?? 0}
                          onChange={(e) => updateCardStyle({ shadowConfig: { ...cardStyle.shadowConfig, opacity: parseFloat(e.target.value) } })}
                          className="w-full accent-black/80 dark:accent-white/80"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Background Fill */}
              <div className="mb-8 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold opacity-80 flex items-center gap-2">
                     <ImageIcon size={16} /> {t.backgroundFill}
                  </h2>
                  <button 
                    onClick={() => updateCardStyle({ enableBackground: !cardStyle.enableBackground })}
                    className={`w-10 h-5 rounded-full transition-colors relative ${cardStyle.enableBackground ? 'bg-slate-900 dark:bg-white/90' : 'bg-black/10 dark:bg-white/10'}`}
                  >
                    <div className={`w-3 h-3 rounded-full bg-white dark:bg-black/80 absolute top-1 transition-all ${cardStyle.enableBackground ? 'left-6' : 'left-1'}`} />
                  </button>
                </div>

                {cardStyle.enableBackground && (
                  <div className="space-y-4 p-3 bg-black/5 dark:bg-white/5 rounded-lg border border-black/5 dark:border-white/5">
                    <div className="flex p-1 bg-black/5 dark:bg-white/5 rounded mb-2">
                      <button 
                         onClick={() => updateCardStyle({ backgroundType: 'solid' })}
                         className={`flex-1 py-1 text-[10px] rounded transition-all ${cardStyle.backgroundType === 'solid' ? 'bg-black/10 dark:bg-white/20 text-slate-900 dark:text-white' : 'text-black/50 dark:text-white/50'}`}
                      >
                        {t.solid}
                      </button>
                      <button 
                         onClick={() => updateCardStyle({ backgroundType: 'gradient' })}
                         className={`flex-1 py-1 text-[10px] rounded transition-all ${cardStyle.backgroundType === 'gradient' ? 'bg-black/10 dark:bg-white/20 text-slate-900 dark:text-white' : 'text-black/50 dark:text-white/50'}`}
                      >
                        {t.gradient}
                      </button>
                    </div>

                    {cardStyle.backgroundType === 'solid' ? (
                      <div className="flex items-center justify-between">
                         <span className="text-xs opacity-70">{t.background}</span>
                         <div className="flex items-center gap-2">
                           <div className="relative overflow-hidden w-6 h-6 rounded-full border border-black/20 dark:border-white/20 shadow-sm">
                             <input 
                               type="color" 
                               value={cardStyle.backgroundValue.startsWith('#') ? cardStyle.backgroundValue : '#ffffff'}
                               onChange={(e) => updateCardStyle({ backgroundValue: e.target.value })}
                               className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] cursor-pointer p-0 m-0 opacity-0"
                             />
                             <div className="w-full h-full" style={{ backgroundColor: cardStyle.backgroundValue }} />
                           </div>
                         </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {/* Presets */}
                        <div className="grid grid-cols-4 gap-2 mb-3">
                           {[
                              { start: '#f5f7fa', end: '#c3cfe2', angle: 135 },
                              { start: '#a1c4fd', end: '#c2e9fb', angle: 120 },
                              { start: '#84fab0', end: '#8fd3f4', angle: 120 },
                              { start: '#e0c3fc', end: '#8ec5fc', angle: 120 },
                              { start: '#fbc2eb', end: '#a6c1ee', angle: 0 }, 
                              { start: '#f6d365', end: '#fda085', angle: 120 },
                              { start: '#accbee', end: '#e7f0fd', angle: 0 },
                              { start: '#e9defa', end: '#fbfcdb', angle: 340 }
                           ].map((preset, idx) => (
                              <button
                                key={idx}
                                onClick={() => {
                                    updateCardStyle({
                                        gradientStart: preset.start,
                                        gradientEnd: preset.end,
                                        gradientAngle: preset.angle,
                                        backgroundValue: `linear-gradient(${preset.angle}deg, ${preset.start} 0%, ${preset.end} 100%)`
                                    });
                                }}
                                className="w-full h-8 rounded-md border border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/50 transition-all shadow-sm"
                                style={{ background: `linear-gradient(${preset.angle}deg, ${preset.start} 0%, ${preset.end} 100%)` }}
                              />
                           ))}
                        </div>

                        <div className="flex items-center justify-between">
                           <span className="text-xs opacity-70">{t.startColor}</span>
                           <div className="flex items-center gap-2">
                             <span className="text-xs font-mono opacity-50">{cardStyle.gradientStart || '#667eea'}</span>
                             <div className="relative overflow-hidden w-6 h-6 rounded-full border border-black/20 dark:border-white/20 shadow-sm">
                               <input 
                                 type="color" 
                                 value={cardStyle.gradientStart || '#667eea'}
                                 onChange={(e) => {
                                   const start = e.target.value;
                                   const end = cardStyle.gradientEnd || '#764ba2';
                                   const angle = cardStyle.gradientAngle || 135;
                                   updateCardStyle({ 
                                     gradientStart: start,
                                     backgroundValue: `linear-gradient(${angle}deg, ${start} 0%, ${end} 100%)` 
                                   });
                                 }}
                                 className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] cursor-pointer p-0 m-0 opacity-0"
                               />
                               <div className="w-full h-full" style={{ backgroundColor: cardStyle.gradientStart || '#667eea' }} />
                             </div>
                           </div>
                        </div>

                        <div className="flex items-center justify-between">
                           <span className="text-xs opacity-70">{t.endColor}</span>
                           <div className="flex items-center gap-2">
                             <span className="text-xs font-mono opacity-50">{cardStyle.gradientEnd || '#764ba2'}</span>
                             <div className="relative overflow-hidden w-6 h-6 rounded-full border border-black/20 dark:border-white/20 shadow-sm">
                               <input 
                                 type="color" 
                                 value={cardStyle.gradientEnd || '#764ba2'}
                                 onChange={(e) => {
                                   const start = cardStyle.gradientStart || '#667eea';
                                   const end = e.target.value;
                                   const angle = cardStyle.gradientAngle || 135;
                                   updateCardStyle({ 
                                     gradientEnd: end,
                                     backgroundValue: `linear-gradient(${angle}deg, ${start} 0%, ${end} 100%)` 
                                   });
                                 }}
                                 className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] cursor-pointer p-0 m-0 opacity-0"
                               />
                               <div className="w-full h-full" style={{ backgroundColor: cardStyle.gradientEnd || '#764ba2' }} />
                             </div>
                           </div>
                        </div>

                        <div>
                           <label className="text-xs opacity-70 mb-2 block">{t.angle} ({cardStyle.gradientAngle}°)</label>
                           <input 
                             type="range" 
                             min="0" 
                             max="360" 
                             value={cardStyle.gradientAngle || 135}
                             onChange={(e) => {
                               const angle = parseInt(e.target.value);
                               const start = cardStyle.gradientStart || '#667eea';
                               const end = cardStyle.gradientEnd || '#764ba2';
                               updateCardStyle({ 
                                 gradientAngle: angle,
                                 backgroundValue: `linear-gradient(${angle}deg, ${start} 0%, ${end} 100%)` 
                               });
                             }}
                             className="w-full accent-black/80 dark:accent-white/80"
                           />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="text-xs opacity-70 mb-2 block">{t.padding} ({cardStyle.padding}px)</label>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={cardStyle.padding}
                        onChange={(e) => updateCardStyle({ padding: parseInt(e.target.value) })}
                        className="w-full accent-black/80 dark:accent-white/80"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Colors */}
              <div className="mb-8 space-y-4">
                <h2 className="text-sm font-semibold mb-4 opacity-80 flex items-center gap-2">
                   <Palette size={16} /> {t.colors}
                </h2>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs opacity-70">{t.background}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono opacity-50">{cardStyle.backgroundColor}</span>
                    <div className="relative overflow-hidden w-6 h-6 rounded-full border border-black/20 dark:border-white/20 shadow-sm">
                      <input 
                        type="color" 
                        value={cardStyle.backgroundColor}
                        onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                        className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] cursor-pointer p-0 m-0 opacity-0"
                      />
                      <div className="w-full h-full" style={{ backgroundColor: cardStyle.backgroundColor }} />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs opacity-70">{t.text}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono opacity-50">{cardStyle.textColor}</span>
                    <div className="relative overflow-hidden w-6 h-6 rounded-full border border-black/20 dark:border-white/20 shadow-sm">
                      <input 
                        type="color" 
                        value={cardStyle.textColor}
                        onChange={(e) => handleColorChange('textColor', e.target.value)}
                        className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] cursor-pointer p-0 m-0 opacity-0"
                      />
                       <div className="w-full h-full" style={{ backgroundColor: cardStyle.textColor }} />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs opacity-70">{t.blockquoteBackground}</span>
                  <div className="flex items-center gap-2">
                    <div className="relative overflow-hidden w-6 h-6 rounded-full border border-black/20 dark:border-white/20 shadow-sm">
                      <input 
                        type="color" 
                        value={cardStyle.blockquoteBackgroundColor.substring(0, 7)}
                        onChange={(e) => handleColorChange('blockquoteBackgroundColor', e.target.value + '20')} // Add 20 (hex) alpha ~12% by default when picking new color to keep it subtle
                        className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] cursor-pointer p-0 m-0 opacity-0"
                      />
                       <div className="w-full h-full" style={{ backgroundColor: cardStyle.blockquoteBackgroundColor }} />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs opacity-70">{t.blockquoteBorder}</span>
                  <div className="flex items-center gap-2">
                    <div className="relative overflow-hidden w-6 h-6 rounded-full border border-black/20 dark:border-white/20 shadow-sm">
                      <input 
                        type="color" 
                        value={cardStyle.blockquoteBorderColor}
                        onChange={(e) => handleColorChange('blockquoteBorderColor', e.target.value)}
                        className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] cursor-pointer p-0 m-0 opacity-0"
                      />
                       <div className="w-full h-full" style={{ backgroundColor: cardStyle.blockquoteBorderColor }} />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs opacity-70">{t.codeBackground}</span>
                  <div className="flex items-center gap-2">
                    <div className="relative overflow-hidden w-6 h-6 rounded-full border border-black/20 dark:border-white/20 shadow-sm">
                      <input 
                        type="color" 
                        value={cardStyle.codeBackgroundColor.substring(0, 7)}
                        onChange={(e) => handleColorChange('codeBackgroundColor', e.target.value + '20')}
                        className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] cursor-pointer p-0 m-0 opacity-0"
                      />
                       <div className="w-full h-full" style={{ backgroundColor: cardStyle.codeBackgroundColor }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Typography */}
              <div className="mb-8 space-y-4">
                <h2 className="text-sm font-semibold mb-4 opacity-80 flex items-center gap-2">
                   <Type size={16} /> {t.typography}
                </h2>
                
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
                    {['Inter', 'serif', 'monospace', 'Arial'].map((font) => (
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
                               
                               // Check if font already exists to avoid duplicates
                               const exists = cardStyle.customFonts.some(f => f.name === name);
                               
                               // Try to detect variable font by file name (rough heuristic)
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
                               
                               // Apply the font immediately
                               // Use a small timeout to ensure the DOM has updated with the new style tag
                               setTimeout(() => {
                                 updateCardStyle({ fontFamily: name });
                               }, 100);
                             }
                           };
                           reader.readAsDataURL(file);
                         }
                         // Reset input value so same file can be selected again if needed
                         e.target.value = '';
                       }}
                       className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                     />
                     <button className="w-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-xs py-2 rounded transition-colors flex items-center justify-center gap-2">
                       <Plus size={14} /> {t.uploadFont}
                     </button>
                   </div>
                   
                   {/* Manual Variable Font Toggle for currently selected custom font */}
                   {cardStyle.customFonts.find(f => f.name === cardStyle.fontFamily) && (
                     <div className="mt-2 flex items-center justify-between px-1">
                       <label className="text-[10px] opacity-60 cursor-pointer flex items-center gap-2">
                         <input 
                           type="checkbox"
                           checked={cardStyle.customFonts.find(f => f.name === cardStyle.fontFamily)?.weight === 'variable'}
                           onChange={(e) => {
                             const font = cardStyle.customFonts.find(f => f.name === cardStyle.fontFamily);
                             if (font) {
                               // We need to update the font in the customFonts array
                               // Since we don't have a direct 'updateCustomFont' action, we can remove and add it back
                               // Or better, let's just add a small helper in store or just modify the logic here implies we might need a new action.
                               // But for now, let's assume we can't easily update without a new action.
                               // Let's implement a 'updateCustomFont' action or similar pattern if needed.
                               // Actually, let's just re-add it with new weight, filter out old one.
                               // NOTE: This changes array order, might be annoying. 
                               // Better to just add `updateCustomFont` to store.
                               
                               // Since I can't easily edit store interface in this turn without potentially breaking things or making it complex,
                               // I'll stick to: we need to update the store.
                               // Let's rely on `addCustomFont` being able to overwrite? No, it pushes.
                               // Let's manually filter and set.
                               // Wait, `updateCardStyle` takes partial CardStyle.
                               const newFonts = cardStyle.customFonts.map(f => 
                                 f.name === font.name ? { ...f, weight: e.target.checked ? 'variable' : 'normal' } : f
                               );
                               // @ts-ignore - weight type mismatch if I didn't update store type properly? 
                               // I did update store type.
                               updateCardStyle({ customFonts: newFonts as any });
                             }
                           }}
                           className="rounded border-black/20 dark:border-white/20 bg-black/10 dark:bg-white/10"
                         />
                         <span>Variable Font (Enable All Weights)</span>
                       </label>
                     </div>
                   )}
                </div>

                <div>
                  <label className="text-xs font-medium mb-2 block opacity-70">{t.fontSize} ({cardStyle.fontSize}px)</label>
                  <input 
                    type="range" 
                    min="12" 
                    max="64" 
                    value={cardStyle.fontSize}
                    onChange={(e) => updateCardStyle({ fontSize: parseInt(e.target.value) })}
                    className="w-full accent-black/80 dark:accent-white/80"
                  />
                </div>
              </div>

              {/* Watermark & Page Number */}
              <div className="mb-8 space-y-4">
                 <h2 className="text-sm font-semibold mb-4 opacity-80 flex items-center gap-2">
                   <Type size={16} /> {t.watermark} / {t.pageNumber}
                 </h2>

                 {/* Watermark */}
                 <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium opacity-70">{t.watermark}</label>
                      <button 
                        onClick={() => updateCardStyle({ watermark: { ...cardStyle.watermark, enabled: !cardStyle.watermark.enabled } })}
                        className={`w-10 h-5 rounded-full transition-colors relative ${cardStyle.watermark.enabled ? 'bg-slate-900 dark:bg-white/90' : 'bg-black/10 dark:bg-white/10'}`}
                      >
                        <div className={`w-3 h-3 rounded-full bg-white dark:bg-black/80 absolute top-1 transition-all ${cardStyle.watermark.enabled ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                    
                    {cardStyle.watermark.enabled && (
                      <div className="p-3 bg-black/5 dark:bg-white/5 rounded-lg border border-black/5 dark:border-white/5 space-y-3">
                        <div>
                          <label className="text-[10px] uppercase tracking-wider opacity-60 mb-1 block">{t.content}</label>
                          <input 
                            type="text" 
                            value={cardStyle.watermark.content}
                            onChange={(e) => updateCardStyle({ watermark: { ...cardStyle.watermark, content: e.target.value } })}
                            className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded p-2 text-xs focus:border-black/30 dark:focus:border-white/30 focus:outline-none text-slate-900 dark:text-white"
                          />
                        </div>
                        
                        <div>
                           <label className="text-[10px] uppercase tracking-wider opacity-60 mb-1 block">{t.position}</label>
                           <div className="flex bg-black/5 dark:bg-white/5 rounded p-1">
                             {['left', 'center', 'right'].map((pos) => (
                               <button
                                 key={pos}
                                 onClick={() => updateCardStyle({ watermark: { ...cardStyle.watermark, position: pos as any } })}
                                 className={`flex-1 py-1 text-[10px] rounded transition-all capitalize ${cardStyle.watermark.position === pos ? 'bg-black/10 dark:bg-white/20 text-slate-900 dark:text-white' : 'text-black/50 dark:text-white/50'}`}
                               >
                                 {t[pos as keyof typeof t]}
                               </button>
                             ))}
                           </div>
                        </div>

                        <div>
                          <label className="text-[10px] uppercase tracking-wider opacity-60 mb-1 block">{t.opacity} ({cardStyle.watermark.opacity})</label>
                          <input 
                            type="range" 
                            min="0" 
                            max="1" 
                            step="0.05"
                            value={cardStyle.watermark.opacity}
                            onChange={(e) => updateCardStyle({ watermark: { ...cardStyle.watermark, opacity: parseFloat(e.target.value) } })}
                            className="w-full accent-black/80 dark:accent-white/80"
                          />
                        </div>
                      </div>
                    )}
                 </div>

                 {/* Page Number */}
                 <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium opacity-70">{t.pageNumber}</label>
                      <button 
                        onClick={() => updateCardStyle({ pageNumber: { ...cardStyle.pageNumber, enabled: !cardStyle.pageNumber.enabled } })}
                        className={`w-10 h-5 rounded-full transition-colors relative ${cardStyle.pageNumber.enabled ? 'bg-slate-900 dark:bg-white/90' : 'bg-black/10 dark:bg-white/10'}`}
                      >
                        <div className={`w-3 h-3 rounded-full bg-white dark:bg-black/80 absolute top-1 transition-all ${cardStyle.pageNumber.enabled ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                    
                    {cardStyle.pageNumber.enabled && (
                      <div className="p-3 bg-black/5 dark:bg-white/5 rounded-lg border border-black/5 dark:border-white/5 space-y-3">
                        <div>
                           <label className="text-[10px] uppercase tracking-wider opacity-60 mb-1 block">{t.position}</label>
                           <div className="flex bg-black/5 dark:bg-white/5 rounded p-1">
                             {['left', 'center', 'right'].map((pos) => (
                               <button
                                 key={pos}
                                 onClick={() => updateCardStyle({ pageNumber: { ...cardStyle.pageNumber, position: pos as any } })}
                                 className={`flex-1 py-1 text-[10px] rounded transition-all capitalize ${cardStyle.pageNumber.position === pos ? 'bg-black/10 dark:bg-white/20 text-slate-900 dark:text-white' : 'text-black/50 dark:text-white/50'}`}
                               >
                                 {t[pos as keyof typeof t]}
                               </button>
                             ))}
                           </div>
                        </div>
                      </div>
                    )}
                 </div>
              </div>

               {/* Custom CSS */}
               <div className="mb-8">
                <h2 className="text-sm font-semibold mb-4 opacity-80 flex items-center gap-2">
                   <Monitor size={16} /> {t.customCSS}
                </h2>
                <textarea
                  value={cardStyle.customCSS}
                  onChange={(e) => updateCardStyle({ customCSS: e.target.value })}
                  placeholder=".card { ... }"
                  className="w-full h-32 bg-black/5 dark:bg-white/5 p-3 rounded text-xs font-mono resize-none focus:outline-none focus:ring-1 ring-black/20 dark:ring-white/20 border border-black/10 dark:border-white/10 placeholder-black/30 dark:placeholder-white/20"
                />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.button
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 50, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            onClick={() => setIsOpen(true)}
            className="absolute right-6 top-1/2 -translate-y-1/2 p-3 glass-panel rounded-full z-40 text-inherit shadow-xl"
          >
            <ChevronLeft size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};
