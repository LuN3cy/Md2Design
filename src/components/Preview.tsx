import { useRef, useEffect, useState } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';
import { useStore } from '../store';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { Rnd } from 'react-rnd';
import { Trash2, Move } from 'lucide-react';

export const Preview = () => {
  const { markdown, setIsScrolled, setActiveCardIndex } = useStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Handle scroll for TopBar blur effect and active card detection
  useEffect(() => {
    const handleScroll = () => {
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
  const { cardStyle, cardImages, updateCardImage, removeCardImage } = useStore();
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
      height = width * (h / w); // Height is proportional to aspect ratio inverted for portrait? No, standard portrait is 9:16 usually
      // Wait, 16:9 in Portrait means Width 9, Height 16.
      // If user selects 16:9 and Portrait, it usually means 9:16 vertical video.
      // Let's interpret the Ratio as "Shape". 
      // 16:9 Landscape = 16 wide, 9 high.
      // 16:9 Portrait = 9 wide, 16 high.
      
      // Let's just swap dimensions if portrait
      if (w > h) {
         // Landscape ratio, but portrait mode -> Swap
         height = width * (w / h);
      } else {
         // Already portrait ratio (e.g. 9:16)
         height = width * (h / w);
      }
    } else {
      // Landscape
      width = baseSize;
      if (w > h) {
        height = width * (h / w);
      } else {
        // Portrait ratio in Landscape mode? usually doesn't happen for standard ratios like 16:9.
        // If 16:9 selected, w=16, h=9. height = width * 9/16. Correct.
        height = width * (h / w);
      }
    }
    
    // Simplification:
    // Aspect Ratio 16:9 means W:H = 16:9.
    // If Orientation is Portrait, we flip it to 9:16.
    
    let ratio = w / h;
    if (cardStyle.orientation === 'portrait') {
        if (ratio > 1) ratio = 1 / ratio; // Flip to < 1
    } else {
        if (ratio < 1) ratio = 1 / ratio; // Flip to > 1
    }
    
    width = baseSize;
    height = baseSize / ratio;
  }

  // Dynamic styles based on settings
  const outerStyle = {
    width: `${width}px`,
    height: `${height}px`,
    padding: cardStyle.enableBackground ? `${cardStyle.padding}px` : '0',
    background: cardStyle.enableBackground 
      ? (cardStyle.backgroundType === 'solid' ? cardStyle.backgroundValue : cardStyle.backgroundValue) 
      : 'transparent',
  };

  const innerStyle = {
    fontFamily: cardStyle.fontFamily,
    backgroundColor: cardStyle.backgroundColor,
    color: cardStyle.textColor,
    fontSize: `${cardStyle.fontSize}px`,
    borderRadius: `${cardStyle.borderRadius}px`,
    borderWidth: `${cardStyle.borderWidth}px`,
    borderColor: cardStyle.borderColor,
    boxShadow: cardStyle.shadow,
    padding: '2rem', // Fixed padding for content (removed to allow flexible layout)
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
  };

  const images = cardImages[index] || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative shadow-2xl overflow-hidden flex flex-col flex-shrink-0 group"
      style={outerStyle}
      id={`card-${index}`}
      onClick={() => setSelectedImageId(null)} // Deselect image when clicking card background
    >
      <div 
        className="relative w-full h-full flex flex-col overflow-hidden"
        style={innerStyle}
      >
        {/* Background gradients or patterns based on template */}
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
            data-html2canvas-ignore={selectedImageId === img.id ? undefined : undefined} // Not needed as we filter class in TopBar
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
                    {/* Future: Add Crop Mode toggle here */}
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
              components={{
                  h1: ({...props}) => <h1 style={{color: cardStyle.textColor}} className="text-3xl font-bold mb-4" {...props} />,
                  h2: ({...props}) => <h2 style={{color: cardStyle.textColor}} className="text-2xl font-bold mb-3 mt-6" {...props} />,
                  p: ({...props}) => (
                    <p style={{color: cardStyle.textColor}} className="mb-4 leading-relaxed opacity-90" {...props} />
                  ),
                  li: ({...props}) => <li style={{color: cardStyle.textColor}} className="mb-2 list-disc list-inside" {...props} />,
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
                  // Removed standard image rendering since we use object layer now, 
                  // but kept for compatibility with existing markdown images if user wants inline
                  img: ({ src, alt, ...props }: { src?: string; alt?: string }) => {
                     // Handle spacer syntax for layout
                     if (src === 'spacer') {
                       return <div className="w-full" style={{ height: '200px' }} />;
                     }
                     
                     // Fallback for standard images
                     // Check if URL has hash for sizing (e.g. #width=50%)
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
