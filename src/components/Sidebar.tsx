import { useState, useRef, useEffect, useLayoutEffect, type CSSProperties, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useStore, PRESET_GRADIENTS } from '../store';
import { useTranslation } from '../i18n';
import type { CardStyle, StylePreset } from '../store';
import { Palette, Type, Layout, Monitor, ChevronRight, ChevronLeft, Smartphone, Monitor as MonitorIcon, Plus, Image as ImageIcon, RotateCcw, Stamp, Upload, Trash2, LayoutPanelTop, Maximize2, X, ChevronUp, ChevronDown, Square, Frame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { HexColorPicker } from 'react-colorful';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

const MarginIcon = ({ side }: { side: 'top' | 'right' | 'bottom' | 'left' | 'all' }) => {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-70">
      <rect x="2.5" y="2.5" width="9" height="9" rx="1" stroke="currentColor" strokeOpacity="0.3" strokeDasharray="2 2" />
      {side === 'top' && <path d="M3 2H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
      {side === 'bottom' && <path d="M3 12H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
      {side === 'left' && <path d="M2 3V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
      {side === 'right' && <path d="M12 3V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
      {side === 'all' && <rect x="2.5" y="2.5" width="9" height="9" rx="1" stroke="currentColor" strokeWidth="1.5" />}
    </svg>
  );
};

const ParameterIcon = ({ type }: { type: 'radius' | 'width' | 'border' | 'x' | 'y' | 'blur' | 'spread' | 'opacity' | 'angle' | 'scale' | 'fontSize' }) => {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-70">
      <rect x="0.5" y="0.5" width="13" height="13" rx="2" stroke="currentColor" strokeOpacity="0.5" />
      {type === 'radius' && <path d="M4 4H7C8.65685 4 10 5.34315 10 7V10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />}
      
      {type === 'width' && <path d="M3 7H11M3 7L5 5M3 7L5 9M11 7L9 5M11 7L9 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />}
      
      {type === 'border' && <rect x="3" y="3" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" />}
      
      {type === 'x' && <path d="M3 7H11M11 7L9 5M11 7L9 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />}
      {type === 'y' && <path d="M7 3V11M7 11L5 9M7 11L9 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />}
      
      {type === 'blur' && <circle cx="7" cy="7" r="3" fill="currentColor" fillOpacity="0.5" style={{ filter: 'blur(1px)' }} />}
      
      {type === 'spread' && <rect x="3" y="3" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />}
      
      {type === 'opacity' && <path d="M7 1V13M7 13C3.68629 13 1 10.3137 1 7C1 3.68629 3.68629 1 7 1V13Z" fill="currentColor" fillOpacity="0.5" />}
      
      {type === 'angle' && <path d="M7 3C9.20914 3 11 4.79086 11 7C11 9.20914 9.20914 11 7 11M7 3V7H11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />}
      
      {type === 'scale' && <path d="M4 10L10 4M10 4H7M10 4V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />}
      
      {type === 'fontSize' && <path d="M4 10L7 4L10 10M5.5 8H8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />}
    </svg>
  );
};

const DraggableNumberInput = ({ 
  value, 
  onChange, 
  min = 0, 
  max = 200, 
  step = 1,
  icon,
  label
}: { 
  value: number, 
  onChange: (val: number) => void, 
  min?: number, 
  max?: number, 
  step?: number,
  icon: React.ReactNode,
  label?: string
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const startValue = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const delta = e.clientX - startX.current;
      // Adjust sensitivity based on step
      const sensitivity = step < 1 ? 0.01 : 0.5;
      const change = delta * sensitivity;
      const rawValue = startValue.current + change;
      
      // Snap to step
      const steppedValue = Math.round(rawValue / step) * step;
      const newValue = Math.max(min, Math.min(max, steppedValue));
      
      // Handle precision issues for float steps
      const finalValue = parseFloat(newValue.toFixed(step < 1 ? 2 : 0));
      onChange(finalValue);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.cursor = '';
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'ew-resize';
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
    };
  }, [isDragging, min, max, step, onChange]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    startX.current = e.clientX;
    startValue.current = value;
  };

  return (
    <div className="space-y-1.5 flex-1">
      {label && (
        <div className="flex items-center justify-between px-0.5">
          <span className="text-[10px] font-bold opacity-40 uppercase tracking-wider">{label}</span>
        </div>
      )}
      <div 
        className={`relative group flex items-center bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg overflow-hidden cursor-ew-resize transition-colors hover:bg-black/10 dark:hover:bg-white/10 ${isDragging ? 'bg-black/10 dark:bg-white/10 ring-1 ring-blue-500/50' : ''}`}
        onMouseDown={handleMouseDown}
        title="Drag left/right to adjust"
      >
        <div className="pl-3 pr-2 text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors pointer-events-none">
          {icon}
        </div>
        <div className="flex-1 py-2 pr-3 text-right font-mono text-xs font-medium select-none pointer-events-none">
          {value}
        </div>
      </div>
    </div>
  );
};

const GradientPresets = ({ onSelect }: { onSelect: (start: string, end: string) => void }) => {
  return (
    <div className="grid grid-cols-4 gap-2 mt-2">
      {PRESET_GRADIENTS.map((g, i) => (
        <button
          key={i}
          onClick={() => onSelect(g.start, g.end)}
          className="w-full aspect-square rounded-md border border-black/10 dark:border-white/10 transition-transform active:scale-95 hover:scale-105"
          style={{ background: `linear-gradient(135deg, ${g.start} 0%, ${g.end} 100%)` }}
          title={g.name}
        />
      ))}
    </div>
  );
};

const PresetsManager = () => {
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
    <div className="space-y-4 mb-8">
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {previewPreset && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[1000] bg-black/35"
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

      <div className="flex items-center justify-between">
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
            className="overflow-hidden"
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

      <div className="grid grid-cols-3 gap-2 justify-items-center">
        {presets.map((preset) => (
          <div 
            key={preset.id}
            className="group relative bg-black/5 dark:bg-white/5 rounded-lg border border-black/5 dark:border-white/5 overflow-hidden transition-all hover:border-blue-500/50 w-full max-w-[72px]"
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

            <div className="p-1.5 bg-white/50 dark:bg-black/20 backdrop-blur-sm">
              <span className="text-[9px] font-medium truncate opacity-70 block text-center">{preset.name}</span>
            </div>
          </div>
        ))}

        {presets.length === 0 && !isSaving && (
          <div className="col-span-3 py-4 text-center opacity-30 text-[10px] italic border border-dashed border-black/10 dark:border-white/10 rounded-lg">
            {t.noPresets}
          </div>
        )}
      </div>
    </div>
  );
};

const PresetCard = ({
  content,
  index,
  style,
  getPreviewDimensions
}: {
  content: string;
  index: number;
  style: CardStyle;
  getPreviewDimensions: (style: CardStyle) => { width: number; height: number };
}) => {
  const base = getPreviewDimensions(style);

  const outerStyle: CSSProperties = {
    width: `${base.width}px`,
    height: `${base.height}px`,
    padding: style.enableBackground ? `${style.padding}px` : '0',
    background: 'transparent',
  };

  const innerStyle: CSSProperties = {
    fontFamily: style.fontFamily,
    backgroundColor: 'transparent',
    color: style.textColor,
    fontSize: `${style.fontSize}px`,
    borderRadius: `${style.borderRadius}px`,
    borderWidth: `${style.borderWidth}px`,
    borderColor: style.borderColor,
    boxShadow: style.shadowEnabled ? style.shadow : 'none',
    paddingTop: `${style.cardPadding?.top ?? style.contentPadding}px`,
    paddingRight: `${style.cardPadding?.right ?? style.contentPadding}px`,
    paddingBottom: `${style.cardPadding?.bottom ?? style.contentPadding}px`,
    paddingLeft: `${style.cardPadding?.left ?? style.contentPadding}px`,
  };

  const renderOuterBackground = () => {
    if (!style.enableBackground) return null;

    if (style.backgroundType === 'image' && style.backgroundImage) {
      return (
        <div className="absolute inset-0 overflow-hidden -z-10 rounded-none pointer-events-none">
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundImage: `url(${style.backgroundImage})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              transform: `translate(${style.backgroundConfig.x}px, ${style.backgroundConfig.y}px) scale(${style.backgroundConfig.scale})`,
              filter: `blur(${style.backgroundConfig.blur}px)`
            }}
          />
        </div>
      );
    }

    if (style.backgroundType === 'gradient') {
      return <div className="absolute inset-0 -z-10 pointer-events-none" style={{ background: style.backgroundValue }} />;
    }

    return <div className="absolute inset-0 -z-10 pointer-events-none" style={{ background: style.backgroundValue }} />;
  };

  const renderInnerBackground = () => {
    const type = style.cardBackgroundType || 'solid';
    const innerRadius = Math.max(0, style.borderRadius - style.borderWidth);
    const radiusStyle: CSSProperties = { borderRadius: `${innerRadius}px` };

    if (type === 'image' && style.cardBackgroundImage) {
      return (
        <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none" style={radiusStyle}>
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundImage: `url(${style.cardBackgroundImage})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              transform: `translate(${style.cardBackgroundConfig.x}px, ${style.cardBackgroundConfig.y}px) scale(${style.cardBackgroundConfig.scale})`,
              filter: `blur(${style.cardBackgroundConfig.blur}px)`
            }}
          />
        </div>
      );
    }

    if (type === 'gradient') {
      return <div className="absolute inset-0 -z-10 pointer-events-none" style={{ ...radiusStyle, background: style.cardGradientValue }} />;
    }

    return <div className="absolute inset-0 -z-10 pointer-events-none bg-current" style={{ ...radiusStyle, color: style.backgroundColor }} />;
  };

  return (
    <div className="relative shadow-2xl overflow-hidden flex flex-col flex-shrink-0" style={outerStyle}>
      {renderOuterBackground()}

      <div className="relative w-full h-full flex flex-col overflow-hidden" style={innerStyle}>
        {renderInnerBackground()}

        {style.template === 'default' && (
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-400 to-orange-300 blur-3xl opacity-20 -z-0 pointer-events-none" />
        )}

        <div className="relative z-10 h-full flex flex-col">
          <div className="prose prose-sm max-w-none flex-1 overflow-hidden">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkBreaks]}
              components={{
                h1: ({ ...props }) => (
                  <div className="flex flex-col items-center mb-8 first:mt-0 mt-8">
                    <h1 style={{ color: style.h1Color || style.textColor }} className="text-3xl font-bold mb-2 text-center" {...props} />
                    <div className="h-1 w-24 rounded-full" style={{ backgroundColor: style.h1LineColor || style.accentColor }} />
                  </div>
                ),
                h2: ({ ...props }) => (
                  <div className="flex justify-center mb-6 mt-8 first:mt-0">
                    <h2
                      style={{
                        backgroundColor: style.h2BackgroundColor || style.accentColor,
                        color: style.h2Color || '#fff'
                      }}
                      className="text-lg font-bold px-4 py-1.5 shadow-md rounded-lg"
                      {...props}
                    />
                  </div>
                ),
                h3: ({ ...props }) => (
                  <h3
                    style={{
                      color: style.h3Color || style.textColor,
                      borderLeftColor: style.h3LineColor || style.accentColor
                    }}
                    className="text-xl font-bold mb-4 mt-6 first:mt-0 pl-3 border-l-4"
                    {...props}
                  />
                ),
                p: ({ ...props }) => (
                  <p style={{ color: style.textColor }} className="mb-4 leading-relaxed opacity-90 first:mt-0" {...props} />
                ),
                ul: ({ ...props }) => <ul style={{ color: style.textColor }} className="mb-4 list-disc list-outside pl-5 space-y-1" {...props} />,
                ol: ({ ...props }) => <ol style={{ color: style.textColor }} className="mb-4 list-decimal list-outside pl-5 space-y-1" {...props} />,
                li: ({ ...props }) => <li className="pl-1 marker:opacity-70 [&>p]:mb-2" {...props} />,
                table: ({ ...props }) => (
                  <div className="overflow-x-auto mb-6 rounded-lg border border-current opacity-90">
                    <table className="w-full text-left text-sm border-collapse" {...props} />
                  </div>
                ),
                thead: ({ ...props }) => <thead className="bg-black/5 dark:bg-white/10 font-semibold" {...props} />,
                tbody: ({ ...props }) => <tbody className="divide-y divide-current/10" {...props} />,
                tr: ({ ...props }) => <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors" {...props} />,
                th: ({ ...props }) => <th className="p-3 border-b border-current/20 whitespace-nowrap" {...props} />,
                td: ({ ...props }) => <td className="p-3 border-b border-current/10" {...props} />,
                pre: ({ children }) => <>{children}</>,
                blockquote: ({ ...props }) => (
                  <blockquote
                    style={{
                      borderLeftColor: style.blockquoteBorderColor,
                      backgroundColor: style.blockquoteBackgroundColor
                    }}
                    className="border-l-4 pl-4 py-2 my-4 italic opacity-90 rounded-r-lg rounded-bl-sm [&>p:last-child]:mb-0"
                    {...props}
                  />
                ),
                a: ({ ...props }) => <a style={{ color: style.accentColor }} className="underline decoration-auto underline-offset-2" {...props} />,
                img: ({ src, alt, ...props }: { src?: string; alt?: string }) => {
                  if (src === 'spacer') {
                    return <div className="w-full" style={{ height: '200px' }} />;
                  }
                  let width: string | undefined;
                  let cleanSrc = src;
                  if (src && src.includes('#width=')) {
                    const parts = src.split('#width=');
                    cleanSrc = parts[0];
                    width = parts[1];
                  }
                  return (
                    <img
                      src={cleanSrc}
                      alt={alt}
                      crossOrigin="anonymous"
                      className="markdown-image"
                      style={{
                        display: 'block',
                        maxWidth: '100%',
                        width: width || 'auto',
                        borderRadius: '8px',
                        marginTop: '1rem',
                        marginBottom: '1rem'
                      }}
                      {...props}
                    />
                  );
                },
                code: ({ children, ...props }: { children?: ReactNode }) => {
                  const text = String(children ?? '');
                  return !text.includes('\n') ? (
                    <code style={{ backgroundColor: style.codeBackgroundColor }} className="rounded px-1.5 py-0.5 text-[0.9em] font-mono" {...props}>
                      {children}
                    </code>
                  ) : (
                    <code style={{ backgroundColor: style.codeBackgroundColor, fontSize: '0.8em' }} className="block rounded-lg p-4 font-mono my-4 overflow-x-auto whitespace-pre-wrap break-words" {...props}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {content}
            </ReactMarkdown>
          </div>

          <div
            className="flex-shrink-0 w-full pt-2 flex items-center relative font-mono uppercase tracking-widest pointer-events-none text-[10px] h-8"
            style={{ opacity: style.watermark.opacity ?? 0.6 }}
          >
            <div className="absolute left-0 flex items-center gap-4">
              {style.pageNumber.enabled && style.pageNumber.position === 'left' && <span className="font-bold">{index + 1}</span>}
              {style.watermark.enabled && style.watermark.position === 'left' && <span>{style.watermark.content}</span>}
            </div>

            <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-4">
              {style.pageNumber.enabled && style.pageNumber.position === 'center' && <span className="font-bold">{index + 1}</span>}
              {style.watermark.enabled && style.watermark.position === 'center' && <span>{style.watermark.content}</span>}
            </div>

            <div className="absolute right-0 flex items-center gap-4">
              {style.watermark.enabled && style.watermark.position === 'right' && <span>{style.watermark.content}</span>}
              {style.pageNumber.enabled && style.pageNumber.position === 'right' && <span className="font-bold">{index + 1}</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ColorPicker = ({ color, onChange, label }: { color: string, onChange: (color: string) => void, label?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  const updatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const popoverWidth = 240; // Approx width of our popover
      const popoverHeight = 240; // Approx height
      
      let top = rect.bottom + 8;
      let left = rect.right - popoverWidth;

      // Check if it goes off screen bottom
      if (top + popoverHeight > window.innerHeight) {
        top = rect.top - popoverHeight - 8;
      }

      // Check if it goes off screen left
      if (left < 10) {
        left = 10;
      }

      setCoords({ top, left });
    }
  };

  useLayoutEffect(() => {
    if (isOpen) {
      updatePosition();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => {
      if (isOpen) {
        // If the scroll happened in a parent of the button, update position
        updatePosition();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', updatePosition);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen]);

  return (
    <div className="relative">
      <div className="flex flex-col gap-2">
        {label && <span className="text-xs opacity-70">{label}</span>}
        <div className="flex items-center gap-2 w-full">
          <div className="relative flex-1">
            <input 
              type="text" 
              value={color.toUpperCase()} 
              onChange={(e) => onChange(e.target.value)}
              className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded px-2 py-2 text-[10px] font-mono focus:outline-none focus:border-black/30 dark:focus:border-white/30 text-center"
            />
          </div>
          <button 
            ref={buttonRef}
            onClick={() => setIsOpen(!isOpen)}
            className="w-8 h-8 rounded-full border border-black/20 dark:border-white/20 shadow-sm relative overflow-hidden transition-transform active:scale-95 flex-shrink-0"
            style={{ backgroundColor: color }}
          />
        </div>
      </div>
      
      {isOpen && createPortal(
        <div 
          ref={popoverRef} 
          className="fixed z-[9999] p-3 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-black/10 dark:border-white/10"
          style={{ 
            top: coords.top, 
            left: coords.left,
            width: 'fit-content'
          }}
        >
          <HexColorPicker color={color} onChange={onChange} />
        </div>,
        document.body
      )}
    </div>
  );
};

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

  // Force visual difference for 4:3 vs 3:2 in portrait if they are too similar
  return (
    <div 
      className="border border-current opacity-70 mb-1"
      style={{ width: `${width}px`, height: `${height}px` }}
    />
  );
};

const ColorSectionWrapper = ({ children, label }: { children: React.ReactNode, label?: string }) => (
  <div className="p-3 bg-black/5 dark:bg-white/5 rounded-lg border border-black/5 dark:border-white/5 space-y-3">
     {label && <label className="text-xs font-medium opacity-70 block mb-2">{label}</label>}
     {children}
  </div>
);

export const Sidebar = () => {
  const { cardStyle, updateCardStyle, addCustomFont, resetCardStyle, undoReset, setIsResetting, isSidebarOpen, setIsSidebarOpen } = useStore();
  const t = useTranslation();
  const [showResetToast, setShowResetToast] = useState(false);
  const [resetCountdown, setResetCountdown] = useState(10);
  const countdownTimer = useRef<NodeJS.Timeout | null>(null);

  const handleReset = () => {
    setIsResetting(true);
    resetCardStyle();
    setShowResetToast(true);
    setResetCountdown(10);
    
    if (countdownTimer.current) clearInterval(countdownTimer.current);
    
    countdownTimer.current = setInterval(() => {
      setResetCountdown(prev => {
        if (prev <= 0.1) {
          clearInterval(countdownTimer.current!);
          setShowResetToast(false);
          setIsResetting(false);
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);
  };

  const handleUndo = () => {
    undoReset();
    setShowResetToast(false);
    setIsResetting(false);
    if (countdownTimer.current) clearInterval(countdownTimer.current);
  };

  const closeToast = () => {
    setShowResetToast(false);
    setIsResetting(false);
    if (countdownTimer.current) clearInterval(countdownTimer.current);
  };

  // Get color based on countdown
  const getCountdownColor = () => {
    if (resetCountdown > 5) return '#22c55e'; // Green
    if (resetCountdown > 2) return '#eab308'; // Yellow
    return '#ef4444'; // Red
  };

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
      <AnimatePresence mode="wait">
        {isSidebarOpen ? (
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
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleReset}
                  className="px-3 py-1.5 bg-black text-white dark:bg-white dark:text-black rounded-full flex items-center gap-1.5 transition-transform active:scale-95 shadow-lg hover:opacity-90"
                  title={t.resetStyle}
                >
                  <span className="text-xs font-bold tracking-wider">{t.resetStyle}</span>
                  <RotateCcw size={12} strokeWidth={3} />
                </button>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {/* Presets */}
              <PresetsManager />

              {/* Layout */}
              <div className="mb-8 space-y-4">
                <h2 className="text-sm font-semibold mb-4 opacity-80 flex items-center gap-2">
                   <Layout size={16} /> {t.layout}
                </h2>
                
                {/* Orientation */}
                <div className="flex p-1 bg-black/5 dark:bg-white/5 rounded-lg border border-black/10 dark:border-white/10 mb-4">
                  {['portrait', 'landscape', 'autoHeight'].map((o) => (
                    <button
                      key={o}
                      onClick={() => {
                          if (o === 'autoHeight') {
                              updateCardStyle({ autoHeight: true });
                          } else {
                              updateCardStyle({ orientation: o as any, autoHeight: false });
                          }
                      }}
                      className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-medium rounded-md transition-all ${
                        (o === 'autoHeight' ? cardStyle.autoHeight : (!cardStyle.autoHeight && cardStyle.orientation === o))
                          ? 'bg-white text-black shadow-sm'
                          : 'text-inherit hover:bg-black/5 dark:hover:bg-white/5 opacity-60 hover:opacity-100'
                      }`}
                    >
                      {o === 'portrait' ? <Smartphone size={14} /> : o === 'landscape' ? <MonitorIcon size={14} /> : <Layout size={14} />}
                      <span className="capitalize">{o === 'autoHeight' ? t.autoHeight : (t as any)[o]}</span>
                    </button>
                  ))}
                </div>

                {/* Aspect Ratio */}
                {cardStyle.autoHeight ? (
                    <div className="mb-4">
                        <label className="text-xs font-medium opacity-70 mb-2 block">卡片宽度 (px)</label>
                        <DraggableNumberInput 
                            value={cardStyle.width} 
                            min={300} max={1200} 
                            onChange={(val) => updateCardStyle({ width: val })} 
                            icon={<ParameterIcon type="width" />}
                        />
                    </div>
                ) : (
                <div className="grid grid-cols-5 gap-2 mb-4">
                  {ASPECT_RATIOS.map((ratio) => {
                     const isPortrait = cardStyle.orientation === 'portrait';
                     const displayLabel = isPortrait && ratio.value !== 'custom'
                        ? ratio.value.split(':').reverse().join(':')
                        : ratio.label;

                     return (
                     <button
                       key={ratio.value}
                       onClick={() => updateCardStyle({ aspectRatio: ratio.value })}
                       className={`p-2 rounded-lg border text-xs flex flex-col items-center justify-center gap-1 transition-all h-14 ${
                         cardStyle.aspectRatio === ratio.value
                           ? 'bg-black/10 dark:bg-white/20 border-black/20 dark:border-white/40 shadow-sm text-slate-900 dark:text-white' 
                           : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 text-slate-600 dark:text-white/60'
                       }`}
                     >
                       <RatioIcon ratio={ratio.value} orientation={cardStyle.orientation} />
                       {displayLabel}
                     </button>
                  )})}
                </div>
                )}

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
                <div className="mb-4">
                  <label className="text-xs font-medium opacity-70 mb-2 block">{t.cornerRadius} (px)</label>
                  <DraggableNumberInput 
                    value={cardStyle.borderRadius} 
                    min={0} max={48} 
                    onChange={(val) => updateCardStyle({ borderRadius: val })} 
                    icon={<ParameterIcon type="radius" />}
                    label={t.cornerRadius}
                  />
                </div>

                {/* Content Padding */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium opacity-70">{t.contentPadding}</label>
                    <button 
                      onClick={() => updateCardStyle({ cardPaddingSync: !cardStyle.cardPaddingSync })}
                      className={`p-1.5 rounded-md transition-all hover:bg-black/5 dark:hover:bg-white/5 ${cardStyle.cardPaddingSync ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}
                      title={t.paddingSync}
                    >
                      {cardStyle.cardPaddingSync ? <Square size={14} /> : <Frame size={14} />}
                    </button>
                  </div>

                  {cardStyle.cardPaddingSync ? (
                    <DraggableNumberInput 
                      value={cardStyle.cardPadding?.top ?? cardStyle.contentPadding} 
                      min={0} max={200} 
                      onChange={(val) => updateCardStyle({ 
                        cardPadding: { top: val, right: val, bottom: val, left: val } 
                      })} 
                      icon={<MarginIcon side="all" />}
                      label={t.all}
                    />
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                       <DraggableNumberInput 
                         value={cardStyle.cardPadding?.top ?? cardStyle.contentPadding}
                         onChange={(val) => updateCardStyle({ cardPadding: { ...(cardStyle.cardPadding || { top: cardStyle.contentPadding, right: cardStyle.contentPadding, bottom: cardStyle.contentPadding, left: cardStyle.contentPadding }), top: val } })}
                         icon={<MarginIcon side="top" />}
                         label={t.top}
                       />
                       <DraggableNumberInput 
                         value={cardStyle.cardPadding?.right ?? cardStyle.contentPadding}
                         onChange={(val) => updateCardStyle({ cardPadding: { ...(cardStyle.cardPadding || { top: cardStyle.contentPadding, right: cardStyle.contentPadding, bottom: cardStyle.contentPadding, left: cardStyle.contentPadding }), right: val } })}
                         icon={<MarginIcon side="right" />}
                         label={t.right}
                       />
                       <DraggableNumberInput 
                         value={cardStyle.cardPadding?.bottom ?? cardStyle.contentPadding}
                         onChange={(val) => updateCardStyle({ cardPadding: { ...(cardStyle.cardPadding || { top: cardStyle.contentPadding, right: cardStyle.contentPadding, bottom: cardStyle.contentPadding, left: cardStyle.contentPadding }), bottom: val } })}
                         icon={<MarginIcon side="bottom" />}
                         label={t.bottom}
                       />
                       <DraggableNumberInput 
                         value={cardStyle.cardPadding?.left ?? cardStyle.contentPadding}
                         onChange={(val) => updateCardStyle({ cardPadding: { ...(cardStyle.cardPadding || { top: cardStyle.contentPadding, right: cardStyle.contentPadding, bottom: cardStyle.contentPadding, left: cardStyle.contentPadding }), left: val } })}
                         icon={<MarginIcon side="left" />}
                         label={t.left}
                       />
                    </div>
                  )}
                </div>
                
                {/* Border */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium opacity-70">{t.border}</label>
                    <label className="text-[10px] uppercase tracking-wider opacity-60">WIDTH (PX)</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-[1.5]">
                      <ColorPicker 
                        color={cardStyle.borderColor} 
                        onChange={(val) => updateCardStyle({ borderColor: val })} 
                      />
                    </div>
                    <div className="flex-1">
                       <DraggableNumberInput 
                         value={cardStyle.borderWidth} 
                         min={0} max={40} 
                         onChange={(val) => updateCardStyle({ borderWidth: val })} 
                         icon={<ParameterIcon type="border" />}
                         label={t.border}
                       />
                     </div>
                  </div>
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
                          <label className="text-[10px] uppercase tracking-wider opacity-60 mb-1 block">{t.xOffset}</label>
                          <DraggableNumberInput value={cardStyle.shadowConfig?.x ?? 0} min={-50} max={50} onChange={(val) => updateCardStyle({ shadowConfig: { ...cardStyle.shadowConfig, x: val } })} icon={<ParameterIcon type="x" />} />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-wider opacity-60 mb-1 block">{t.yOffset}</label>
                          <DraggableNumberInput value={cardStyle.shadowConfig?.y ?? 0} min={-50} max={50} onChange={(val) => updateCardStyle({ shadowConfig: { ...cardStyle.shadowConfig, y: val } })} icon={<ParameterIcon type="y" />} />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] uppercase tracking-wider opacity-60 mb-1 block">{t.blur}</label>
                          <DraggableNumberInput value={cardStyle.shadowConfig?.blur ?? 0} min={0} max={100} onChange={(val) => updateCardStyle({ shadowConfig: { ...cardStyle.shadowConfig, blur: val } })} icon={<ParameterIcon type="blur" />} />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-wider opacity-60 mb-1 block">{t.spread}</label>
                          <DraggableNumberInput value={cardStyle.shadowConfig?.spread ?? 0} min={-50} max={50} onChange={(val) => updateCardStyle({ shadowConfig: { ...cardStyle.shadowConfig, spread: val } })} icon={<ParameterIcon type="spread" />} />
                        </div>
                      </div>

                      <ColorPicker 
                        label={t.colors}
                        color={cardStyle.shadowConfig?.color || '#000000'}
                        onChange={(val) => updateCardStyle({ shadowConfig: { ...cardStyle.shadowConfig, color: val } })}
                      />
                      
                      <div>
                        <label className="text-[10px] uppercase tracking-wider opacity-60 mb-1 block">{t.opacity}</label>
                        <DraggableNumberInput value={cardStyle.shadowConfig?.opacity ?? 0} min={0} max={1} step={0.01} onChange={(val) => updateCardStyle({ shadowConfig: { ...cardStyle.shadowConfig, opacity: val } })} icon={<ParameterIcon type="opacity" />} />
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
                      {['solid', 'gradient', 'image'].map((type) => (
                        <button 
                          key={type}
                          onClick={() => updateCardStyle({ backgroundType: type as any })}
                          className={`flex-1 py-1 text-[10px] rounded transition-all capitalize ${cardStyle.backgroundType === type ? 'bg-black/10 dark:bg-white/20 text-slate-900 dark:text-white' : 'text-black/50 dark:text-white/50'}`}
                        >
                          {t[type as keyof typeof t]}
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
                           <div className="space-y-3 pt-2">
                             <div className="aspect-video w-full rounded-lg overflow-hidden bg-black/5 relative">
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
                           </div>
                         )}
                       </div>
                    )}

                    <div>
                      <label className="text-[10px] uppercase tracking-wider opacity-60 mb-1 block">{t.padding}</label>
                      <DraggableNumberInput value={cardStyle.padding} min={0} max={100} onChange={(val) => updateCardStyle({ padding: val })} icon={<ParameterIcon type="radius" />} />
                    </div>
                  </div>
                )}
              </div>

              {/* Card Colors */}
              <div className="mb-8 space-y-4">
                <h2 className="text-sm font-semibold mb-4 opacity-80 flex items-center gap-2">
                   <Palette size={16} /> {t.cardBackground}
                </h2>
                
                {/* Card Background (Enhanced) */}
                <ColorSectionWrapper label={t.cardBackground}>
                   <div className="flex p-1 bg-black/5 dark:bg-white/5 rounded mb-2">
                      {['solid', 'gradient', 'image'].map((type) => (
                        <button 
                          key={type}
                          onClick={() => updateCardStyle({ cardBackgroundType: type as any })}
                          className={`flex-1 py-1 text-[10px] rounded transition-all capitalize ${cardStyle.cardBackgroundType === type ? 'bg-black/10 dark:bg-white/20 text-slate-900 dark:text-white' : 'text-black/50 dark:text-white/50'}`}
                        >
                          {t[type as keyof typeof t]}
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
                        <ColorPicker 
                          label={t.startColor}
                          color={cardStyle.cardGradientStart || '#ffffff'}
                          onChange={(val) => {
                            const start = val;
                            const end = cardStyle.cardGradientEnd || '#f0f0f0';
                            const angle = cardStyle.cardGradientAngle || 135;
                            updateCardStyle({ 
                              cardGradientStart: start,
                              cardGradientValue: `linear-gradient(${angle}deg, ${start} 0%, ${end} 100%)` 
                            });
                          }}
                        />
                        <ColorPicker 
                          label={t.endColor}
                          color={cardStyle.cardGradientEnd || '#f0f0f0'}
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
                            const end = cardStyle.cardGradientEnd || '#f0f0f0';
                            updateCardStyle({ 
                              cardGradientAngle: angle,
                              cardGradientValue: `linear-gradient(${angle}deg, ${start} 0%, ${end} 100%)` 
                            });
                          }} icon={<ParameterIcon type="angle" />} />
                        </div>
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
                           <div className="space-y-3 pt-2">
                             <div className="aspect-video w-full rounded-lg overflow-hidden bg-black/5 relative">
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
                           </div>
                         )}
                       </div>
                    )}
                </ColorSectionWrapper>

                <ColorSectionWrapper>
                  <ColorPicker 
                    label={t.text}
                    color={cardStyle.textColor}
                    onChange={(val) => handleColorChange('textColor', val)}
                  />
                </ColorSectionWrapper>

                <ColorSectionWrapper>
                  <div className="grid grid-cols-2 gap-3">
                    <ColorPicker 
                      label={t.blockquoteBackground}
                      color={cardStyle.blockquoteBackgroundColor.substring(0, 7)}
                      onChange={(val) => handleColorChange('blockquoteBackgroundColor', val + '20')}
                    />
                    <ColorPicker 
                      label={t.blockquoteBorder}
                      color={cardStyle.blockquoteBorderColor}
                      onChange={(val) => handleColorChange('blockquoteBorderColor', val)}
                    />
                  </div>
                </ColorSectionWrapper>

                <ColorSectionWrapper>
                  <ColorPicker 
                    label={t.codeBackground}
                    color={cardStyle.codeBackgroundColor.substring(0, 7)}
                    onChange={(val) => handleColorChange('codeBackgroundColor', val + '20')}
                  />
                </ColorSectionWrapper>

                <ColorSectionWrapper>
                  <div className="grid grid-cols-2 gap-3">
                    <ColorPicker 
                      label={t.h1Color}
                      color={cardStyle.h1Color || '#000000'}
                      onChange={(val) => handleColorChange('h1Color', val)}
                    />
                    <ColorPicker 
                      label={t.h1LineColor}
                      color={cardStyle.h1LineColor || '#3b82f6'}
                      onChange={(val) => handleColorChange('h1LineColor', val)}
                    />
                  </div>
                </ColorSectionWrapper>

                <ColorSectionWrapper>
                  <div className="grid grid-cols-2 gap-3">
                    <ColorPicker 
                      label={t.h2Color}
                      color={cardStyle.h2Color || '#ffffff'}
                      onChange={(val) => handleColorChange('h2Color', val)}
                    />
                    <ColorPicker 
                      label={t.h2BgColor}
                      color={cardStyle.h2BackgroundColor || '#3b82f6'}
                      onChange={(val) => handleColorChange('h2BackgroundColor', val)}
                    />
                  </div>
                </ColorSectionWrapper>

                <ColorSectionWrapper>
                  <div className="grid grid-cols-2 gap-3">
                    <ColorPicker 
                      label={t.h3Color}
                      color={cardStyle.h3Color || '#000000'}
                      onChange={(val) => handleColorChange('h3Color', val)}
                    />
                    <ColorPicker 
                      label={t.h3LineColor}
                      color={cardStyle.h3LineColor || '#3b82f6'}
                      onChange={(val) => handleColorChange('h3LineColor', val)}
                    />
                  </div>
                </ColorSectionWrapper>
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

                <div className="mb-4">
                  <label className="text-xs font-medium opacity-70 mb-2 block">文本字号</label>
                  <DraggableNumberInput value={cardStyle.fontSize} min={12} max={96} onChange={(val) => updateCardStyle({ fontSize: val })} icon={<ParameterIcon type="fontSize" />} />
                </div>
                
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider opacity-60 mb-1 block">H1 字号</label>
                    <DraggableNumberInput value={cardStyle.h1FontSize} min={16} max={48} onChange={(val) => updateCardStyle({ h1FontSize: val })} icon={<ParameterIcon type="fontSize" />} />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider opacity-60 mb-1 block">H2 字号</label>
                    <DraggableNumberInput value={cardStyle.h2FontSize} min={14} max={36} onChange={(val) => updateCardStyle({ h2FontSize: val })} icon={<ParameterIcon type="fontSize" />} />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider opacity-60 mb-1 block">H3 字号</label>
                    <DraggableNumberInput value={cardStyle.h3FontSize} min={12} max={24} onChange={(val) => updateCardStyle({ h3FontSize: val })} icon={<ParameterIcon type="fontSize" />} />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium opacity-70 mb-2 block">{t.headingScale}</label>
                  <DraggableNumberInput value={cardStyle.headingScale} min={0.5} max={2.0} step={0.1} onChange={(val) => updateCardStyle({ headingScale: val })} icon={<ParameterIcon type="fontSize" />} />
                </div>
              </div>

              {/* Watermark & Page Number */}
              <div className="mb-8 space-y-4">
                 <h2 className="text-sm font-semibold mb-4 opacity-80 flex items-center gap-2">
                   <Stamp size={16} /> {t.watermark} / {t.pageNumber}
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

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] uppercase tracking-wider opacity-60 mb-1 block">{t.opacity}</label>
                            <DraggableNumberInput value={cardStyle.watermark.opacity} min={0} max={1} step={0.05} onChange={(val) => updateCardStyle({ watermark: { ...cardStyle.watermark, opacity: val } })} icon={<ParameterIcon type="opacity" />} />
                          </div>
                          <div>
                            <label className="text-[10px] uppercase tracking-wider opacity-60 mb-1 block">{t.fontSize}</label>
                            <DraggableNumberInput value={cardStyle.watermark.fontSize} min={6} max={64} step={1} onChange={(val) => updateCardStyle({ watermark: { ...cardStyle.watermark, fontSize: val } })} icon={<ParameterIcon type="fontSize" />} />
                          </div>
                        </div>
                        <ColorPicker 
                          label={t.text}
                          color={cardStyle.watermark.color || cardStyle.textColor} 
                          onChange={(val) => updateCardStyle({ watermark: { ...cardStyle.watermark, color: val } })} 
                        />
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

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] uppercase tracking-wider opacity-60 mb-1 block">{t.opacity}</label>
                            <DraggableNumberInput value={cardStyle.pageNumber.opacity} min={0} max={1} step={0.05} onChange={(val) => updateCardStyle({ pageNumber: { ...cardStyle.pageNumber, opacity: val } })} icon={<ParameterIcon type="opacity" />} />
                          </div>
                          <div>
                            <label className="text-[10px] uppercase tracking-wider opacity-60 mb-1 block">{t.fontSize}</label>
                            <DraggableNumberInput value={cardStyle.pageNumber.fontSize} min={6} max={64} step={1} onChange={(val) => updateCardStyle({ pageNumber: { ...cardStyle.pageNumber, fontSize: val } })} icon={<ParameterIcon type="fontSize" />} />
                          </div>
                        </div>
                        <ColorPicker 
                          label={t.text}
                          color={cardStyle.pageNumber.color || cardStyle.textColor} 
                          onChange={(val) => updateCardStyle({ pageNumber: { ...cardStyle.pageNumber, color: val } })} 
                        />
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
            onClick={() => setIsSidebarOpen(true)}
            className="absolute right-6 top-1/2 -translate-y-1/2 p-3 glass-panel rounded-full z-40 text-inherit shadow-xl"
          >
            <ChevronLeft size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showResetToast && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] pointer-events-auto"
          >
            <div className="bg-white/40 dark:bg-black/40 backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-2xl rounded-full px-6 py-4 flex items-center gap-6 min-w-[320px]">
              {/* Countdown Circle */}
              <div className="relative w-12 h-12 flex-shrink-0 flex items-center justify-center">
                <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 48 48">
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="transparent"
                    className="text-black/5 dark:text-white/5"
                  />
                  <motion.circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke={getCountdownColor()}
                    strokeWidth="3"
                    fill="transparent"
                    strokeDasharray="125.6"
                    animate={{ strokeDashoffset: 125.6 * (1 - resetCountdown / 10) }}
                    transition={{ duration: 0.1, ease: "linear" }}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] font-bold font-mono text-black dark:text-white leading-none">
                    {Math.ceil(resetCountdown)}s
                  </span>
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-sm font-bold text-black dark:text-white mb-0.5 whitespace-nowrap">{t.styleResetToast}</h3>
                <p className="text-[10px] opacity-60 text-black dark:text-white whitespace-nowrap">{t.settingsRestoredToast}</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleUndo}
                  className="px-5 py-2 bg-black dark:bg-white text-white dark:text-black rounded-full text-xs font-bold hover:opacity-90 transition-opacity active:scale-95 whitespace-nowrap"
                >
                  {t.undo}
                </button>
                <button
                  onClick={closeToast}
                  className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors text-black dark:text-white opacity-40 hover:opacity-100 flex-shrink-0"
                >
                  <Plus size={18} className="rotate-45" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
