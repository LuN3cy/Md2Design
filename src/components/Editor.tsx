import { useState, useRef } from 'react';
import { useStore } from '../store';
import { useTranslation } from '../i18n';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Edit3, Bold, Italic, List, Quote, Heading1, Heading2, Link, Image as ImageIcon } from 'lucide-react';

export const Editor = () => {
  const { markdown, setMarkdown, addCardImage } = useStore();
  const t = useTranslation();
  const [isOpen, setIsOpen] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImageUpload = (file: File) => {
    const textarea = textareaRef.current;
    // Capture insertion point - default to end if no selection
    const startPos = textarea ? textarea.selectionStart : markdown.length;
    const endPos = textarea ? textarea.selectionEnd : markdown.length;

    // Calculate which card this insertion point belongs to
    // Split text by separator up to the cursor position
    const textBefore = markdown.substring(0, startPos);
    // The separator is "\n---\n". We can match it.
    // The logic in store/preview is `split(/\n---\n/)`.
    // So the number of separators before the cursor determines the index.
    const separators = textBefore.match(/\n---\n/g);
    const targetCardIndex = separators ? separators.length : 0;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const imageUrl = e.target.result as string;
        
        // Add to store (this will create the floating image)
        addCardImage(targetCardIndex, imageUrl);
        
        // Insert spacer syntax to create layout space
        // Using a special image syntax that we'll intercept in Preview
        const spacerMarkdown = `\n![spacer](spacer)\n`;
        
        const newText = markdown.substring(0, startPos) + spacerMarkdown + markdown.substring(endPos);
        setMarkdown(newText);
        
        // Restore focus and move cursor after the inserted spacer
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
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault();
        const file = items[i].getAsFile();
        if (file) handleImageUpload(file);
        return;
      }
    }
  };

  

  return (
    <>
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            initial={{ x: -400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -400, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute left-6 top-20 bottom-6 w-[400px] glass-panel rounded-2xl flex flex-col z-40 overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-black/10 dark:border-white/10">
              <div className="flex items-center gap-2 text-sm font-semibold opacity-80">
                <Edit3 size={16} />
                <span>{t.editor}</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-1 p-2 border-b border-black/10 dark:border-white/10 overflow-x-auto custom-scrollbar">
              <button onClick={() => insertText('**','**')} title="Bold" className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-md transition-colors opacity-70 hover:opacity-100">
                <Bold size={16} />
              </button>
              <button onClick={() => insertText('*','*')} title="Italic" className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-md transition-colors opacity-70 hover:opacity-100">
                <Italic size={16} />
              </button>
              <button onClick={() => insertText('# ')} title="H1" className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-md transition-colors opacity-70 hover:opacity-100">
                <Heading1 size={16} />
              </button>
              <button onClick={() => insertText('## ')} title="H2" className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-md transition-colors opacity-70 hover:opacity-100">
                <Heading2 size={16} />
              </button>
              <button onClick={() => insertText('- ')} title="List" className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-md transition-colors opacity-70 hover:opacity-100">
                <List size={16} />
              </button>
              <button onClick={() => insertText('> ')} title="Quote" className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-md transition-colors opacity-70 hover:opacity-100">
                <Quote size={16} />
              </button>
              <button onClick={() => insertText('[', '](url)')} title="Link" className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-md transition-colors opacity-70 hover:opacity-100">
                <Link size={16} />
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                title="Image"
                className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-md transition-colors opacity-70 hover:opacity-100"
              >
                <ImageIcon size={16} />
              </button>
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
            </div>
            
            <textarea
              ref={textareaRef}
              className="flex-1 w-full h-full bg-transparent resize-none focus:outline-none font-mono text-sm leading-relaxed p-4 text-inherit placeholder-inherit/50 custom-scrollbar"
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              onPaste={handlePaste}
              placeholder="Type your markdown here..."
            />
            <div className="p-3 border-t border-black/10 dark:border-white/10 text-xs text-center opacity-50">
              {t.editorHint}
            </div>
          </motion.div>
        ) : (
          <motion.button
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            onClick={() => setIsOpen(true)}
            className="absolute left-6 top-1/2 -translate-y-1/2 p-3 glass-panel rounded-full z-40 text-inherit shadow-xl"
          >
            <ChevronRight size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};
