import { useState, useEffect } from 'react';
import { useStore } from '../store';
import { useTranslation } from '../i18n';
import { Moon, Sun, Download, Languages, Info, X, ChevronDown } from 'lucide-react';
import { toPng, toJpeg } from 'html-to-image';
import { motion, AnimatePresence } from 'framer-motion';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

import { Github } from 'lucide-react';

export const TopBar = () => {
  const { theme, toggleTheme, toggleLanguage, isScrolled } = useStore();
  const t = useTranslation();
  const [showContact, setShowContact] = useState(false);
  const [showExport, setShowExport] = useState(false);

  // Export Settings
  const [format, setFormat] = useState<'png' | 'jpg'>('png');
  const [scale, setScale] = useState<1 | 2 | 3 | 4>(2);
  const [exportMode, setExportMode] = useState<'single' | 'multiple'>('multiple');
  const [fileNamePrefix, setFileNamePrefix] = useState('card');
  const [folderName, setFolderName] = useState('cards-export'); // New Folder Name state
  const [isExporting, setIsExporting] = useState(false);
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
            filter: (node: any) => !node.classList?.contains('export-ignore')
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
    try {
        const cards = Array.from(document.querySelectorAll('[id^="card-"]')) as HTMLElement[];
        const options = { 
            pixelRatio: scale,
            filter: (node: any) => !node.classList?.contains('export-ignore')
        };

        if (exportMode === 'multiple') {
            // Check for File System Access API support
            if ('showDirectoryPicker' in window) {
                try {
                    // @ts-ignore - TS might not know about showDirectoryPicker yet
                    const dirHandle = await window.showDirectoryPicker();
                    
                    // Create sub-directory if user provided a name
                    let targetHandle = dirHandle;
                    if (folderName) {
                        // @ts-ignore
                        targetHandle = await dirHandle.getDirectoryHandle(folderName, { create: true });
                    }
                    
                    for (let i = 0; i < cards.length; i++) {
                        const card = cards[i];
                        let dataUrl;
                        if (format === 'png') {
                            dataUrl = await toPng(card, options);
                        } else {
                            dataUrl = await toJpeg(card, { ...options, quality: 0.9 });
                        }
                        
                        // Convert DataURL to Blob
                        const res = await fetch(dataUrl);
                        const blob = await res.blob();
                        
                        // Create file in directory
                        const fileName = `${fileNamePrefix}-${i + 1}.${format}`;
                        // @ts-ignore
                        const fileHandle = await targetHandle.getFileHandle(fileName, { create: true });
                        // @ts-ignore
                        const writable = await fileHandle.createWritable();
                        await writable.write(blob);
                        await writable.close();
                    }
                    // Success!
                } catch (err) {
                    // User cancelled or error, fallback to ZIP?
                    // Actually if user cancelled picking directory, we should probably stop.
                    // But if it's an error, maybe fallback.
                    // For now, let's just log and maybe fallback if it wasn't a cancellation.
                    if ((err as Error).name !== 'AbortError') {
                        console.error('Directory picker failed, falling back to ZIP', err);
                        // Fallback logic (ZIP)
                        const zip = new JSZip();
                        for (let i = 0; i < cards.length; i++) {
                            const card = cards[i];
                            let dataUrl;
                            if (format === 'png') {
                                dataUrl = await toPng(card, options);
                            } else {
                                dataUrl = await toJpeg(card, { ...options, quality: 0.9 });
                            }
                            const base64Data = dataUrl.split(',')[1];
                            zip.file(`${fileNamePrefix}-${i + 1}.${format}`, base64Data, { base64: true });
                        }
                        const content = await zip.generateAsync({ type: "blob" });
                        saveAs(content, `${fileNamePrefix}-cards.zip`);
                    }
                }
            } else {
                // Fallback for browsers without File System Access API
                const zip = new JSZip();
                
                for (let i = 0; i < cards.length; i++) {
                    const card = cards[i];
                    let dataUrl;
                    if (format === 'png') {
                        dataUrl = await toPng(card, options);
                    } else {
                        dataUrl = await toJpeg(card, { ...options, quality: 0.9 });
                    }
                    
                    // Remove prefix from data URL
                    const base64Data = dataUrl.split(',')[1];
                    zip.file(`${fileNamePrefix}-${i + 1}.${format}`, base64Data, { base64: true });
                }
                
                const content = await zip.generateAsync({ type: "blob" });
                saveAs(content, `${fileNamePrefix}-cards.zip`);
            }
            
        } else {
            // Single File (Continuous)
            // Create a canvas to stitch images
            // We need to generate all images first to know dimensions
            const images = await Promise.all(cards.map(async (card) => {
                const dataUrl = await toPng(card, options);
                const img = new Image();
                img.src = dataUrl;
                await new Promise(resolve => img.onload = resolve);
                return img;
            }));

            if (images.length === 0) return;

            const totalHeight = images.reduce((acc, img) => acc + img.height, 0);
            const maxWidth = Math.max(...images.map(img => img.width));
            
            const canvas = document.createElement('canvas');
            canvas.width = maxWidth;
            canvas.height = totalHeight;
            const ctx = canvas.getContext('2d');
            
            if (ctx) {
                // Fill background if JPG
                if (format === 'jpg') {
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }

                let currentY = 0;
                images.forEach(img => {
                    // Center image if smaller than max width
                    const x = (maxWidth - img.width) / 2;
                    ctx.drawImage(img, x, currentY);
                    currentY += img.height;
                });
                
                canvas.toBlob((blob) => {
                    if (blob) saveAs(blob, `${fileNamePrefix}-continuous.${format}`);
                }, format === 'png' ? 'image/png' : 'image/jpeg', 0.9);
            }
        }
    } catch (err) {
        console.error('Export failed', err);
    } finally {
        setIsExporting(false);
        setShowExport(false);
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
             <span className="opacity-90">{t.title}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
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
      <AnimatePresence>
        {showExport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowExport(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 p-6 rounded-2xl w-full max-w-sm shadow-2xl relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
               {/* Background Glow */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none -z-0" />
               <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 blur-[60px] rounded-full pointer-events-none -z-0" />

               <div className="relative z-10">
                 <div className="flex items-center justify-between mb-6">
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

                 <div className="space-y-6">
                   {/* Format & Scale Row */}
                   <div className="grid grid-cols-2 gap-4">
                     <div>
                       <label className="text-xs font-medium text-slate-500 dark:text-white/50 mb-2 block uppercase tracking-wider">{t.format}</label>
                       <div className="flex p-1 bg-black/5 dark:bg-white/5 rounded-lg border border-black/5 dark:border-white/5">
                         {['png', 'jpg'].map((f) => (
                           <button
                             key={f}
                             onClick={() => setFormat(f as any)}
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
                       <label className="text-xs font-medium text-slate-500 dark:text-white/50 mb-2 block uppercase tracking-wider">{t.scale}</label>
                       <div className="flex p-1 bg-black/5 dark:bg-white/5 rounded-lg border border-black/5 dark:border-white/5">
                         {[1, 2, 3, 4].map((s) => (
                           <button
                             key={s}
                             onClick={() => setScale(s as any)}
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
                     <label className="text-xs font-medium text-slate-500 dark:text-white/50 mb-2 block uppercase tracking-wider">{t.exportMode}</label>
                     <div className="flex flex-col gap-2">
                       {[
                         { value: 'multiple', label: t.multipleFiles, desc: 'Folder with separate images' },
                         { value: 'single', label: t.singleFile, desc: 'All cards stitched vertically' }
                       ].map((mode) => (
                         <button
                           key={mode.value}
                           onClick={() => setExportMode(mode.value as any)}
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

                   {/* Folder Name (Only for multiple mode) */}
                   {exportMode === 'multiple' && (
                     <div>
                        <label className="text-xs font-medium text-slate-500 dark:text-white/50 mb-2 block uppercase tracking-wider">Folder Name</label>
                        <input 
                          type="text" 
                          value={folderName}
                          onChange={(e) => setFolderName(e.target.value)}
                          placeholder="cards-export"
                          className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-3 text-sm text-slate-900 dark:text-white placeholder-black/30 dark:placeholder-white/20 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                        />
                     </div>
                   )}

                   {/* File Name Prefix */}
                   <div>
                      <label className="text-xs font-medium text-slate-500 dark:text-white/50 mb-2 block uppercase tracking-wider">{t.fileNamePrefix}</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          value={fileNamePrefix}
                          onChange={(e) => setFileNamePrefix(e.target.value)}
                          className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-3 text-sm text-slate-900 dark:text-white placeholder-black/30 dark:placeholder-white/20 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-black/30 dark:text-white/30 pointer-events-none">
                          {exportMode === 'multiple' ? '-N' : '-continuous'}.{format}
                        </div>
                      </div>
                   </div>

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
                   <button
                     onClick={handleExport}
                     disabled={isExporting}
                     className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl text-sm font-bold shadow-xl shadow-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform active:scale-[0.98]"
                   >
                     {isExporting ? (
                       <>
                         <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                         {t.calculating}
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
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
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
