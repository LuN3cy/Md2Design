import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useStore, type StylePreset, type CardStyle } from '../../store';
import { useTranslation } from '../../i18n';
import { Plus, Trash2, LayoutPanelTop, Maximize2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PresetCard } from './PresetCard';

export const PresetsManager = () => {
  const { presets, savePreset, deletePreset, applyPreset, markdown } = useStore();
  const t = useTranslation();
  const [isSaving, setIsSaving] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [previewPreset, setPreviewPreset] = useState<StylePreset | null>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(1);

  const handleSave = () => {
    if (presetName.trim()) {
      savePreset(presetName.trim());
      setPresetName('');
      setIsSaving(false);
    }
  };

  const pageContent = markdown.split(/\n---\n/).filter(page => page.trim() !== '')[0] ?? '';

  const getPreviewDimensions = (style: CardStyle) => {
    const baseSize = 500;
    let width = style.width || 800;
    let height = style.height || 600;

    if (style.aspectRatio !== 'custom' && !style.autoHeight) {
      const [w, h] = style.aspectRatio.split(':').map(Number);

      if (style.orientation === 'portrait') {
        width = baseSize;
        height = width * (h / w);
        if (w > h) {
          height = width * (w / h);
        } else {
          height = width * (h / w);
        }
      } else {
        width = baseSize;
        if (w > h) {
          height = width * (h / w);
        } else {
          height = width * (h / w);
        }
      }

      let ratio = w / h;
      if (style.orientation === 'portrait') {
        if (ratio > 1) ratio = 1 / ratio;
      } else {
        if (ratio < 1) ratio = 1 / ratio;
      }

      width = baseSize;
      height = baseSize / ratio;
    }

    return { width, height };
  };

  useEffect(() => {
    if (!previewPreset) return;

    const el = previewContainerRef.current;
    if (!el) return;

    const { width, height } = getPreviewDimensions(previewPreset.style);

    const recompute = () => {
      const computed = window.getComputedStyle(el);
      const padX = parseFloat(computed.paddingLeft) + parseFloat(computed.paddingRight);
      const padY = parseFloat(computed.paddingTop) + parseFloat(computed.paddingBottom);
      const availableW = Math.max(0, el.clientWidth - padX);
      const availableH = Math.max(0, el.clientHeight - padY);
      if (!availableW || !availableH) return;

      const nextScale = Math.min(availableW / width, availableH / height, 1);
      setPreviewScale(nextScale);
    };

    recompute();

    const ro = new ResizeObserver(() => recompute());
    ro.observe(el);
    window.addEventListener('resize', recompute);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', recompute);
    };
  }, [previewPreset]);

  return (
    <div className="space-y-4 mb-4">
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {previewPreset && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-1000 bg-black/35"
              onClick={() => setPreviewPreset(null)}
              style={{
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)'
              }}
            >
              <motion.div
                initial={{ scale: 0.96, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.96, opacity: 0, y: 20 }}
                className="absolute inset-6 sm:inset-10 rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-white/40 dark:bg-[#0a0a0a]/35 backdrop-blur-2xl flex flex-col max-w-4xl max-h-[80vh] mx-auto my-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-4 border-b border-black/5 dark:border-white/5 flex items-center justify-between bg-white/70 dark:bg-black/40 backdrop-blur-md">
                  <div className="min-w-0">
                    <div className="text-sm font-bold truncate">{previewPreset.name}</div>
                    <div className="text-[10px] opacity-50 truncate">{t.presets}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        applyPreset(previewPreset.style);
                        setPreviewPreset(null);
                      }}
                      className="px-4 py-1.5 bg-blue-500 text-white rounded-full text-xs font-bold hover:bg-blue-600 transition-colors"
                    >
                      {t.apply}
                    </button>
                    <button
                      onClick={() => setPreviewPreset(null)}
                      className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
                      aria-label="Close"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                <div ref={previewContainerRef} className="relative flex-1 overflow-hidden flex items-center justify-center p-4 sm:p-8">
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-white/10 dark:bg-white/5 backdrop-blur-2xl" />
                    <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-cyan-400/25 blur-3xl" />
                    <div className="absolute -bottom-28 -right-28 w-96 h-96 rounded-full bg-blue-500/25 blur-3xl" />
                    <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
                      }}
                    />
                  </div>
                  <div
                    className="relative z-10"
                    style={{
                      transform: `scale(${previewScale})`,
                      transformOrigin: 'center'
                    }}
                  >
                    <PresetCard content={pageContent} index={0} style={previewPreset.style} getPreviewDimensions={getPreviewDimensions} />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      <div className="flex items-center justify-between px-4 pt-4">
        <h2 className="text-sm font-semibold opacity-80 flex items-center gap-2">
           <LayoutPanelTop size={16} /> {t.presets}
        </h2>
        <button 
          onClick={() => setIsSaving(!isSaving)}
          className="p-1.5 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors text-blue-500"
          title={t.savePreset}
        >
          <Plus size={18} />
        </button>
      </div>

      <AnimatePresence>
        {isSaving && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden px-4"
          >
            <div className="p-3 bg-black/5 dark:bg-white/5 rounded-lg border border-blue-500/30 space-y-3 mb-4">
              <input 
                autoFocus
                type="text" 
                placeholder={t.enterPresetName}
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                className="w-full bg-white dark:bg-black/20 border border-black/10 dark:border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
              />
              <div className="flex gap-2">
                <button 
                  onClick={handleSave}
                  disabled={!presetName.trim()}
                  className="flex-1 bg-blue-500 text-white py-1.5 rounded text-xs font-bold disabled:opacity-50"
                >
                  {t.add}
                </button>
                <button 
                  onClick={() => setIsSaving(false)}
                  className="px-3 py-1.5 bg-black/5 dark:bg-white/5 rounded text-xs"
                >
                  {t.undo}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-4 gap-2 justify-items-center px-4">
        {presets.map((preset) => (
          <div 
            key={preset.id}
            className="group relative bg-black/5 dark:bg-white/5 rounded-lg border border-black/5 dark:border-white/5 overflow-hidden transition-all hover:border-blue-500/50 w-full"
          >
            <div 
              className="aspect-square w-full cursor-pointer overflow-hidden relative"
              onClick={() => applyPreset(preset.style)}
            >
              <div 
                className="w-full h-full transition-transform group-hover:scale-110"
                style={{ 
                  background: preset.style.enableBackground 
                    ? (preset.style.backgroundType === 'gradient' ? preset.style.backgroundValue : (preset.style.backgroundType === 'solid' ? preset.style.backgroundValue : '#000'))
                    : (preset.style.cardBackgroundType === 'gradient' ? preset.style.cardGradientValue : preset.style.backgroundColor)
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center p-2">
                  <div 
                    className="w-full h-full rounded-[2px] shadow-sm border border-black/5"
                    style={{ 
                      background: preset.style.cardBackgroundType === 'gradient' ? preset.style.cardGradientValue : preset.style.backgroundColor,
                      borderRadius: Math.min(preset.style.borderRadius / 12, 2)
                    }}
                  />
                </div>
              </div>

              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                 <button 
                   onClick={(e) => {
                     e.stopPropagation();
                     setPreviewPreset(preset);
                   }}
                   className="p-1.5 bg-white/90 dark:bg-black/60 rounded-full hover:scale-110 transition-transform shadow-lg text-blue-500"
                   title="View Full Preview"
                 >
                    <Maximize2 size={12} />
                 </button>
                 <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePreset(preset.id);
                   }}
                   className="p-1.5 bg-white/90 dark:bg-black/60 rounded-full hover:scale-110 transition-transform shadow-lg text-red-500"
                   title={t.delete}
                  >
                    <Trash2 size={12} />
                  </button>
              </div>
            </div>

            <div className="p-1 bg-white/50 dark:bg-black/20 backdrop-blur-sm">
              <span className="text-[9px] font-medium truncate opacity-70 block text-center">{preset.name}</span>
            </div>
          </div>
        ))}

        {presets.length === 0 && !isSaving && (
          <div className="col-span-4 py-4 text-center opacity-30 text-[10px] italic border border-dashed border-black/10 dark:border-white/10 rounded-lg">
            {t.noPresets}
          </div>
        )}
      </div>
    </div>
  );
};
