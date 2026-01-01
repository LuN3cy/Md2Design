import { useRef, useEffect, useState } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';
import { useStore } from '../store';
import { getCardDimensions } from '../utils/cardUtils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { motion } from 'framer-motion';
import { Rnd } from 'react-rnd';
import { Trash2, Move } from 'lucide-react';

export const Preview = () => {
  const { markdown, setIsScrolled, setActiveCardIndex, cardStyle, isEditorOpen, isSidebarOpen, previewZoom, setPreviewZoom } = useStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  
  const { width, height } = getCardDimensions(cardStyle);
  const [scale, setScale] = useState(1);
  const [autoScale, setAutoScale] = useState(1);

  useEffect(() => {
    const calculateScale = () => {
      const isDesktop = window.innerWidth >= 1024;
      
      // Calculate occupied space based on open panels
      // Editor: 400px + 24px (left-6) + 24px (margin)
      // Sidebar: 350px + 24px (right-6) + 24px (margin)
      // We add extra margin for visual breathing room
      const editorSpace = (isDesktop && isEditorOpen) ? 448 : 40;
      const sidebarSpace = (isDesktop && isSidebarOpen) ? 398 : 40;
      
      const horizontalOccupied = editorSpace + sidebarSpace;
      const verticalSpace = 180; // TopBar + Padding

      const availableWidth = Math.max(300, window.innerWidth - horizontalOccupied);
      const availableHeight = Math.max(300, window.innerHeight - verticalSpace);
      
      const wScale = availableWidth / width;
      const hScale = availableHeight / height;
      
      // Fit completely within viewport, but never upscale (max 1)
      let s = Math.min(wScale, hScale, 1);

      // In auto-height mode, we only care about width fitting, allowing vertical scrolling
      if (cardStyle.autoHeight) {
        s = Math.min(wScale, 1);
      }
      
      // Minimum scale to avoid invisibility
      if (s < 0.2) s = 0.2;
      
      setAutoScale(s);
    };
    
    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, [width, height, isEditorOpen, isSidebarOpen, cardStyle.autoHeight]);

  useEffect(() => {
    if (previewZoom > 0) {
      // eslint-disable-next-line
      setScale(previewZoom);
    } else {
      setScale(autoScale);
    }
  }, [previewZoom, autoScale]);

  // Handle Ctrl+Scroll for zoom
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if ((e.ctrlKey || e.metaKey) && scrollRef.current && scrollRef.current.contains(e.target as Node)) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        const currentScale = previewZoom > 0 ? previewZoom : autoScale;
        const newScale = Math.max(0.2, Math.min(4, currentScale + delta));
        setPreviewZoom(newScale);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [previewZoom, autoScale, setPreviewZoom]);
  
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
  const pages = cardStyle.autoHeight 
    ? [markdown] 
    : markdown.split(/\n\s*---\s*\n|^\s*---\s*$/m).filter(page => page.trim() !== '');

  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024;
  const paddingLeft = (isDesktop && isEditorOpen) ? '448px' : '2rem';
  const paddingRight = (isDesktop && isSidebarOpen) ? '398px' : '2rem';

  return (
    <div 
      ref={scrollRef}
      className="w-full h-full overflow-y-auto pt-24 flex flex-col items-center gap-12 custom-scrollbar pb-32 transition-all duration-300"
      style={{
        paddingLeft,
        paddingRight
      }}
    >
      {pages.map((pageContent, index) => (
        <Card 
          key={index} 
          content={pageContent} 
          index={index}
          scale={scale}
          width={width}
          height={height}
          selectedImageId={selectedImageId}
          setSelectedImageId={setSelectedImageId}
        />
      ))}
    </div>
  );
};

const Card = ({ 
  content, 
  index, 
  scale, 
  width, 
  height,
  selectedImageId,
  setSelectedImageId 
}: { 
  content: string, 
  index: number,
  scale: number,
  width: number,
  height: number,
  selectedImageId: string | null,
  setSelectedImageId: (id: string | null) => void
}) => {
  const { cardStyle, cardImages, updateCardImage, removeCardImage, isResetting } = useStore();
  
  // Dynamic styles based on settings
  const outerStyle = {
    width: `${width}px`,
    height: cardStyle.autoHeight ? 'auto' : `${height}px`,
    minHeight: cardStyle.autoHeight ? `${height}px` : undefined,
    padding: cardStyle.enableBackground ? `${cardStyle.padding}px` : '0',
    background: 'transparent', // Handled by separate layer
  };

  const innerStyle = {
    fontFamily: ['serif', 'monospace', 'sans-serif', 'cursive', 'fantasy', 'system-ui'].includes(cardStyle.fontFamily) 
      ? `${cardStyle.fontFamily}, system-ui, sans-serif`
      : `"${cardStyle.fontFamily}", system-ui, sans-serif`,
    backgroundColor: 'transparent', // Handled by separate layer
    color: cardStyle.textColor,
    fontSize: `${cardStyle.fontSize}px`,
    borderRadius: `${cardStyle.borderRadius}px`,
    borderWidth: `${cardStyle.borderWidth}px`,
    borderColor: cardStyle.borderColor,
    boxShadow: cardStyle.shadow,
    paddingTop: `${cardStyle.cardPadding?.top ?? cardStyle.contentPadding}px`,
    paddingRight: `${cardStyle.cardPadding?.right ?? cardStyle.contentPadding}px`,
    paddingBottom: `${cardStyle.cardPadding?.bottom ?? cardStyle.contentPadding}px`,
    paddingLeft: `${cardStyle.cardPadding?.left ?? cardStyle.contentPadding}px`,
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
    <div 
      style={{ 
        width: width * scale, 
        height: cardStyle.autoHeight ? 'auto' : height * scale,
        transition: 'all 0.3s ease'
      }} 
      className="relative shrink-0"
    >
      <div 
        style={{ 
          width: width, 
          height: cardStyle.autoHeight ? 'auto' : height,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          transition: 'transform 0.3s ease'
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`relative shadow-2xl overflow-hidden flex flex-col shrink-0 group ${isResetting ? 'transition-all duration-1000 ease-in-out' : ''}`}
          style={outerStyle}
          id={`card-${index}`}
          onClick={() => setSelectedImageId(null)} // Deselect image when clicking card background
        >
          {renderOuterBackground()}

          <div 
            className={`relative w-full h-full flex flex-col overflow-hidden ${isResetting ? 'transition-all duration-1000 ease-in-out' : ''}`}
            style={innerStyle}
          >
            {renderInnerBackground()}

            {/* Background gradients or patterns based on template (only if no custom image/gradient is set, or as overlay?) 
                Actually, let's keep it but make it subtle or remove if custom bg is set?
                Default template effect:
            */}
            {cardStyle.template === 'default' && (
              <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-pink-400 to-orange-300 blur-3xl opacity-20 z-0 pointer-events-none" />
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
              <div 
                className="prose prose-sm max-w-none flex-1 pointer-events-auto overflow-hidden wrap-break-word [&>*:first-child]:mt-0"
                style={{ 
                  padding: 0,
                  maxHeight: cardStyle.autoHeight ? 'none' : '100%', // Ensure strict clipping to prevent overlap
                  fontFamily: 'inherit'
                }}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkBreaks]}
                  components={{
                      h1: ({...props}) => (
                  <div className="flex flex-col items-center mb-8 mt-4 first:mt-0">
                    <h1 style={{color: cardStyle.h1Color || cardStyle.textColor, fontSize: `${cardStyle.h1FontSize}px`}} className="font-bold mb-2 text-center" {...props} />
                    <div className="h-1 w-24 rounded-full" style={{backgroundColor: cardStyle.h1LineColor || cardStyle.accentColor}} />
                  </div>
                ),
                h2: ({...props}) => (
                  <div className="flex justify-center mb-6 mt-6 first:mt-0">
                    <h2 
                      style={{
                        backgroundColor: cardStyle.h2BackgroundColor || cardStyle.accentColor, 
                        color: cardStyle.h2Color || '#fff',
                        fontSize: `${cardStyle.h2FontSize}px`
                      }} 
                      className="font-bold px-4 py-1.5 shadow-md rounded-lg" 
                      {...props} 
                    />
                  </div>
                ),
                h3: ({...props}) => (
                  <h3 
                    style={{
                      color: cardStyle.h3Color || cardStyle.textColor,
                      borderLeftColor: cardStyle.h3LineColor || cardStyle.accentColor,
                      fontSize: `${cardStyle.h3FontSize}px`
                    }} 
                    className="font-bold mb-4 mt-4 first:mt-0 pl-3 border-l-4" 
                    {...props} 
                  />
                ),
                h4: ({...props}) => (
                   <h4
                    style={{
                      color: cardStyle.textColor,
                      fontSize: `${cardStyle.headingScale * 1.125}rem`
                    }}
                    className="font-bold mb-2 mt-4 first:mt-0"
                    {...props}
                   />
                ),
                h5: ({...props}) => (
                   <h5
                    style={{
                      color: cardStyle.textColor,
                      fontSize: `${cardStyle.headingScale * 1}rem`
                    }}
                    className="font-bold mb-2 mt-4 first:mt-0"
                    {...props}
                   />
                ),
                h6: ({...props}) => (
                   <h6
                    style={{
                      color: cardStyle.textColor,
                      fontSize: `${cardStyle.headingScale * 0.875}rem`
                    }}
                    className="font-bold mb-2 mt-4 first:mt-0 opacity-80"
                    {...props}
                   />
                ),
                del: ({...props}) => <del style={{color: cardStyle.textColor, opacity: 0.7}} {...props} />,
                      p: ({...props}) => (
                        <p style={{color: cardStyle.textColor}} className="mb-4 leading-relaxed opacity-90 first:mt-0" {...props} />
                      ),
                      ul: ({...props}) => <ul style={{color: cardStyle.textColor}} className="mb-4 list-disc list-inside space-y-1" {...props} />,
                      ol: ({...props}) => <ol style={{color: cardStyle.textColor}} className="mb-4 list-decimal list-inside space-y-1" {...props} />,
                      li: ({...props}) => <li className="marker:opacity-70 [&>p]:inline" {...props} />,
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
                          className="border-l-4 pl-4 py-2 my-4 italic opacity-90 rounded-r-lg rounded-bl-sm [&>p:last-child]:mb-0 [&>p:first-child]:mt-0 wrap-break-word" 
                          {...props} 
                        />
                      ),
                      a: ({...props}) => <a style={{color: cardStyle.accentColor}} className="underline decoration-auto underline-offset-2 break-all" {...props} />,
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
                          <code style={{ backgroundColor: cardStyle.codeBackgroundColor, fontSize: '0.8em' }} className="block rounded-lg p-4 font-mono my-4 overflow-x-auto whitespace-pre-wrap wrap-break-word" {...props}>
                            {children}
                          </code>
                        );
                      }
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>
            </div>

            {/* Footer (Watermark & Page Number) - Positioned in bottom padding */}
            {(cardStyle.pageNumber.enabled || cardStyle.watermark.enabled) && (
              <div 
                className="absolute bottom-0 left-0 right-0 flex items-center font-mono uppercase tracking-widest pointer-events-auto"
                style={{ 
                  color: cardStyle.textColor,
                  height: `${cardStyle.cardPadding?.bottom ?? cardStyle.contentPadding}px`,
                  paddingLeft: `${cardStyle.cardPadding?.left ?? cardStyle.contentPadding}px`,
                  paddingRight: `${cardStyle.cardPadding?.right ?? cardStyle.contentPadding}px`
                }}
              >
                {/* Left */}
                <div className="absolute left-0 pl-[inherit] flex items-center gap-4 h-full">
                  {cardStyle.pageNumber.enabled && cardStyle.pageNumber.position === 'left' && (
                      <span style={{ color: cardStyle.pageNumber.color || cardStyle.textColor, opacity: cardStyle.pageNumber.opacity, fontSize: `${cardStyle.pageNumber.fontSize}px` }} className="font-bold">{index + 1}</span>
                  )}
                  {cardStyle.watermark.enabled && cardStyle.watermark.position === 'left' && (
                      <span style={{ color: cardStyle.watermark.color || cardStyle.textColor, opacity: cardStyle.watermark.opacity, fontSize: `${cardStyle.watermark.fontSize}px` }}>{cardStyle.watermark.content}</span>
                  )}
                </div>

                {/* Center */}
                <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-4 h-full">
                  {cardStyle.pageNumber.enabled && cardStyle.pageNumber.position === 'center' && (
                      <span style={{ color: cardStyle.pageNumber.color || cardStyle.textColor, opacity: cardStyle.pageNumber.opacity, fontSize: `${cardStyle.pageNumber.fontSize}px` }} className="font-bold">{index + 1}</span>
                  )}
                  {cardStyle.watermark.enabled && cardStyle.watermark.position === 'center' && (
                      <span style={{ color: cardStyle.watermark.color || cardStyle.textColor, opacity: cardStyle.watermark.opacity, fontSize: `${cardStyle.watermark.fontSize}px` }}>{cardStyle.watermark.content}</span>
                  )}
                </div>

                {/* Right */}
                <div className="absolute right-0 pr-[inherit] flex items-center gap-4 h-full">
                  {cardStyle.watermark.enabled && cardStyle.watermark.position === 'right' && (
                      <span style={{ color: cardStyle.watermark.color || cardStyle.textColor, opacity: cardStyle.watermark.opacity, fontSize: `${cardStyle.watermark.fontSize}px` }}>{cardStyle.watermark.content}</span>
                  )}
                  {cardStyle.pageNumber.enabled && cardStyle.pageNumber.position === 'right' && (
                      <span style={{ color: cardStyle.pageNumber.color || cardStyle.textColor, opacity: cardStyle.pageNumber.opacity, fontSize: `${cardStyle.pageNumber.fontSize}px` }} className="font-bold">{index + 1}</span>
                  )}
                </div>
              </div>
            )}

          </div>
        </motion.div>
      </div>
    </div>
  );
};