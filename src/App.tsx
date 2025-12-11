import { useEffect } from 'react';
import { useStore } from './store';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';

function App() {
  const { theme, cardStyle } = useStore();
  const { undo, redo } = useStore.temporal.getState();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl+Z or Cmd+Z
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          redo();
        } else {
          e.preventDefault();
          undo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const styleId = 'custom-fonts-style';
    let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }

    const getFormat = (url: string) => {
      // Data URI format
      if (url.startsWith('data:')) {
        const mime = url.slice(5, url.indexOf(';')); // after 'data:' until ';'
        if (mime.includes('woff2')) return 'woff2';
        if (mime.includes('woff')) return 'woff';
        if (mime.includes('otf') || mime.includes('opentype')) return 'opentype';
        if (mime.includes('ttf') || mime.includes('truetype')) return 'truetype';
        return 'truetype'; // Default fallback
      }
      
      // File extension fallback
      const lower = url.toLowerCase();
      if (lower.endsWith('.woff2')) return 'woff2';
      if (lower.endsWith('.woff')) return 'woff';
      if (lower.endsWith('.otf')) return 'opentype';
      return 'truetype';
    };

    const css = (cardStyle.customFonts || [])
      .map((font) => {
        const format = getFormat(font.url);
        // Ensure font family name is quoted and safe
        const safeName = font.name.replace(/['"\\]/g, '');
        
        // Use specified weight or default to 'normal' (400) if not variable
        // If weight is 'variable', use range. Otherwise use 'normal' to allow synthetic bold
        const fontWeight = font.weight === 'variable' ? '100 900' : 'normal';
        
        return `@font-face {
          font-family: "${safeName}";
          src: url("${font.url}") format("${format}");
          font-weight: ${fontWeight};
          font-style: normal italic;
          font-display: swap;
        }`;
      })
      .join('\n');

    styleEl.textContent = css;
    
    // Force re-render of elements using these fonts by toggling a class or similar if needed,
    // but usually updating the style tag is enough. 
    // However, to be safe, we can log to ensure it's updating.
    console.log('Updated custom fonts:', cardStyle.customFonts.map(f => f.name));
    
  }, [cardStyle.customFonts]);

  return (
    <div className={`relative w-full h-screen overflow-hidden font-sans transition-colors duration-500 ${theme === 'dark' ? 'grid-bg text-white' : 'grid-bg-light text-slate-900'}`}>
      <TopBar />
      
      <div className="relative z-10 w-full h-full pt-14 overflow-hidden">
        <Preview />
        <Editor />
        <Sidebar />
      </div>
    </div>
  );
}

export default App;
