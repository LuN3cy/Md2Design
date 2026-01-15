import { useState, useEffect } from 'react';
import { toPng, toJpeg } from 'html-to-image';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useTranslation } from '../i18n';
import { useStore } from '../store';

interface ExportOptions {
    format: 'png' | 'jpeg';
    scale: number;
    exportMode: 'single' | 'multiple';
    exportTarget: 'zip' | 'folder' | 'direct';
    folderName: string;
}

export const useExport = (options: ExportOptions) => {
    const { format, scale, exportMode, exportTarget, folderName } = options;
    const t = useTranslation();
    const [isExporting, setIsExporting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);
    const [previewSize, setPreviewSize] = useState<{ single: string, total: string }>({ single: '-', total: '-' });

    const namingMode = useStore((state) => state.namingMode);
    const namingParts = useStore((state) => state.namingParts);
    const namingConfigs = useStore((state) => state.namingConfigs);

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
          return `Md2Design_${dateStr}_${timeStr}_${namingConfigs.custom}_${index+1}`;
        }

        const parts = namingParts.map((part: string) => {
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
              return (namingConfigs.zeroStart ? num.toString().padStart(2, '0') : num.toString());
            }
            default: return '';
          }
        });

        return parts.filter(Boolean).join('_');
    };

    // Calculate size estimation
    useEffect(() => {
        const calculateSize = async () => {
            const firstCard = document.querySelector('[id^="card-"]') as HTMLElement;
            if (!firstCard) return;

            try {
                setPreviewSize({ single: t.calculating, total: t.calculating });
                
                const exportOptions = { 
                    pixelRatio: scale,
                    filter: (node: HTMLElement) => !node.classList?.contains('export-ignore')
                };
                
                let blob;
                if (format === 'png') {
                    const dataUrl = await toPng(firstCard, exportOptions);
                    blob = await (await fetch(dataUrl)).blob();
                } else {
                    const dataUrl = await toJpeg(firstCard, { ...exportOptions, quality: 0.9 });
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

        const timer = setTimeout(calculateSize, 500);
        return () => clearTimeout(timer);
    }, [format, scale, t.calculating]);

    const handleExport = async () => {
        setIsExporting(true);
        setProgress(0);
        try {
            const cards = Array.from(document.querySelectorAll('[id^="card-"]')) as HTMLElement[];
            const exportOptions = { 
                pixelRatio: scale,
                filter: (node: HTMLElement) => !node.classList?.contains('export-ignore')
            };
            
            let completed = 0;
            const total = cards.length;
            const updateProgress = () => {
                completed++;
                setProgress(Math.round((completed / total) * 100));
            };

            const generateBlob = async (card: HTMLElement) => {
                const images = Array.from(card.querySelectorAll('img'));
                const originalSrcs = new Map<HTMLImageElement, string>();

                try {
                    await Promise.all(images.map(async (img) => {
                        const src = img.src;
                        if (src.startsWith('data:')) return;

                        try {
                            originalSrcs.set(img, src);
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
                        ...exportOptions, 
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

                if (exportTarget === 'folder' && 'showDirectoryPicker' in window) {
                    try {
                        // @ts-expect-error - File System Access API
                        const dirHandle = await window.showDirectoryPicker();
                        let targetHandle = dirHandle;
                        if (folderName) {
                            targetHandle = await dirHandle.getDirectoryHandle(folderName, { create: true });
                        }

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
                        await runZipExport();
                    }
                } else {
                    await runZipExport();
                }
            } else {
                for (let i = 0; i < cards.length; i++) {
                    const card = cards[i];
                    const blob = await generateBlob(card);
                    saveAs(blob, `${generateFileName(i, cards.length)}.${format}`);
                    updateProgress();
                    await new Promise(resolve => setTimeout(resolve, 200));
                }
            }

            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (err) {
            console.error('Export failed', err);
        } finally {
            setIsExporting(false);
        }
    };

    return {
        isExporting,
        progress,
        showSuccess,
        previewSize,
        handleExport
    };
};
