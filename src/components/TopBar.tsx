import { useState, useEffect } from 'react';
import { useStore } from '../store';
import { useTranslation } from '../i18n';
import { Moon, Sun, Download, Languages, Info, X, ChevronDown, Check, Github, Sparkles, MessageSquare, Check as CheckIcon, RotateCcw } from 'lucide-react';
import { toPng, toJpeg } from 'html-to-image';
import { motion, AnimatePresence } from 'framer-motion';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { ChangelogModal } from './ChangelogModal';

import logoSvg from '../assets/logo.svg';

export const TopBar = () => {
  const { theme, toggleTheme, toggleLanguage, isScrolled, previewZoom, setPreviewZoom, isExporting, setIsExporting } = useStore();
  const t = useTranslation();
  const [showContact, setShowContact] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showChangelog, setShowChangelog] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Onboarding tooltip logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowOnboarding(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const closeOnboarding = () => {
    setShowOnboarding(false);
  };

  // Custom Dropdown Component
  const CustomDropdown = <T extends string>({ 
    value, 
    options, 
    onChange, 
    className = "" 
  }: { 
    value: T, 
    options: { id: T, label: string }[], 
    onChange: (val: T) => void,
    className?: string
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = options.find(o => o.id === value);

    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-white/50 dark:bg-black/20 border border-black/5 dark:border-white/5 rounded-lg p-2 text-xs flex items-center justify-between hover:border-blue-500/30 transition-all"
        >
          <span className="truncate">{selectedOption?.label}</span>
          <ChevronDown size={12} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
              <div className="fixed inset-0 z-100" onClick={() => setIsOpen(false)} />
              <motion.div
                initial={{ opacity: 0, y: 4, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.95 }}
                className="absolute left-0 right-0 top-full mt-1 z-101 bg-white dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden py-1"
              >
                {options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      onChange(option.id);
                      setIsOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-xs transition-colors flex items-center justify-between ${
                      value === option.id 
                        ? 'bg-blue-500 text-white' 
                        : 'text-slate-700 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    {option.label}
                    {value === option.id && <CheckIcon size={12} />}
                  </button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // Export Settings
  const [format, setFormat] = useState<'png' | 'jpg'>('png');
  const [scale, setScale] = useState<1 | 2 | 3 | 4>(2);
  const [exportMode, setExportMode] = useState<'single' | 'multiple'>('multiple');
  const [exportTarget, setExportTarget] = useState<'folder' | 'zip'>('zip');
  const [folderName, setFolderName] = useState('cards-export'); 
  const [namingMode, setNamingMode] = useState<'system' | 'custom'>('system');
  const [namingParts, setNamingParts] = useState<('prefix' | 'date' | 'custom' | 'number')[]>(['prefix', 'date', 'custom', 'number']);
  const [namingConfigs, setNamingConfigs] = useState({
    prefix: 'Md2Design',
    custom: 'MyCard',
    includeTime: true,
    dateFormat: 'dateFormatFull' as 'dateFormatFull' | 'dateFormatShort' | 'dateFormatMDY' | 'dateFormatDMY' | 'dateFormatYMD',
    numberType: 'arabic' as 'arabic' | 'chinese',
    numberOrder: 'asc' as 'asc' | 'desc',
    zeroStart: false,
  });

  const generateFileName = (index: number, total: number) => {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    
    const getFormattedDate = () => {
      const yy = now.getFullYear().toString().slice(-2);
      const mm = pad(now.getMonth() + 1);
      const dd = pad(now.getDate());
      
      switch (namingConfigs.dateFormat) {
        case 'dateFormatFull': return `${yy}${mm}${dd}`;
        case 'dateFormatShort': return `${mm}${dd}`;
        case 'dateFormatMDY': return `${mm}${dd}${yy}`;
        case 'dateFormatDMY': return `${dd}${mm}${yy}`;
        case 'dateFormatYMD': return `${yy}${mm}${dd}`;
        default: return `${yy}${mm}${dd}`;
      }
    };

    const dateStr = getFormattedDate();
    const timeStr = `${pad(now.getHours())}${pad(now.getMinutes())}`;
    
    if (namingMode === 'system') {
      return `Md2Design_${dateStr}_${timeStr}_${namingConfigs.custom}_${index + 1}`;
    }

    const parts = namingParts.map(part => {
      switch (part) {
        case 'prefix': return namingConfigs.prefix;
        case 'date': return namingConfigs.includeTime ? `${dateStr}_${timeStr}` : dateStr;
        case 'custom': return namingConfigs.custom;
        case 'number': {
          let num = namingConfigs.numberOrder === 'asc' ? index : (total - 1 - index);
          if (!namingConfigs.zeroStart) num += 1;
          
          if (namingConfigs.numberType === 'chinese') {
            const chineseNums = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
            return num <= 10 ? chineseNums[num] : num.toString();
          }
          return num.toString();
        }
        default: return '';
      }
    });

    return parts.filter(Boolean).join('_');
  };

  const [progress, setProgress] = useState(0);  const [showSuccess, setShowSuccess] = useState(false);
  const [previewSize, setPreviewSize] = useState<{ single: string, total: string }>({ single: '-', total: '-' });

  // Calculate size estimation
  useEffect(() => {
    if (!showExport) return;
    
    const calculateSize = async () => {
      // Find first card for estimation
      const firstCard = document.querySelector('[id^="card-"]') as HTMLElement;
      if (!firstCard) return;

      try {
        setPreviewSize({ single: t.calculating, total: t.calculating });
        
        // Generate sample blob
        const options = { 
            pixelRatio: scale,
            filter: (node: HTMLElement) => !node.classList?.contains('export-ignore')
        };
        
        let blob;
        if (format === 'png') {
           const dataUrl = await toPng(firstCard, options);
           blob = await (await fetch(dataUrl)).blob();
        } else {
           const dataUrl = await toJpeg(firstCard, { ...options, quality: 0.9 });
           blob = await (await fetch(dataUrl)).blob();
        }

        const singleSize = blob.size / 1024 / 1024; // MB
        const cardCount = document.querySelectorAll('[id^="card-"]').length;
        const totalSize = singleSize * cardCount;

        setPreviewSize({ 
          single: `${singleSize.toFixed(2)} MB`, 
          total: `${totalSize.toFixed(2)} MB`
        });
      } catch (e) {
        console.error(e);
        setPreviewSize({ single: 'Error', total: 'Error' });
      }
    };

    const timer = setTimeout(calculateSize, 500); // Debounce
    return () => clearTimeout(timer);
  }, [showExport, format, scale, t.calculating]);

  const handleExport = async () => {
    setIsExporting(true);
    setIsExporting(true); // Redundant for clarity or just once is enough
    setProgress(0);
    try {
        const cards = Array.from(document.querySelectorAll('[id^="card-"]')) as HTMLElement[];
        const options = { 
            pixelRatio: scale,
            filter: (node: HTMLElement) => !node.classList?.contains('export-ignore')
        };
        
        let completed = 0;
        const total = cards.length;
        const updateProgress = () => {
            completed++;
            setProgress(Math.round((completed / total) * 100));
        };

        // Helper to generate blob
        const generateBlob = async (card: HTMLElement) => {
            // Pre-process images to Base64 to avoid html-to-image caching/cloning bugs
            // This is critical for fixing the "all images look like the first one" bug.
            const images = Array.from(card.querySelectorAll('img'));
            const originalSrcs = new Map<HTMLImageElement, string>();

            try {
                await Promise.all(images.map(async (img) => {
                    const src = img.src;
                    if (src.startsWith('data:')) return; // Already base64

                    try {
                        // Keep track to restore later
                        originalSrcs.set(img, src);
                        
                        // Fetch and convert
                        const response = await fetch(src);
                        const blob = await response.blob();
                        const base64 = await new Promise<string>((resolve) => {
                            const reader = new FileReader();
                            reader.onloadend = () => resolve(reader.result as string);
                            reader.readAsDataURL(blob);
                        });
                        
                        img.src = base64;
                    } catch (e) {
                        console.warn('Failed to inline image:', src, e);
                    }
                }));

                let dataUrl;
                const currentOptions = { 
                    ...options, 
                    useCORS: true,
                    skipAutoScale: true
                };

                if (format === 'png') {
                    dataUrl = await toPng(card, currentOptions);
                } else {
                    dataUrl = await toJpeg(card, { ...currentOptions, quality: 0.9 });
                }
                const res = await fetch(dataUrl);
                return await res.blob();
            } finally {
                // Restore original src to not break the DOM
                originalSrcs.forEach((src, img) => {
                    img.src = src;
                });
            }
        };

        if (exportMode === 'multiple') {
            const runZipExport = async () => {
                const zip = new JSZip();
                const chunkSize = 3;
                for (let i = 0; i < cards.length; i += chunkSize) {
                    const chunk = cards.slice(i, i + chunkSize);
                    await Promise.all(chunk.map(async (card, idx) => {
                        const globalIdx = i + idx;
                        const blob = await generateBlob(card);
                        zip.file(`${generateFileName(globalIdx, cards.length)}.${format}`, blob);
                        updateProgress();
                    }));
                }
                const content = await zip.generateAsync({ type: "blob" });
                saveAs(content, `${folderName || 'cards-export'}.zip`);
            };

            // Folder Export (File System Access API)
            if (exportTarget === 'folder' && 'showDirectoryPicker' in window) {
                try {
                    // @ts-expect-error - File System Access API
                    const dirHandle = await window.showDirectoryPicker();
                    let targetHandle = dirHandle;
                    if (folderName) {

                        targetHandle = await dirHandle.getDirectoryHandle(folderName, { create: true });
                    }

                    // Process with concurrency limit
                    const CONCURRENCY = 3;
                    const tasks = cards.map((card, i) => async () => {
                        const blob = await generateBlob(card);
                        const fileName = `${generateFileName(i, cards.length)}.${format}`;

                        const fileHandle = await targetHandle.getFileHandle(fileName, { create: true });

                        const writable = await fileHandle.createWritable();
                        await writable.write(blob);
                        await writable.close();
                        updateProgress();
                    });

                    // Run tasks
                    const running: Promise<void>[] = [];
                    for (const task of tasks) {
                        const p = task().then(() => {
                            running.splice(running.indexOf(p), 1);
                        });
                        running.push(p);
                        if (running.length >= CONCURRENCY) {
                            await Promise.race(running);
                        }
                    }
                    await Promise.all(running);
                } catch (err) {
                    if ((err as Error).name === 'AbortError') {
                        setIsExporting(false);
                        return;
                    }
                    
                    console.error('Directory picker failed, falling back to ZIP', err);
                    // Automatic fallback to ZIP on security error or other issues
                    await runZipExport();
                }
            } else {
                // Default to ZIP for 'zip' target or unsupported browsers
                await runZipExport();
            }
        } else {
            // Direct Download (Single Images)
            // Process sequentially with small delay to prevent browser blocking
            for (let i = 0; i < cards.length; i++) {
                const card = cards[i];
                const blob = await generateBlob(card);
                saveAs(blob, `${generateFileName(i, cards.length)}.${format}`);
                updateProgress();
                // Small delay to prevent browser from blocking multiple downloads
                await new Promise(resolve => setTimeout(resolve, 200));
            }
        }

        // Show success
        setShowExport(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);

    } catch (err) {
        console.error('Export failed', err);
    } finally {
        setIsExporting(false);
    }
  };

  const contactLinks = [
    {
      main: '公众号 LuN3cy的实验房',
      sub: '',
      url: 'https://mp.weixin.qq.com/s/sAIYq8gaezAumyIbGHiJ_w',
      color: 'hover:border-[#07C160] hover:bg-[#07C160]/10'
    },
    {
      main: '小红书 LuN3cy',
      sub: '',
      url: 'https://www.xiaohongshu.com/user/profile/61bbb882000000001000e80d',
      color: 'hover:border-[#FF2442] hover:bg-[#FF2442]/10'
    },
    {
      main: 'Bilibili LuN3cy',
      sub: '',
      url: 'https://b23.tv/i42oxgt',
      color: 'hover:border-[#00AEEC] hover:bg-[#00AEEC]/10'
    }
  ];

  return (
    <>
      <div className={`h-14 w-full flex items-center justify-between px-6 shrink-0 z-50 fixed top-0 left-0 transition-all duration-300 ${isScrolled ? 'glass-bar' : 'bg-transparent'}`}>
        <div className="flex items-center gap-4">
          <div className="font-bold text-lg tracking-tight flex items-center gap-2">
             <img src={logoSvg} alt="Logo" className="w-6 h-6" />
             <span className="opacity-90">{t.title}</span>
          </div>


          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowChangelog(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-white/80 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold transition-all relative group overflow-hidden"
            >
              {/* Outer soft glow (Diffuse) */}
              <motion.div 
                className="absolute inset-0 rounded-full bg-blue-500/20 blur-md -z-20 pointer-events-none"
                animate={{ 
                  opacity: [0.4, 0.8, 0.4],
                  scale: [1, 1.15, 1]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Inner precise glow (Border-like) */}
              <motion.div 
                className="absolute inset-0 rounded-full border border-blue-500/50 shadow-[0_0_8px_rgba(59,130,246,0.4)] -z-10 pointer-events-none"
                animate={{ 
                  opacity: [0.5, 1, 0.5],
                  boxShadow: [
                    "0 0 2px rgba(59,130,246,0.2)",
                    "0 0 10px rgba(59,130,246,0.5)",
                    "0 0 2px rgba(59,130,246,0.2)"
                  ]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              <div className="relative w-3 h-3 flex items-center justify-center">
                <Sparkles size={12} className="relative z-10 group-hover:scale-110 transition-transform" />
                <Sparkles 
                  size={12} 
                  className="absolute inset-0 text-blue-500 opacity-0 group-hover:opacity-100 group-hover:animate-ping" 
                />
              </div>
              <span className="relative z-10">{t.changelogTitle}</span>
            </button>

            <div className="relative flex items-center">
              <a
                href="https://dcnzkep5lste.feishu.cn/share/base/form/shrcn2yBpNQA0NpeZjZwt8NShJh"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-white/80 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 text-green-600 dark:text-green-400 rounded-full text-xs font-bold transition-all relative group"
              >
                {/* Outer soft glow (Diffuse) */}
                <motion.div 
                  className="absolute inset-0 rounded-full bg-green-500/20 blur-md -z-20 pointer-events-none"
                  animate={{ 
                    opacity: [0.4, 0.8, 0.4],
                    scale: [1, 1.15, 1]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                {/* Inner precise glow (Border-like) */}
                <motion.div 
                  className="absolute inset-0 rounded-full border border-green-500/50 shadow-[0_0_8px_rgba(34,197,94,0.4)] -z-10 pointer-events-none"
                  animate={{ 
                    opacity: [0.5, 1, 0.5],
                    boxShadow: [
                      "0 0 2px rgba(34,197,94,0.2)",
                      "0 0 10px rgba(34,197,94,0.5)",
                      "0 0 2px rgba(34,197,94,0.2)"
                    ]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                <MessageSquare size={12} className="relative z-10 group-hover:animate-bounce" />
                <span className="relative z-10">{t.feedback}</span>
              </a>

              {/* Onboarding Tooltip with Morphing Animation */}
              <AnimatePresence>
                {showOnboarding && (
                  <motion.div
                    initial={{ 
                      opacity: 0, 
                      scaleX: 0, 
                      scaleY: 0,
                      originX: 0,
                      x: 10,
                      borderRadius: "100px"
                    }}
                    animate={{ 
                      opacity: 1, 
                      scaleX: 1, 
                      scaleY: 1,
                      originX: 0,
                      x: 12,
                      borderRadius: "12px"
                    }}
                    exit={{ 
                      opacity: 0, 
                      scaleX: 0, 
                      scaleY: 0,
                      originX: 0,
                      x: 10,
                      borderRadius: "100px"
                    }}
                    transition={{ 
                      type: "spring",
                      stiffness: 260,
                      damping: 20
                    }}
                    className="absolute left-full whitespace-nowrap z-100"
                   >
                     <div className="bg-orange-400/85 dark:bg-orange-500/80 backdrop-blur-md text-white px-4 py-2 rounded-xl shadow-[0_10px_30px_-10px_rgba(251,146,60,0.5)] text-xs font-bold flex items-center gap-2 border border-white/20">
                         <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                         {t.onboardingTip}
                         <button 
                           onClick={closeOnboarding}
                           className="ml-2 p-1 hover:bg-white/20 rounded-full transition-colors"
                         >
                           <X size={12} className="text-white" />
                         </button>
                       </div>
                   </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Zoom Slider */}
          <div className="hidden lg:flex items-center gap-2 mr-2">
            <span className="text-xs font-mono opacity-70 w-8 text-right">
                {previewZoom > 0 ? `${Math.round(previewZoom * 100)}%` : 'Auto'}
            </span>
            <input
              id="preview-zoom-slider"
              name="previewZoom"
              aria-label={t.zoom}
              type="range"
              min="0.2"
              max="4"
              step="0.1"
              value={previewZoom || 1}
              onChange={(e) => setPreviewZoom(parseFloat(e.target.value))}
              className="w-24 accent-blue-500 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
             {previewZoom > 0 && (
               <button 
                 onClick={() => setPreviewZoom(0)}
                 className="ml-1 p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors text-blue-500"
                 title="Reset to Auto"
               >
                 <RotateCcw size={12} />
               </button>
             )}
          </div>

          <button
            onClick={() => setShowContact(true)}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-inherit opacity-80 hover:opacity-100"
            title={t.contactAuthor}
          >
            <Info size={18} />
          </button>

          <a
            href="https://github.com/LuN3cy/Md2Design"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-inherit opacity-80 hover:opacity-100"
          >
            <Github size={18} />
          </a>

          <button
            onClick={toggleLanguage}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-inherit opacity-80 hover:opacity-100"
          >
            <Languages size={18} />
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-inherit opacity-80 hover:opacity-100"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          <div className="h-6 w-px bg-black/20 dark:bg-white/20 mx-1" />

          <button 
             onClick={() => setShowExport(true)}
             className="flex items-center gap-2 px-4 py-1.5 bg-black text-white dark:bg-white dark:text-black rounded-full text-sm font-medium hover:opacity-90 transition-opacity shadow-lg"
          >
            <Download size={16} />
            {t.exportImage}
          </button>
        </div>
      </div>

      {/* Export Modal */}
      <ChangelogModal isOpen={showChangelog} onClose={() => setShowChangelog(false)} />
      
      <AnimatePresence>
        {showExport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowExport(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 p-6 rounded-2xl w-full max-w-sm shadow-2xl relative flex flex-col max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
               {/* Background Glow */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none z-0" />
               <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 blur-[60px] rounded-full pointer-events-none z-0" />

               <div className="relative z-10 flex flex-col h-full overflow-hidden">
                 <div className="flex items-center justify-between mb-6 shrink-0">
                   <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                     <Download size={20} className="text-blue-500 dark:text-blue-400" />
                     {t.exportSettings}
                   </h3>
                   <button 
                     onClick={() => setShowExport(false)}
                     className="p-1.5 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
                   >
                     <X size={20} />
                   </button>
                 </div>

                 <div className="space-y-6 flex-1 overflow-y-auto min-h-0 pr-2 -mr-2 custom-scrollbar">
                   {/* Format & Scale Row */}
                   <div className="grid grid-cols-2 gap-4">
                     <div>
                       <span id="format-label" className="text-xs font-medium text-slate-500 dark:text-white/50 mb-2 block uppercase tracking-wider">{t.format}</span>
                       <div role="group" aria-labelledby="format-label" className="flex p-1 bg-black/5 dark:bg-white/5 rounded-lg border border-black/5 dark:border-white/5">
                         {['png', 'jpg'].map((f) => (
                           <button
                             key={f}
                             onClick={() => setFormat(f as 'png' | 'jpg')}
                             className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all uppercase ${
                               format === f ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                             }`}
                           >
                             {f}
                           </button>
                         ))}
                       </div>
                     </div>
                     <div>
                       <span id="scale-label" className="text-xs font-medium text-slate-500 dark:text-white/50 mb-2 block uppercase tracking-wider">{t.scale}</span>
                       <div role="group" aria-labelledby="scale-label" className="flex p-1 bg-black/5 dark:bg-white/5 rounded-lg border border-black/5 dark:border-white/5">
                         {[1, 2, 3, 4].map((s) => (
                           <button
                             key={s}
                             onClick={() => setScale(s as 1 | 2 | 3 | 4)}
                             className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                               scale === s ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                             }`}
                           >
                             {s}x
                           </button>
                         ))}
                       </div>
                     </div>
                   </div>

                   {/* Export Mode */}
                   <div>
                     <span id="export-mode-label" className="text-xs font-medium text-slate-500 dark:text-white/50 mb-2 block uppercase tracking-wider">{t.exportMode}</span>
                     <div role="group" aria-labelledby="export-mode-label" className="flex flex-col gap-2">
                       {[
                         { value: 'multiple', label: t.multipleFiles, desc: 'Package multiple cards' },
                         { value: 'single', label: t.singleFile, desc: 'Download cards one by one' }
                       ].map((mode) => (
                         <button
                           key={mode.value}
                           onClick={() => setExportMode(mode.value as 'single' | 'multiple')}
                           className={`p-3 rounded-xl border transition-all text-left flex items-center justify-between group ${
                             exportMode === mode.value 
                               ? 'bg-blue-500/10 border-blue-500/50' 
                               : 'bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/5 hover:bg-black/10 dark:hover:bg-white/10 hover:border-black/10 dark:hover:border-white/10'
                           }`}
                         >
                           <div>
                             <div className={`text-sm font-medium ${exportMode === mode.value ? 'text-blue-500 dark:text-blue-400' : 'text-slate-700 dark:text-white/80'}`}>
                               {mode.label}
                             </div>
                             <div className="text-xs opacity-50 mt-0.5">{mode.desc}</div>
                           </div>
                           <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                             exportMode === mode.value ? 'border-blue-500' : 'border-black/20 dark:border-white/20 group-hover:border-black/40 dark:group-hover:border-white/40'
                           }`}>
                             {exportMode === mode.value && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                           </div>
                         </button>
                       ))}
                     </div>
                   </div>

                   {/* Export Target (Only for multiple mode) */}
                   {exportMode === 'multiple' && (
                     <div>
                       <span id="export-target-label" className="text-xs font-medium text-slate-500 dark:text-white/50 mb-2 block uppercase tracking-wider">{t.exportTarget}</span>
                       <div role="group" aria-labelledby="export-target-label" className="flex flex-col gap-2">
                         {[
                           { value: 'zip', label: t.targetZip, desc: 'Compatible with all folders' },
                           { value: 'folder', label: t.targetFolder, desc: 'Requires folder permission' }
                         ].map((target) => (
                           <button
                             key={target.value}
                             onClick={() => setExportTarget(target.value as 'zip' | 'folder')}
                             className={`p-3 rounded-xl border transition-all text-left flex items-center justify-between group ${
                               exportTarget === target.value 
                                 ? 'bg-blue-500/10 border-blue-500/50' 
                                 : 'bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/5 hover:bg-black/10 dark:hover:bg-white/10 hover:border-black/10 dark:hover:border-white/10'
                             }`}
                           >
                             <div>
                               <div className={`text-sm font-medium ${exportTarget === target.value ? 'text-blue-500 dark:text-blue-400' : 'text-slate-700 dark:text-white/80'}`}>
                                 {target.label}
                               </div>
                               <div className="text-xs opacity-50 mt-0.5">{target.desc}</div>
                             </div>
                             <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                               exportTarget === target.value ? 'border-blue-500' : 'border-black/20 dark:border-white/20 group-hover:border-black/40 dark:group-hover:border-white/40'
                             }`}>
                               {exportTarget === target.value && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                             </div>
                           </button>
                         ))}
                       </div>
                       {exportTarget === 'folder' && (
                         <p className="mt-2 text-[10px] text-amber-600 dark:text-amber-400/80 leading-relaxed px-1">
                           {t.systemFolderWarning}
                         </p>
                       )}
                     </div>
                   )}

                   {/* Folder Name (Only for multiple mode) */}
                   {exportMode === 'multiple' && (
                     <div>
                         <label htmlFor="export-folder-name" className="text-xs font-medium text-slate-500 dark:text-white/50 mb-2 block uppercase tracking-wider">{t.folderName}</label>
                         <input 
                           id="export-folder-name"
                           name="folderName"
                           type="text" 
                           value={folderName}
                           onChange={(e) => setFolderName(e.target.value)}
                           placeholder="cards-export"
                           className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-3 text-sm text-slate-900 dark:text-white placeholder-black/30 dark:placeholder-white/20 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                         />
                     </div>
                   )}

                   {/* File Name Customization */}
                   <div className="space-y-4">
                      <span className="text-xs font-medium text-slate-500 dark:text-white/50 mb-2 block uppercase tracking-wider">{t.fileNameCustom}</span>
                      
                      {/* Naming Mode Toggle */}
                      <div className="flex p-1 bg-black/5 dark:bg-white/5 rounded-lg border border-black/5 dark:border-white/5">
                        {[
                          { id: 'system', label: t.namingModeSystem },
                          { id: 'custom', label: t.namingModeCustom }
                        ].map((m) => (
                          <button
                            key={m.id}
                             onClick={() => setNamingMode(m.id as 'system' | 'custom')}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                              namingMode === m.id ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white'
                            }`}
                          >
                            {m.label}
                          </button>
                        ))}
                      </div>

                      {namingMode === 'system' ? (
                        <div className="space-y-3">
                          <label htmlFor="system-custom-name" className="sr-only">{t.namingCustom}</label>
                          <input 
                            id="system-custom-name"
                            name="systemCustomName"
                            type="text" 
                            value={namingConfigs.custom}
                            onChange={(e) => setNamingConfigs({ ...namingConfigs, custom: e.target.value })}
                            placeholder={t.namingCustom}
                            className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-3 text-sm text-slate-900 dark:text-white focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                          />
                          <div className="p-3 bg-black/5 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5">
                            <h3 className="text-[10px] uppercase tracking-wider text-black/40 dark:text-white/40 mb-1 block">{t.namingPreview}</h3>
                            <div className="text-xs font-mono text-slate-500 dark:text-white/60 truncate">
                              {generateFileName(0, 10)}.{format}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {/* Part Selectors (Multi-select) */}
                          <div className="flex flex-wrap gap-2">
                            {([
                              { id: 'prefix', label: t.namingPrefix },
                              { id: 'date', label: t.namingDate },
                              { id: 'custom', label: t.namingCustom },
                              { id: 'number', label: t.namingNumber }
                            ] as const).map((part) => (
                              <button
                                key={part.id}
                                onClick={() => {
                                  if (namingParts.includes(part.id)) {
                                    setNamingParts(namingParts.filter(p => p !== part.id));
                                  } else {
                                    setNamingParts([...namingParts, part.id]);
                                  }
                                }}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                                  namingParts.includes(part.id)
                                    ? 'bg-blue-500 border-blue-500 text-white shadow-md'
                                    : 'bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/5 text-black/40 dark:text-white/40'
                                }`}
                              >
                                {part.label}
                                {namingParts.includes(part.id) && (
                                  <span className="ml-1.5 opacity-60">{namingParts.indexOf(part.id) + 1}</span>
                                )}
                              </button>
                            ))}
                          </div>

                          {/* Dynamic Content Boxes */}
                          <div className="space-y-3">
                            {namingParts.map((part) => (
                              <motion.div 
                                key={part}
                                layout
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-3 bg-black/5 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5 space-y-3"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500/60">{t[`naming${part.charAt(0).toUpperCase() + part.slice(1)}` as keyof typeof t]}</span>
                                  <div className="flex gap-1">
                                    <button 
                                      onClick={() => {
                                        const idx = namingParts.indexOf(part);
                                        if (idx > 0) {
                                          const newParts = [...namingParts];
                                          [newParts[idx], newParts[idx-1]] = [newParts[idx-1], newParts[idx]];
                                          setNamingParts(newParts);
                                        }
                                      }}
                                      className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded"
                                    >
                                      <ChevronDown size={12} className="rotate-180 opacity-40" />
                                    </button>
                                    <button 
                                      onClick={() => {
                                        const idx = namingParts.indexOf(part);
                                        if (idx < namingParts.length - 1) {
                                          const newParts = [...namingParts];
                                          [newParts[idx], newParts[idx+1]] = [newParts[idx+1], newParts[idx]];
                                          setNamingParts(newParts);
                                        }
                                      }}
                                      className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded"
                                    >
                                      <ChevronDown size={12} className="opacity-40" />
                                    </button>
                                  </div>
                                </div>

                                {part === 'prefix' && (
                                  <input 
                                    id="naming-prefix-input"
                                    name="namingPrefix"
                                    aria-label={t.namingPrefix}
                                    type="text" 
                                    value={namingConfigs.prefix}
                                    onChange={(e) => setNamingConfigs({ ...namingConfigs, prefix: e.target.value })}
                                    className="w-full bg-white/50 dark:bg-black/20 border border-black/5 dark:border-white/5 rounded-lg p-2 text-xs focus:outline-none focus:border-blue-500/30"
                                  />
                                )}
                                {part === 'custom' && (
                                  <input 
                                    id="naming-custom-input"
                                    name="namingCustom"
                                    aria-label={t.namingCustom}
                                    type="text" 
                                    value={namingConfigs.custom}
                                    onChange={(e) => setNamingConfigs({ ...namingConfigs, custom: e.target.value })}
                                    className="w-full bg-white/50 dark:bg-black/20 border border-black/5 dark:border-white/5 rounded-lg p-2 text-xs focus:outline-none focus:border-blue-500/30"
                                  />
                                )}
                                {part === 'date' && (
                                  <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs text-slate-500 dark:text-white/40">{t.namingIncludeTime}</span>
                                      <button 
                                        onClick={() => setNamingConfigs({ ...namingConfigs, includeTime: !namingConfigs.includeTime })}
                                        className={`w-8 h-4 rounded-full transition-colors relative ${namingConfigs.includeTime ? 'bg-blue-500' : 'bg-black/20 dark:bg-white/20'}`}
                                      >
                                        <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${namingConfigs.includeTime ? 'right-0.5' : 'left-0.5'}`} />
                                      </button>
                                    </div>
                                    <CustomDropdown
                                      value={namingConfigs.dateFormat}
                                      options={[
                                        { id: 'dateFormatFull', label: t.dateFormatFull },
                                        { id: 'dateFormatShort', label: t.dateFormatShort },
                                        { id: 'dateFormatMDY', label: t.dateFormatMDY },
                                        { id: 'dateFormatDMY', label: t.dateFormatDMY },
                                        { id: 'dateFormatYMD', label: t.dateFormatYMD }
                                      ]}
                                      onChange={(val) => setNamingConfigs({ ...namingConfigs, dateFormat: val })}
                                    />
                                  </div>
                                )}
                                {part === 'number' && (
                                  <div className="space-y-3">
                                    <div className="flex items-center justify-between gap-2">
                                      <CustomDropdown
                                        className="flex-1"
                                        value={namingConfigs.numberType}
                                        options={[
                                          { id: 'arabic', label: t.namingArabic },
                                          { id: 'chinese', label: t.namingChinese }
                                        ]}
                                        onChange={(val) => setNamingConfigs({ ...namingConfigs, numberType: val })}
                                      />
                                      <CustomDropdown
                                        className="flex-1"
                                        value={namingConfigs.numberOrder}
                                        options={[
                                          { id: 'asc', label: t.namingOrderAsc },
                                          { id: 'desc', label: t.namingOrderDesc }
                                        ]}
                                        onChange={(val) => setNamingConfigs({ ...namingConfigs, numberOrder: val })}
                                      />
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs text-slate-500 dark:text-white/40">{t.namingZeroStart}</span>
                                      <button 
                                        onClick={() => setNamingConfigs({ ...namingConfigs, zeroStart: !namingConfigs.zeroStart })}
                                        className={`w-8 h-4 rounded-full transition-colors relative ${namingConfigs.zeroStart ? 'bg-blue-500' : 'bg-black/20 dark:bg-white/20'}`}
                                      >
                                        <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${namingConfigs.zeroStart ? 'right-0.5' : 'left-0.5'}`} />
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </motion.div>
                            ))}
                          </div>

                          {/* Preview for Number Order */}
                          <div className="p-3 bg-black/5 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5">
                            <h3 className="text-[10px] uppercase tracking-wider text-black/40 dark:text-white/40 mb-1 block">{t.namingPreview}</h3>
                            <div className="space-y-1 font-mono text-[10px] text-slate-500 dark:text-white/60">
                              {namingParts.includes('number') ? (
                                <>
                                  <div className="truncate">{generateFileName(0, 5)}.{format}</div>
                                  <div className="opacity-40">...</div>
                                  <div className="truncate">{generateFileName(4, 5)}.{format}</div>
                                </>
                              ) : (
                                <div className="truncate">{generateFileName(0, 1)}.{format}</div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                   </div>

                   </div>

                   {/* Footer Section */}
                   <div className="mt-6 space-y-4 shrink-0 z-10">
                     {/* Info Stats */}
                     <div className="flex items-center justify-between p-3 bg-black/5 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wider text-black/40 dark:text-white/40">Single Size</span>
                        <span className="text-sm font-mono text-slate-700 dark:text-white/80">{previewSize.single}</span>
                      </div>
                      <div className="w-px h-8 bg-black/10 dark:bg-white/10" />
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] uppercase tracking-wider text-black/40 dark:text-white/40">{t.total} Size</span>
                        <span className="text-sm font-mono text-blue-500 dark:text-blue-400">{previewSize.total}</span>
                      </div>
                   </div>

                   {/* Action Button */}
                   <div className="space-y-3">
                     {isExporting && (
                       <div className="w-full bg-black/5 dark:bg-white/5 rounded-full h-1.5 overflow-hidden">
                         <motion.div 
                           className="h-full bg-blue-500 rounded-full"
                           initial={{ width: 0 }}
                           animate={{ width: `${progress}%` }}
                           transition={{ duration: 0.2 }}
                         />
                       </div>
                     )}
                     
                     <button
                       onClick={handleExport}
                       disabled={isExporting}
                       className="w-full py-3.5 bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl text-sm font-bold shadow-xl shadow-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform active:scale-[0.98]"
                     >
                       {isExporting ? (
                         <>
                           <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                           {t.calculating} ({progress}%)
                         </>
                       ) : (
                         <>
                           {t.exportBtn}
                           <ChevronDown size={16} className="-rotate-90 opacity-60" />
                         </>
                       )}
                     </button>
                   </div>
                   </div>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-70 flex items-center justify-center pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: 20, opacity: 0 }}
              className="bg-white dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 pointer-events-auto"
            >
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                <Check size={20} strokeWidth={3} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{t.exportSuccess}</h3>
                <p className="text-xs text-slate-500 dark:text-white/60">{t.exportSuccessMsg}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showContact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowContact(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white/90 dark:bg-black/90 backdrop-blur-xl border border-black/20 dark:border-white/20 p-6 rounded-2xl w-full max-w-md shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">{t.contactAuthor}</h3>
                <button 
                  onClick={() => setShowContact(false)}
                  className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-3">
                {contactLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block p-4 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl transition-all hover:scale-[1.02] ${link.color}`}
                  >
                    <div className="font-bold mb-1">{link.main}</div>
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
