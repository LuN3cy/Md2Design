import { useState, useRef, useEffect } from 'react';
import { useStore } from '../store';
import { useTranslation } from '../i18n';
import { Palette, ChevronRight, ChevronLeft, Plus, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PresetsManager } from './sidebar/PresetsManager';
import { type LocalFont, injectLocalFontFace } from '../utils/fonts';

// Modular Sections
import { TypographySection } from './sidebar/TypographySection';
import { LayoutSection } from './sidebar/LayoutSection';
import { StyleSection } from './sidebar/StyleSection';
import { BackgroundSection } from './sidebar/BackgroundSection';
import { ElementsColorSection } from './sidebar/ElementsColorSection';
import { ContentSection } from './sidebar/ContentSection';
import { CustomCssSection } from './sidebar/CustomCssSection';

export const Sidebar = () => {
  const { 
    cardStyle, 
    resetCardStyle, 
    undoReset, 
    setIsResetting, 
    isSidebarOpen, 
    setIsSidebarOpen 
  } = useStore();
  const t = useTranslation();
  
  const [showResetToast, setShowResetToast] = useState(false);
  const [resetCountdown, setResetCountdown] = useState(10);
  const countdownTimer = useRef<NodeJS.Timeout | null>(null);
  const [localFonts, setLocalFonts] = useState<LocalFont[]>([]);

  useEffect(() => {
    fetch('fonts.json')
      .then(res => res.json())
      .then(data => {
        setLocalFonts(data);
      })
      .catch(err => console.error('Failed to load local fonts list:', err));
  }, []);

  useEffect(() => {
    // Inject local font if it's currently selected and in the list
    const currentFont = localFonts.find(f => f.name === cardStyle.fontFamily);
    if (currentFont) {
      injectLocalFontFace(currentFont.name, currentFont.filename);
    }
  }, [cardStyle.fontFamily, localFonts]);

  const handleReset = () => {
    setIsResetting(true);
    resetCardStyle();
    setShowResetToast(true);
    setResetCountdown(10);
    
    if (countdownTimer.current) clearInterval(countdownTimer.current);
    
    countdownTimer.current = setInterval(() => {
      setResetCountdown(prev => {
        if (prev <= 0.1) {
          if (countdownTimer.current) clearInterval(countdownTimer.current);
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

  const getCountdownColor = () => {
    if (resetCountdown > 5) return '#22c55e';
    if (resetCountdown > 2) return '#eab308';
    return '#ef4444';
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

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {/* Presets */}
              <PresetsManager />

              {/* Layout & Dimensions */}
              <LayoutSection />

              {/* Effects & Style */}
              <StyleSection />

              {/* Background Configuration */}
              <BackgroundSection />

              {/* Content & Colors */}
              <ElementsColorSection />

              {/* Typography */}
              <TypographySection localFonts={localFonts} />

              {/* Content Details (Watermark/Page Numbers) */}
              <ContentSection />

              {/* Advanced Customization */}
              <CustomCssSection />
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
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-100 pointer-events-auto"
          >
            <div className="bg-white/40 dark:bg-black/40 backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-2xl rounded-full px-6 py-4 flex items-center gap-6 min-w-[320px]">
              {/* Countdown Circle */}
              <div className="relative w-12 h-12 shrink-0 flex items-center justify-center">
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
                  className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors text-black dark:text-white opacity-40 hover:opacity-100 shrink-0"
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
