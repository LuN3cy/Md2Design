import { useRef, useEffect, useState } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';
import { useStore } from '../store';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { motion } from 'framer-motion';
import { Rnd } from 'react-rnd';
import { Trash2, Move } from 'lucide-react';

export const Preview = () => {
  const { markdown, setIsScrolled, setActiveCardIndex } = useStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Handle scroll for TopBar blur effect and active card detection
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (scrollRef.current) {
            setIsScrolled(scrollRef.current.scrollTop > 20);
            
            // Find center card
            const cards = document.querySelectorAll('[id^="card-"]');
            let closestCardIndex = 0;
            let minDistance = Infinity;
            const center = window.innerHeight / 2;
    
            cards.forEach((card, index) => {
              const rect = card.getBoundingClientRect();
              const distance = Math.abs(rect.top + rect.height / 2 - center);
              if (distance < minDistance) {
                minDistance = distance;
                closestCardIndex = index;
              }
            });
            setActiveCardIndex(closestCardIndex);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    const el = scrollRef.current;
    el?.addEventListener('scroll', handleScroll);
    return () => el?.removeEventListener('scroll', handleScroll);
  }, [setIsScrolled, setActiveCardIndex]);
  
  // Split markdown by "---" to create pages
  const pages = markdown.split(/\n---\n/).filter(page => page.trim() !== '');

  return (
    <div 
      ref={scrollRef}
      className="w-full h-full overflow-y-auto p-8 pt-24 flex flex-col items-center gap-12 custom-scrollbar pb-32"
    >
      {pages.map((pageContent, index) => (
        <Card 
          key={index} 
          content={pageContent} 
          index={index}
        />
      ))}
    </div>
  );
};

const Card = ({ content, index }: { content: string, index: number }) => {
  const { cardStyle, cardImages, updateCardImage, removeCardImage, isResetting } = useStore();
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  
  // Calculate dimensions based on settings
  let width = cardStyle.width || 800;
  let height = cardStyle.height || 600;

  if (cardStyle.aspectRatio !== 'custom') {
    const [w, h] = cardStyle.aspectRatio.split(':').map(Number);
    const baseSize = 500; // Base width for preview scaling
    
    // Determine dimensions based on orientation and aspect ratio
    if (cardStyle.orientation === 'portrait') {
      width = baseSize;
      height = width * (h / w); 
      // Swap dimensions if portrait to ensure vertical orientation
      if (w > h) {
         height = width * (w / h);
      } else {
         height = width * (h / w);
      }
    } else {
      // Landscape
      width = baseSize;
      if (w > h) {
        height = width * (h / w);
      } else {
        height = width * (h / w);
      }
    }
    
    // Simplification logic for calculation consistency
    let ratio = w / h;
    if (cardStyle.orientation === 'portrait') {
        if (ratio > 1) ratio = 1 / ratio; 
    } else {
        if (ratio < 1) ratio = 1 / ratio; 
    }
    
    width = baseSize;
    height = baseSize / ratio;
  }

  // Dynamic styles based on settings
  const outerStyle = {
    width: `${width}px`,
    height: `${height}px`,
    padding: cardStyle.enableBackground ? `${cardStyle.padding}px` : '0',
    background: 'transparent', // Handled by separate layer
  };

  const innerStyle = {
    fontFamily: cardStyle.fontFamily,
    backgroundColor: 'transparent', // Handled by separate layer
    color: cardStyle.textColor,
    fontSize: `${cardStyle.fontSize}px`,
    borderRadius: `${cardStyle.borderRadius}px`,
    borderWidth: `${cardStyle.borderWidth}px`,
    borderColor: cardStyle.borderColor,
    boxShadow: cardStyle.shadow,
    padding: '2rem',
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
  };

  const images = cardImages[index] || [];

  const renderOuterBackground = () => {
    if (!cardStyle.enableBackground) return null;
    
    if (cardStyle.backgroundType === 'image' && cardStyle.backgroundImage) {
        return (
          <div className="absolute inset-0 overflow-hidden -z-10 rounded-none pointer-events-none">
             <div 
               style={{
                 width: '100%',
                 height: '100%',
                 backgroundImage: `url(${cardStyle.backgroundImage})`,
                 backgroundPosition: 'center',
                 backgroundSize: 'cover',
                 transform: `translate(${cardStyle.backgroundConfig.x}px, ${cardStyle.backgroundConfig.y}px) scale(${cardStyle.backgroundConfig.scale})`,
                 filter: `blur(${cardStyle.backgroundConfig.blur}px)`
               }}
             />
          </div>
        );
    } else if (cardStyle.backgroundType === 'gradient') {
        return <div className="absolute inset-0 -z-10 pointer-events-none" style={{ background: cardStyle.backgroundValue }} />;
    } else {
        // Solid
        return <div className="absolute inset-0 -z-10 pointer-events-none" style={{ background: cardStyle.backgroundValue }} />;
    }
  };

  const renderInnerBackground = () => {
     const type = cardStyle.cardBackgroundType || 'solid';
     const innerRadius = Math.max(0, cardStyle.borderRadius - cardStyle.borderWidth);
     const radiusStyle = { borderRadius: `${innerRadius}px` };
     
     if (type === 'image' && cardStyle.cardBackgroundImage) {
        return (
          <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none" style={radiusStyle}>
             <div 
               style={{
                 width: '100%',
                 height: '100%',
                 backgroundImage: `url(${cardStyle.cardBackgroundImage})`,
                 backgroundPosition: 'center',
                 backgroundSize: 'cover',
                 transform: `translate(${cardStyle.cardBackgroundConfig.x}px, ${cardStyle.cardBackgroundConfig.y}px) scale(${cardStyle.cardBackgroundConfig.scale})`,
                 filter: `blur(${cardStyle.cardBackgroundConfig.blur}px)`
               }}
             />
          </div>
        );
     } else if (type === 'gradient') {
        return <div className="absolute inset-0 -z-10 pointer-events-none" style={{ ...radiusStyle, background: cardStyle.cardGradientValue }} />;
     } else {
        // Solid (default)
        return <div className="absolute inset-0 -z-10 pointer-events-none bg-current" style={{ ...radiusStyle, color: cardStyle.backgroundColor }} />;
     }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`relative shadow-2xl overflow-hidden flex flex-col flex-shrink-0 group ${isResetting ? 'transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)]' : ''}`}
      style={outerStyle}
      id={`card-${index}`}
      onClick={() => setSelectedImageId(null)} // Deselect image when clicking card background
    >
      {renderOuterBackground()}

      <div 
        className={`relative w-full h-full flex flex-col overflow-hidden ${isResetting ? 'transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)]' : ''}`}
        style={innerStyle}
      >
        {renderInnerBackground()}

        {/* Background gradients or patterns based on template (only if no custom image/gradient is set, or as overlay?) 
            Actually, let's keep it but make it subtle or remove if custom bg is set?
            Default template effect:
        */}
        {cardStyle.template === 'default' && (
           <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-400 to-orange-300 blur-3xl opacity-20 -z-0 pointer-events-none" />
        )}
        
        {/* Images Layer */}
        {images.map((img) => (
          <Rnd
            key={img.id}
            size={{ width: img.width, height: img.height }}
            position={{ x: img.x, y: img.y }}
            onDragStop={(_, d) => {
              updateCardImage(index, img.id, { x: d.x, y: d.y });
            }}
            onResizeStop={(_, __, ref, ___, position) => {
              updateCardImage(index, img.id, {
                width: parseInt(ref.style.width),
                height: parseInt(ref.style.height),
                ...position,
              });
            }}
            bounds="parent"
            className={`z-20 ${selectedImageId === img.id ? 'ring-2 ring-blue-500' : 'hover:ring-1 hover:ring-blue-300/50'}`}
            onClick={(e: ReactMouseEvent) => {
              e.stopPropagation();
              setSelectedImageId(img.id);
            }}
            data-html2canvas-ignore={selectedImageId === img.id ? undefined : undefined} 
          >
            <div className="relative w-full h-full group/img">
               <img 
                 src={img.src} 
                 className="w-full h-full object-cover pointer-events-none" 
                 alt="added"
                 style={{ 
                    objectPosition: `${-img.crop.x}px ${-img.crop.y}px`,
                    transform: `scale(${img.crop.scale})` 
                 }}
               />
               
               {selectedImageId === img.id && (
                 <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-black/80 text-white rounded-lg p-1 shadow-xl z-50 export-ignore">
                    <button 
                      className="p-1 hover:bg-white/20 rounded"
                      title="Move Mode (Default)"
                    >
                      <Move size={14} />
                    </button>
                    <button 
                      className="p-1 hover:bg-red-500/80 rounded text-red-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeCardImage(index, img.id);
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                 </div>
               )}
            </div>
          </Rnd>
        ))}

        <div className="relative z-10 h-full flex flex-col pointer-events-none">
          <div className="prose prose-sm max-w-none flex-1 pointer-events-auto p-8 overflow-hidden">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkBreaks]}
              components={{
                  h1: ({...props}) => (
                    <div className="flex flex-col items-center mb-8 first:mt-0 mt-8">
                      <h1 style={{color: cardStyle.h1Color || cardStyle.textColor}} className="text-3xl font-bold mb-2 text-center" {...props} />
                      <div className="h-1 w-24 rounded-full" style={{backgroundColor: cardStyle.h1LineColor || cardStyle.accentColor}} />
                    </div>
                  ),
                  h2: ({...props}) => (
                    <div className="flex justify-center mb-6 mt-8 first:mt-0">
                      <h2 
                        style={{
                          backgroundColor: cardStyle.h2BackgroundColor || cardStyle.accentColor, 
                          color: cardStyle.h2Color || '#fff'
                        }} 
                        className="text-lg font-bold px-4 py-1.5 shadow-md rounded-lg" 
                        {...props} 
                      />
                    </div>
                  ),
                  h3: ({...props}) => (
                    <h3 
                      style={{
                        color: cardStyle.h3Color || cardStyle.textColor,
                        borderLeftColor: cardStyle.h3LineColor || cardStyle.accentColor
                      }} 
                      className="text-xl font-bold mb-4 mt-6 first:mt-0 pl-3 border-l-4" 
                      {...props} 
                    />
                  ),
                  p: ({...props}) => (
                    <p style={{color: cardStyle.textColor}} className="mb-4 leading-relaxed opacity-90 first:mt-0" {...props} />
                  ),
                  ul: ({...props}) => <ul style={{color: cardStyle.textColor}} className="mb-4 list-disc list-outside pl-5 space-y-1" {...props} />,
                  ol: ({...props}) => <ol style={{color: cardStyle.textColor}} className="mb-4 list-decimal list-outside pl-5 space-y-1" {...props} />,
                  li: ({...props}) => <li className="pl-1 marker:opacity-70 [&>p]:mb-2" {...props} />,
                  table: ({...props}) => <div className="overflow-x-auto mb-6 rounded-lg border border-current opacity-90"><table className="w-full text-left text-sm border-collapse" {...props} /></div>,
                  thead: ({...props}) => <thead className="bg-black/5 dark:bg-white/10 font-semibold" {...props} />,
                  tbody: ({...props}) => <tbody className="divide-y divide-current/10" {...props} />,
                  tr: ({...props}) => <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors" {...props} />,
                  th: ({...props}) => <th className="p-3 border-b border-current/20 whitespace-nowrap" {...props} />,
                  td: ({...props}) => <td className="p-3 border-b border-current/10" {...props} />,
                  pre: ({children}) => <>{children}</>,
                  blockquote: ({...props}) => (
                    <blockquote 
                      style={{ 
                        borderLeftColor: cardStyle.blockquoteBorderColor, 
                        backgroundColor: cardStyle.blockquoteBackgroundColor 
                      }} 
                      className="border-l-4 pl-4 py-2 my-4 italic opacity-90 rounded-r-lg rounded-bl-sm [&>p:last-child]:mb-0" 
                      {...props} 
                    />
                  ),
                  a: ({...props}) => <a style={{color: cardStyle.accentColor}} className="underline decoration-auto underline-offset-2" {...props} />,
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
                  code: ({ children, ...props }: { children?: React.ReactNode }) => {
                    const text = String(children ?? '');
                    return !text.includes('\n') ? (
                      <code style={{ backgroundColor: cardStyle.codeBackgroundColor }} className="rounded px-1.5 py-0.5 text-[0.9em] font-mono" {...props}>
                        {children}
                      </code>
                    ) : (
                      <code style={{ backgroundColor: cardStyle.codeBackgroundColor, fontSize: '0.8em' }} className="block rounded-lg p-4 font-mono my-4 overflow-x-auto whitespace-pre-wrap break-words" {...props}>
                        {children}
                      </code>
                    );
                  }
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
          
          {/* Footer (Watermark & Page Number) */}
          <div className="flex-shrink-0 w-full px-8 pb-4 pt-2 flex items-center relative opacity-60 font-mono uppercase tracking-widest pointer-events-none text-[10px] h-8">
             {/* Left */}
             <div className="absolute left-8 flex items-center gap-4">
               {cardStyle.pageNumber.enabled && cardStyle.pageNumber.position === 'left' && (
                  <span className="font-bold">{index + 1}</span>
               )}
               {cardStyle.watermark.enabled && cardStyle.watermark.position === 'left' && (
                  <span>{cardStyle.watermark.content}</span>
               )}
             </div>

             {/* Center */}
             <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-4">
               {cardStyle.pageNumber.enabled && cardStyle.pageNumber.position === 'center' && (
                  <span className="font-bold">{index + 1}</span>
               )}
               {cardStyle.watermark.enabled && cardStyle.watermark.position === 'center' && (
                  <span>{cardStyle.watermark.content}</span>
               )}
             </div>

             {/* Right */}
             <div className="absolute right-8 flex items-center gap-4">
               {cardStyle.watermark.enabled && cardStyle.watermark.position === 'right' && (
                  <span>{cardStyle.watermark.content}</span>
               )}
               {cardStyle.pageNumber.enabled && cardStyle.pageNumber.position === 'right' && (
                  <span className="font-bold">{index + 1}</span>
               )}
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};