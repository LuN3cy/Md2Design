import { useState, useRef, useEffect } from 'react';
import { useStore } from '../store';
import { useTranslation } from '../i18n';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Edit3, Bold, Italic, List, Quote, Heading1, Heading2, Link, Image as ImageIcon, Check, Strikethrough, Type } from 'lucide-react';
import { htmlToMarkdown } from '../utils/turndown';
import { paginateMarkdown } from '../utils/pagination';
import { marked } from 'marked';

export const Editor = () => {
  const { markdown, setMarkdown, addCardImage, cardStyle, isEditorOpen, setIsEditorOpen } = useStore();
  const t = useTranslation();
  const [showPaginationToast, setShowPaginationToast] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const prevAutoHeightRef = useRef(cardStyle.autoHeight);

  // Auto-paginate when switching from auto-height to fixed-height mode
  useEffect(() => {
    if (prevAutoHeightRef.current && !cardStyle.autoHeight && markdown.length > 500) {
      const paginated = paginateMarkdown(markdown, cardStyle);
      if (paginated !== markdown) {
        setMarkdown(paginated);
        setShowPaginationToast(true);
        setTimeout(() => setShowPaginationToast(false), 4000);
      }
    }
    prevAutoHeightRef.current = cardStyle.autoHeight;
  }, [cardStyle.autoHeight, markdown, cardStyle, setMarkdown]);

  const insertText = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdown.substring(start, end);
    const newText = markdown.substring(0, start) + before + selectedText + after + markdown.substring(end);
    
    setMarkdown(newText);
    
    // Restore focus and selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const toggleInlineStyle = (marker: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = markdown.substring(start, end);
    
    const escapedMarker = marker.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    let regex;
    if (marker === '**') {
      regex = new RegExp(`^\\*\\*(.*)\\*\\*$`, 's');
    } else if (marker === '*') {
      regex = new RegExp(`^\\*(?!\\*)(.*)(?<!\\*)\\*$`, 's');
    } else {
      regex = new RegExp(`^${escapedMarker}(.*)${escapedMarker}$`, 's');
    }
    
    // 1. Check if selection itself is wrapped
    if (regex.test(selected)) {
        const clean = selected.replace(regex, '$1');
        const newText = markdown.substring(0, start) + clean + markdown.substring(end);
        setMarkdown(newText);
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start, start + clean.length);
        }, 0);
        return;
    }

    // 2. Check if text around selection is wrapped
    const before = markdown.substring(start - marker.length, start);
    const after = markdown.substring(end, end + marker.length);
    
    // Special handling for * vs **
    let isWrapped = before === marker && after === marker;
    if (isWrapped && marker === '*') {
      // If marker is *, ensure it's not actually part of **
      const beforeBefore = markdown.substring(start - marker.length - 1, start - marker.length);
      const afterAfter = markdown.substring(end + marker.length, end + marker.length + 1);
      if (beforeBefore === '*' || afterAfter === '*') {
        isWrapped = false;
      }
    }

    if (isWrapped) {
        const newText = markdown.substring(0, start - marker.length) + selected + markdown.substring(end + marker.length);
        setMarkdown(newText);
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start - marker.length, end - marker.length);
        }, 0);
    } else {
        const newText = markdown.substring(0, start) + marker + selected + marker + markdown.substring(end);
        setMarkdown(newText);
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + marker.length, end + marker.length);
        }, 0);
    }
  };

  const toggleBlockStyle = (marker: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    // Find line start/end
    let lineStart = markdown.lastIndexOf('\n', start - 1) + 1;
    let lineEnd = markdown.indexOf('\n', end);
    if (lineEnd === -1) lineEnd = markdown.length;
    
    const blockContent = markdown.substring(lineStart, lineEnd);
    const lines = blockContent.split('\n');
    const markerWithSpace = marker + ' ';
    
    // Determine if we should add or remove
    // If all lines already start with the marker, we remove it
    // Otherwise, we add it to lines that don't have it
    const allHaveMarker = lines.every(line => line.trim() === '' || line.startsWith(markerWithSpace));
    
    let newLines: string[];
 
    if (allHaveMarker) {
      // Remove marker from all lines that have it
      newLines = lines.map((line) => {
        if (line.startsWith(markerWithSpace)) {
          return line.substring(markerWithSpace.length);
        }
        return line;
      });
    } else {
      // Add marker to all lines
      newLines = lines.map((line) => {
        return markerWithSpace + line;
      });
    }

    const newBlockContent = newLines.join('\n');
    const newText = markdown.substring(0, lineStart) + newBlockContent + markdown.substring(lineEnd);
    
    setMarkdown(newText);
    
    // Calculate new selection
    setTimeout(() => {
      textarea.focus();
      
      // Re-calculate start and end based on how many markers were added/removed before them
      let newStart = start;
      let newEnd = end;
      
      if (allHaveMarker) {
        // Removing
        lines.forEach((line, idx) => {
          const lineAbsoluteStart = lineStart + lines.slice(0, idx).join('\n').length + (idx > 0 ? 1 : 0);
          if (lineAbsoluteStart < start && line.startsWith(markerWithSpace)) {
            newStart -= markerWithSpace.length;
          }
          if (lineAbsoluteStart < end && line.startsWith(markerWithSpace)) {
            newEnd -= markerWithSpace.length;
          }
        });
      } else {
        // Adding
        lines.forEach((_, idx) => {
          const lineAbsoluteStart = lineStart + lines.slice(0, idx).join('\n').length + (idx > 0 ? 1 : 0);
          if (lineAbsoluteStart <= start) {
            newStart += markerWithSpace.length;
          }
          if (lineAbsoluteStart <= end) {
            newEnd += markerWithSpace.length;
          }
        });
      }
      
      textarea.setSelectionRange(newStart, newEnd);
    }, 0);
  };

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const imageUrl = e.target.result as string;
        
        const textarea = textareaRef.current;
        // Capture insertion point - default to end if no selection
        const startPos = textarea ? textarea.selectionStart : markdown.length;
        const textBefore = markdown.substring(0, startPos);
        const separators = textBefore.match(/\n\s*---\s*\n|^\s*---\s*$/gm);
        const targetCardIndex = separators ? separators.length : 0;
        const spacerId = Math.random().toString(36).substring(2, 9);

        // Add to store (this will create the floating image)
        addCardImage(targetCardIndex, imageUrl, undefined, spacerId);
        
        const endPos = textarea ? textarea.selectionEnd : markdown.length;
        const spacerMarkdown = `\n![spacer](spacer?id=${spacerId})\n`;
        const newText = markdown.substring(0, startPos) + spacerMarkdown + markdown.substring(endPos);
        setMarkdown(newText);
        
        setTimeout(() => {
          if (textarea) {
            textarea.focus();
            const newCursorPos = startPos + spacerMarkdown.length;
            textarea.setSelectionRange(newCursorPos, newCursorPos);
          }
        }, 0);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    let handled = false;

    // 1. Handle Images
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault();
        const file = items[i].getAsFile();
        if (file) handleImageUpload(file);
        return;
      }
    }

      const htmlData = e.clipboardData.getData('text/html');
    const plainText = e.clipboardData.getData('text/plain');

    if (htmlData && htmlData.trim().length > 0) {
      try {
        const convertedMd = htmlToMarkdown(htmlData);
        
        // If conversion result is valid and not empty
        if (convertedMd && convertedMd.trim().length > 0) {
             e.preventDefault();
             insertText(convertedMd);
             handled = true;
             
             // Check for pagination
             const textarea = textareaRef.current;
             const start = textarea?.selectionStart ?? 0;
             const end = textarea?.selectionEnd ?? 0;
             const newFullText = markdown.substring(0, start) + convertedMd + markdown.substring(end);
             
             // Auto-paginate if content is long
             if (!cardStyle.autoHeight && newFullText.length > 500) {
                 const paginated = paginateMarkdown(newFullText, cardStyle);
                 if (paginated !== newFullText) {
                     setMarkdown(paginated);
                     setShowPaginationToast(true);
                     setTimeout(() => setShowPaginationToast(false), 4000);
                 } else {
                     setMarkdown(newFullText);
                 }
             } else {
                 setMarkdown(newFullText);
             }
             return;
        }
      } catch (err) {
        console.error("Failed to convert HTML to Markdown", err);
      }
    }

    // 3. Handle Plain Text (if HTML failed or wasn't present)
    // Also apply pagination check for long plain text
    if (!handled && plainText) {
        // If user pastes a local image file path string? No, browser handles files separately.
        // Just standard text.
        
        // If it's a very short text, just let default behavior happen (it's faster/native)
        // BUT we need to update state.
        // Actually, for consistency and pagination check, let's handle it manually.
        e.preventDefault();
        insertText(plainText);
        
        const textarea = textareaRef.current;
        const start = textarea?.selectionStart ?? 0;
        const end = textarea?.selectionEnd ?? 0;
        const newFullText = markdown.substring(0, start) + plainText + markdown.substring(end);
        
        if (!cardStyle.autoHeight && newFullText.length > 500) {
            const paginated = paginateMarkdown(newFullText, cardStyle);
            if (paginated !== newFullText) {
                setMarkdown(paginated);
                setShowPaginationToast(true);
                setTimeout(() => setShowPaginationToast(false), 4000);
            } else {
                setMarkdown(newFullText);
            }
        } else {
             setMarkdown(newFullText);
        }
    }
  };

  

  return (
    <>
      <AnimatePresence mode="wait">
        {isEditorOpen ? (
          <motion.div
            initial={{ x: -400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -400, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute left-6 top-20 bottom-6 w-[400px] glass-panel rounded-2xl flex flex-col z-40 overflow-hidden select-text"
          >
            <div className="flex items-center justify-between p-4 border-b border-black/10 dark:border-white/10">
              <div className="flex items-center gap-2 text-sm font-semibold opacity-80">
                <Edit3 size={16} />
                <span>{t.editor}</span>
              </div>
              <button 
                onClick={() => setIsEditorOpen(false)}
                className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
            </div>

            {/* Toolbar */}
            {/* Hidden File Input for Image Upload */}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file);
                // Reset input value to allow selecting same file again
                e.target.value = '';
              }}
            />

            <div className="flex items-center gap-0.5 p-2 border-b border-black/10 dark:border-white/10 overflow-x-auto no-scrollbar">
                <button onMouseDown={(e) => { e.preventDefault(); toggleInlineStyle('**'); }} title="Bold" className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-md transition-colors opacity-70 hover:opacity-100 flex-shrink-0">
                  <Bold size={16} />
                </button>
                <button onMouseDown={(e) => { e.preventDefault(); toggleInlineStyle('*'); }} title="Italic" className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-md transition-colors opacity-70 hover:opacity-100 flex-shrink-0">
                  <Italic size={16} />
                </button>
                <button onMouseDown={(e) => { e.preventDefault(); toggleInlineStyle('~~'); }} title="Strikethrough" className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-md transition-colors opacity-70 hover:opacity-100 flex-shrink-0">
                  <Strikethrough size={16} />
                </button>
                <button onMouseDown={(e) => { e.preventDefault(); toggleBlockStyle('#'); }} title="H1" className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-md transition-colors opacity-70 hover:opacity-100 flex-shrink-0">
                  <Heading1 size={16} />
                </button>
                <button onMouseDown={(e) => { e.preventDefault(); toggleBlockStyle('##'); }} title="H2" className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-md transition-colors opacity-70 hover:opacity-100 flex-shrink-0">
                  <Heading2 size={16} />
                </button>
                <button onMouseDown={(e) => { e.preventDefault(); toggleBlockStyle('-'); }} title="List" className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-md transition-colors opacity-70 hover:opacity-100 flex-shrink-0">
                  <List size={16} />
                </button>
                <button onMouseDown={(e) => { e.preventDefault(); toggleBlockStyle('>'); }} title="Quote" className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-md transition-colors opacity-70 hover:opacity-100 flex-shrink-0">
                  <Quote size={16} />
                </button>
                <button onMouseDown={(e) => { e.preventDefault(); insertText('[', '](url)'); }} title="Link" className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-md transition-colors opacity-70 hover:opacity-100 flex-shrink-0">
                  <Link size={16} />
                </button>
                <button
                  onMouseDown={(e) => { e.preventDefault(); fileInputRef.current?.click(); }}
                  title="Image"
                  className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-md transition-colors opacity-70 hover:opacity-100 flex-shrink-0"
                >
                  <ImageIcon size={16} />
                </button>
                <div className="w-[1px] h-4 bg-black/10 dark:bg-white/10 mx-1 flex-shrink-0" />
                <button
                  onClick={() => {
                     // If in auto-height mode, switch to portrait first to enable pagination
                     if (cardStyle.autoHeight) {
                         useStore.getState().updateCardStyle({ autoHeight: false, orientation: 'portrait' });
                     }
                     
                     // Wait for state to update (using setTimeout for simple sync)
                     setTimeout(() => {
                       const currentStyle = useStore.getState().cardStyle;
                       const paginated = paginateMarkdown(markdown, currentStyle);
                       if (paginated !== markdown) {
                           setMarkdown(paginated);
                           setShowPaginationToast(true);
                           setTimeout(() => setShowPaginationToast(false), 4000);
                       }
                     }, 0);
                  }}
                  title="自动分页"
                  className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-md transition-colors opacity-90 hover:opacity-100 group flex-shrink-0"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path 
                      d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z" 
                      fill="url(#star-gradient)"
                      stroke="url(#star-gradient)"
                      strokeWidth="1.5"
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                    <defs>
                      <linearGradient id="star-gradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#93C5FD" />
                        <stop offset="0.5" stopColor="#60A5FA" />
                        <stop offset="1" stopColor="#3B82F6" />
                      </linearGradient>
                    </defs>
                  </svg>
                </button>
              </div>
            
              <textarea
                ref={textareaRef}
                className="flex-1 w-full h-full bg-transparent resize-none focus:outline-none font-mono text-sm leading-relaxed p-4 text-inherit placeholder-inherit/50 custom-scrollbar"
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                onPaste={handlePaste}
                placeholder="Type your markdown here..."
              />
            <div className="p-3 border-t border-black/10 dark:border-white/10 text-center space-y-1.5 bg-black/5 dark:bg-white/5">
              <div className="text-sm font-bold text-blue-600 dark:text-blue-400 opacity-90">
                {t.editorHint}
              </div>
              <div className="text-xs opacity-60">
                {t.editorHint2}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.button
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            onClick={() => setIsEditorOpen(true)}
            className="absolute left-6 top-1/2 -translate-y-1/2 p-3 glass-panel rounded-full z-40 text-inherit shadow-xl"
          >
            <ChevronRight size={24} />
          </motion.button>
        )}
      </AnimatePresence>
      
      {/* Pagination Toast */}
      <AnimatePresence>
        {showPaginationToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[70] bg-black/80 dark:bg-white/90 text-white dark:text-black px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 backdrop-blur-md"
          >
            <div className="bg-green-500 rounded-full p-1">
              <Check size={14} className="text-white" strokeWidth={3} />
            </div>
            <div className="flex flex-col">
                <span className="text-sm font-bold">已自动分页</span>
                <span className="text-[10px] opacity-80">内容过长，已按页面高度自动切割。可用 "---" 手动调整。</span>
            </div>
            <button 
                onClick={() => setShowPaginationToast(false)}
                className="ml-2 opacity-50 hover:opacity-100 p-1"
            >
                <ChevronLeft className="rotate-[-90deg]" size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
