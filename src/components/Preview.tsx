import { useRef, useEffect, useState, memo, useMemo } from 'react';
import { useStore } from '../store';
import { getCardDimensions } from '../utils/cardUtils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import { motion } from 'framer-motion';
import { Rnd } from 'react-rnd';
import { Trash2, Maximize2, StretchHorizontal, Crop, Square } from 'lucide-react';

const Card = memo(({ 
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
  const cardStyle = useStore(state => state.cardStyle);
  const cardImages = useStore(state => state.cardImages);
  const updateCardImage = useStore(state => state.updateCardImage);
  const removeCardImage = useStore(state => state.removeCardImage);
  const isResetting = useStore(state => state.isResetting);
  
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isSnapX, setIsSnapX] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  // Handle keyboard delete
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedImageId) {
        // Don't delete if we are in an input or textarea
        if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;
        
        removeCardImage(index, selectedImageId);
        setSelectedImageId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageId, index, removeCardImage, setSelectedImageId]);
  
  const centerX = width / 2;

  // Dynamic styles based on settings
  const outerStyle = {
    width: `${width}px`,
    height: cardStyle.autoHeight ? 'auto' : `${height}px`,
    minHeight: cardStyle.layoutMode === 'flexible' ? '100px' : (cardStyle.autoHeight ? `${height}px` : undefined),
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

  const images = useMemo(() => cardImages[index] || [], [cardImages, index]);

  // Sync images with spacers
  useEffect(() => {
    if (!cardRef.current) return;
    
    // We use a small delay to ensure markdown has rendered and DOM is ready
     const timer = setTimeout(() => {
       images.forEach((image) => {
         if (image.spacerId && image.isAttachedToSpacer) {
           const spacer = cardRef.current?.querySelector(`[data-spacer-id="${image.spacerId}"]`);
          if (spacer) {
            const rect = spacer.getBoundingClientRect();
            const cardRect = cardRef.current?.getBoundingClientRect();
            
            if (cardRect) {
              // Calculate center position of spacer relative to card
              const targetX = (rect.left - cardRect.left) + (rect.width / 2) - (image.width / 2);
              const targetY = (rect.top - cardRect.top) + (rect.height / 2) - (image.height / 2);
              
              // Only update if position is significantly different to avoid loops or unnecessary state updates
              if (Math.abs(image.x - targetX) > 0.5 || Math.abs(image.y - targetY) > 0.5) {
                updateCardImage(index, image.id, { x: targetX, y: targetY });
              }
            }
          }
        }
      });
    }, 50);

    return () => clearTimeout(timer);
  }, [content, images, index, updateCardImage, width, height, cardStyle]);

  // 修复 Markdown 空行渲染问题：跳过代码块，仅对普通文本执行空行替换
  const processedContent = useMemo(() => {
    // Split by code blocks (fenced and inline)
    // When using split with a capture group, matched parts appear at odd indices
    const codeBlockRegex = /(```[\s\S]*?```|`[^`]+`)/g;
    const parts = content.split(codeBlockRegex);
    
    return parts.map((part, i) => {
      // Odd indices are code blocks (matched by capture group) - preserve as-is
      if (i % 2 === 1) return part;
      // Even indices are normal content - apply blank line fix
      return part.replace(/\n\s*\n/g, '\n\n\u200C\n\n');
    }).join('');
  }, [content]);

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

  interface MarkdownComponentProps {
    node?: unknown;
    children?: React.ReactNode;
    style?: React.CSSProperties;
    [key: string]: unknown;
  }

  const components: Record<string, React.FC<MarkdownComponentProps>> = useMemo(() => ({
    h1: ({ style, ...props }) => (
      <h1 
        style={{
          color: cardStyle.h1Color || cardStyle.textColor, 
          fontSize: `${cardStyle.h1FontSize}px`,
          borderBottom: `4px solid ${cardStyle.h1LineColor || cardStyle.accentColor}`,
          ...style
        }} 
        className="font-bold mb-4 mt-4 first:mt-0 pb-1" 
        {...props} 
      />
    ),
    h2: ({ style, ...props }) => (
      <h2 
        style={{
          backgroundColor: cardStyle.h2BackgroundColor || cardStyle.accentColor, 
          color: cardStyle.h2Color || '#fff',
          fontSize: `${cardStyle.h2FontSize}px`,
          ...style
        }} 
        className="font-bold px-4 py-1.5 shadow-md rounded-lg mb-4 mt-4 first:mt-0 inline-block" 
        {...props} 
      />
    ),
    h3: ({ style, ...props }) => (
      <h3 
        style={{
          color: cardStyle.h3Color || cardStyle.textColor,
          borderLeftColor: cardStyle.h3LineColor || cardStyle.accentColor,
          fontSize: `${cardStyle.h3FontSize}px`,
          ...style
        }} 
        className="font-bold mb-4 mt-4 first:mt-0 pl-3 border-l-4" 
        {...props} 
      />
    ),
    h4: ({ style, ...props }) => (
       <h4
        style={{
          color: cardStyle.textColor,
          fontSize: `${cardStyle.headingScale * 1.125}rem`,
          ...style
        }}
        className="font-bold mb-2 mt-4 first:mt-0"
        {...props}
       />
    ),
    h5: ({ style, ...props }) => (
       <h5
        style={{
          color: cardStyle.textColor,
          fontSize: `${cardStyle.headingScale * 1}rem`,
          ...style
        }}
        className="font-bold mb-2 mt-4 first:mt-0"
        {...props}
       />
    ),
    h6: ({ style, ...props }) => (
       <h6
        style={{
          color: cardStyle.textColor,
          fontSize: `${cardStyle.headingScale * 0.875}rem`,
          ...style
        }}
        className="font-bold mb-2 mt-4 first:mt-0"
        {...props}
       />
    ),
    strong: ({ style, ...props }) => <strong style={{color: cardStyle.textColor, fontWeight: 'bold', ...style}} {...props} />,
    em: ({ style, ...props }) => <em style={{color: cardStyle.textColor, fontStyle: 'italic', ...style}} {...props} />,
    u: ({ style, ...props }) => <u style={{color: cardStyle.underlineColor || cardStyle.accentColor, textDecoration: 'underline', ...style}} {...props} />,
    del: ({ style, ...props }) => <del style={{color: cardStyle.strikethroughColor || cardStyle.textColor, opacity: 0.7, ...style}} {...props} />,
    p: ({ children, style, ...props }) => {
      // Check if children is just the &zwnj; character
      const isZwnj = Array.isArray(children) 
        ? children.length === 1 && children[0] === '\u200C'
        : children === '\u200C';
      
      if (isZwnj) return null;

      const isEmpty = !children || (Array.isArray(children) && children.length === 0);
      return (
        <p 
          style={{ color: cardStyle.textColor, fontSize: 'inherit', ...style }} 
          className="mb-4 leading-relaxed opacity-90 first:mt-0 min-h-[1.5em]" 
          {...props}
        >
          {isEmpty ? '\u00A0' : children}
        </p>
      );
    },
    div: ({ style, children, ...props }) => {
       // If it's a wrapper for alignment, we don't want extra margin
       const isAlignment = style?.textAlign;
       return (
         <div 
           style={{ color: cardStyle.textColor, fontSize: 'inherit', ...style }} 
           className={`${isAlignment ? 'my-0' : 'mb-4'} leading-relaxed opacity-90 first:mt-0 min-h-[1.5em]`} 
           {...props} 
         >
           {children}
         </div>
       );
     },
     span: ({ style, children, ...props }) => {
       const isAlignment = style?.textAlign;
       return (
         <span 
           style={{ color: cardStyle.textColor, fontSize: 'inherit', ...style }} 
           className={`${isAlignment ? 'block my-0' : ''} leading-relaxed opacity-90`} 
           {...props} 
         >
           {children}
         </span>
       );
     },
    ul: (props) => <ul style={{color: cardStyle.textColor, fontSize: 'inherit'}} className="mb-4 list-disc list-outside pl-5! m-0 space-y-1" {...props} />,
    ol: (props) => <ol style={{color: cardStyle.textColor, fontSize: 'inherit'}} className="mb-4 list-decimal list-outside pl-6! m-0 space-y-1" {...props} />,
    li: (props) => <li style={{ fontSize: 'inherit' }} className="marker:opacity-70 [&>p]:inline" {...props} />,
    table: (props) => <div className="overflow-x-auto mb-6 rounded-lg opacity-90"><table className="w-full text-left text-sm border-collapse border-none" {...props} /></div>,
    thead: (props) => <thead className="bg-black/5 dark:bg-white/10 font-semibold border-none" {...props} />,
    tbody: (props) => <tbody className="border-none" {...props} />,
    tr: (props) => <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors border-none" {...props} />,
    th: (props) => <th className="p-3 whitespace-nowrap border-none" {...props} />,
    td: (props) => <td className="p-3 border-none" {...props} />,
    hr: () => null,
    pre: ({ children }) => <>{children}</>,
    blockquote: (props) => (
      <blockquote 
        style={{ 
          borderLeft: `4px solid ${cardStyle.blockquoteBorderColor || cardStyle.accentColor}`, 
          backgroundColor: cardStyle.blockquoteBackgroundColor,
          color: cardStyle.textColor,
          fontSize: 'inherit'
        }} 
        className="pl-4 py-2 my-4 italic opacity-90 rounded-r-lg rounded-bl-sm [&>p:last-child]:mb-0 [&>p:first-child]:mt-0 wrap-break-word before:content-none after:content-none [&_p]:before:content-none [&_p]:after:content-none" 
        {...props} 
      />
    ),
    a: (props) => <a style={{color: cardStyle.accentColor}} className="underline decoration-auto underline-offset-2 break-all" {...props} />,
    img: (props: MarkdownComponentProps) => {
      const { src, alt } = props as { src?: string, alt?: string };
      if (src === 'spacer' || src?.startsWith('spacer?')) {
        const spacerId = src.includes('id=') ? src.split('id=')[1] : null;
        return (
          <div 
            data-spacer-id={spacerId}
            className="w-full h-48 bg-transparent my-4 pointer-events-none" 
          />
        );
      }
      let imgWidth: string | undefined;
      let cleanSrc = src;
      if (src && src.includes('#width=')) {
        const parts = src.split('#width=');
        cleanSrc = parts[0];
        imgWidth = parts[1];
      }
      return (
        <img 
          src={cleanSrc} 
          alt={alt as string || ''} 
          crossOrigin="anonymous"
          className="markdown-image"
          style={{ 
            display: 'block',
            maxWidth: '100%', 
            width: imgWidth || 'auto',
            borderRadius: '8px',
            marginTop: '1rem',
            marginBottom: '1rem'
          }} 
          {...props} 
        />
      );
    },
    code: ({ children, ...props }) => {
      const text = String(children ?? '');
      return !text.includes('\n') ? (
        <code style={{ backgroundColor: cardStyle.codeBackgroundColor }} className="rounded px-1.5 py-0.5 text-[0.9em] font-mono border-none" {...props}>
          {children}
        </code>
      ) : (
        <code style={{ backgroundColor: cardStyle.codeBackgroundColor, fontSize: '0.8em' }} className="block rounded-lg p-4 font-mono my-4 overflow-x-auto whitespace-pre-wrap wrap-break-word border-none" {...props}>
          {children}
        </code>
      );
    }
  }), [cardStyle]);

  return (
    <div 
      style={{ 
        width: width * scale, 
        height: cardStyle.autoHeight ? 'auto' : height * scale,
        transition: draggingId ? 'none' : 'all 0.3s ease'
      }} 
      className="relative shrink-0"
    >
      <div 
        style={{ 
          width: width, 
          height: cardStyle.autoHeight ? 'auto' : height,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          transition: draggingId ? 'none' : 'transform 0.3s ease'
        }}
      >
        <motion.div
          ref={cardRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`relative shadow-2xl flex flex-col shrink-0 group select-none ${isResetting && !draggingId ? 'transition-all duration-1000 ease-in-out' : ''}`}
          style={outerStyle}
          id={`card-${index}`}
          onMouseDown={(e) => {
            // Only deselect if we click exactly on the card background, not on images or toolbars
            if (e.target === e.currentTarget) {
              setSelectedImageId(null);
            }
          }}
        >
          {renderOuterBackground()}

          <div 
            ref={contentRef}
            className={`relative w-full h-full flex flex-col ${isResetting && !draggingId ? 'transition-all duration-1000 ease-in-out' : ''}`}
            style={innerStyle}
            onMouseDown={(e) => {
              // Also allow deselection when clicking the inner container background
              if (e.target === e.currentTarget) {
                setSelectedImageId(null);
              }
            }}
          >
            {renderInnerBackground()}

            {cardStyle.template === 'default' && (
              <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-pink-400 to-orange-300 blur-3xl opacity-20 z-0 pointer-events-none" />
            )}
            
            <div className="relative z-10 h-full flex flex-col pointer-events-none">
              <div 
                className="prose prose-sm max-w-none flex-1 pointer-events-auto overflow-hidden wrap-break-word [&>*:first-child]:mt-0 prose-hr:hidden prose-blockquote:before:content-none prose-blockquote:after:content-none prose-blockquote:border-none **:border-none !prose-quotes-none"
                onMouseDown={(e) => {
                  // If clicking on prose text area, deselect image
                  if (e.target === e.currentTarget || (e.target as HTMLElement).tagName === 'P' || (e.target as HTMLElement).tagName === 'DIV') {
                    setSelectedImageId(null);
                  }
                }}
                style={{ 
                padding: 0,
                maxHeight: cardStyle.autoHeight ? 'none' : '100%',
                fontFamily: 'inherit',
                fontSize: `${cardStyle.fontSize}px`
              }}
              >
                {/* Custom CSS Injection */}
                {/* Alignment class styles for secure text alignment */}
                <style dangerouslySetInnerHTML={{ __html: `
                  .align-left { display: block; text-align: left; }
                  .align-center { display: block; text-align: center; }
                  .align-right { display: block; text-align: right; }
                ` }} />
                {cardStyle.customCSS && (
                  <style dangerouslySetInnerHTML={{ __html: cardStyle.customCSS }} />
                )}
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkBreaks]}
                  rehypePlugins={[
                    rehypeRaw,
                    [rehypeSanitize, {
                      ...defaultSchema,
                      tagNames: [
                        ...(defaultSchema.tagNames || []),
                        'u', 'center', 'strike', 'font', 'big', 'small'
                      ],
                      attributes: {
                        ...(defaultSchema.attributes || {}),
                        '*': [
                          ...(defaultSchema.attributes?.['*'] || []),
                          'className', 'class', 'id'
                          // 'style' removed for security - prevents CSS injection
                        ],
                        'font': ['color', 'size', 'face']
                      }
                    }]
                  ]}
                  components={components}
                >
                  {processedContent}
                </ReactMarkdown>
              </div>
            </div>

            {/* Footer: Watermark and Page Number (Absolute Positioned in Bottom Padding Area) */}
            {(cardStyle.watermark?.enabled || cardStyle.pageNumber?.enabled) && (
              <div 
                className="absolute left-0 right-0 bottom-0 flex items-center pointer-events-none z-20"
                style={{
                  height: `${cardStyle.cardPadding.bottom}px`,
                  paddingLeft: `${cardStyle.cardPadding.left}px`,
                  paddingRight: `${cardStyle.cardPadding.right}px`,
                }}
              >
                {/* Left Position */}
                <div className="flex-1 flex justify-start items-center gap-3">
                  {cardStyle.pageNumber?.enabled && cardStyle.pageNumber.position === 'left' && (
                    <span style={{ 
                      opacity: cardStyle.pageNumber.opacity, 
                      fontSize: `${cardStyle.pageNumber.fontSize}px`,
                      color: cardStyle.pageNumber.color || cardStyle.textColor,
                      fontFamily: 'inherit',
                      fontWeight: 'bold'
                    }}>
                      {index + 1}
                    </span>
                  )}
                  {cardStyle.watermark?.enabled && cardStyle.watermark.position === 'left' && (
                    <span style={{ 
                      opacity: cardStyle.watermark.opacity, 
                      fontSize: `${cardStyle.watermark.fontSize}px`,
                      color: cardStyle.watermark.color || cardStyle.textColor,
                      fontFamily: 'inherit',
                      textTransform: cardStyle.watermark.uppercase ? 'uppercase' : 'none',
                      letterSpacing: '0.05em'
                    }}>
                      {cardStyle.watermark.content}
                    </span>
                  )}
                </div>

                {/* Center Position */}
                <div className="flex-1 flex justify-center items-center gap-3">
                  {cardStyle.pageNumber?.enabled && cardStyle.pageNumber.position === 'center' && (
                    <span style={{ 
                      opacity: cardStyle.pageNumber.opacity, 
                      fontSize: `${cardStyle.pageNumber.fontSize}px`,
                      color: cardStyle.pageNumber.color || cardStyle.textColor,
                      fontFamily: 'inherit',
                      fontWeight: 'bold'
                    }}>
                      {index + 1}
                    </span>
                  )}
                  {cardStyle.watermark?.enabled && cardStyle.watermark.position === 'center' && (
                    <span style={{ 
                      opacity: cardStyle.watermark.opacity, 
                      fontSize: `${cardStyle.watermark.fontSize}px`,
                      color: cardStyle.watermark.color || cardStyle.textColor,
                      fontFamily: 'inherit',
                      textTransform: cardStyle.watermark.uppercase ? 'uppercase' : 'none',
                      letterSpacing: '0.05em'
                    }}>
                      {cardStyle.watermark.content}
                    </span>
                  )}
                </div>

                {/* Right Position */}
                <div className="flex-1 flex justify-end items-center gap-3">
                  {cardStyle.pageNumber?.enabled && cardStyle.pageNumber.position === 'right' && (
                    <span style={{ 
                      opacity: cardStyle.pageNumber.opacity, 
                      fontSize: `${cardStyle.pageNumber.fontSize}px`,
                      color: cardStyle.pageNumber.color || cardStyle.textColor,
                      fontFamily: 'inherit',
                      fontWeight: 'bold'
                    }}>
                      {index + 1}
                    </span>
                  )}
                  {cardStyle.watermark?.enabled && cardStyle.watermark.position === 'right' && (
                    <span style={{ 
                      opacity: cardStyle.watermark.opacity, 
                      fontSize: `${cardStyle.watermark.fontSize}px`,
                      color: cardStyle.watermark.color || cardStyle.textColor,
                      fontFamily: 'inherit',
                      textTransform: cardStyle.watermark.uppercase ? 'uppercase' : 'none',
                      letterSpacing: '0.05em'
                    }}>
                      {cardStyle.watermark.content}
                    </span>
                  )}
                </div>
              </div>
            )}

            {isSnapX && (
              <div 
                className="absolute top-0 bottom-0 w-px bg-blue-500/50 z-100 pointer-events-none"
                style={{ 
                  height: '100%', 
                  left: `${centerX}px`, 
                  transform: 'translateX(-0.5px)' 
                }}
              />
            )}

            {/* Images Layer */}
            <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
              {images.filter(img => img.src && img.src.length > 0).map((image) => (
                <Rnd
                  key={image.id}
                  size={{ width: image.width, height: image.height }}
                  position={{ x: image.x, y: image.y }}
                  onDragStart={() => {
                    setDraggingId(image.id);
                    // Detach from spacer when user starts dragging manually
                    if (image.isAttachedToSpacer) {
                      updateCardImage(index, image.id, { isAttachedToSpacer: false });
                    }
                  }}
                  onDrag={(_e, d) => {
                      const imageCenterX = d.x + (image.width / 2);
                      
                      let newX = d.x;
                      const isSnapped = Math.abs(imageCenterX - centerX) < 10;
                      
                      if (isSnapped) {
                        newX = centerX - (image.width / 2);
                      }
                      
                      updateCardImage(index, image.id, { x: newX, y: d.y });
                      setIsSnapX(isSnapped);
                    }}
                    onDragStop={(_e, d) => {
                      setDraggingId(null);
                      setIsSnapX(false);
                      
                      const imageCenterX = d.x + (image.width / 2);
                      
                      const finalX = Math.abs(imageCenterX - centerX) < 10 
                        ? centerX - (image.width / 2) 
                        : d.x;
                      
                      updateCardImage(index, image.id, { x: finalX, y: d.y });
                    }}
                  onResizeStart={() => setDraggingId(image.id)}
                  onResize={(_e, _direction, ref, _delta, position) => {
                    const newWidth = parseInt(ref.style.width);
                    const newHeight = parseInt(ref.style.height);
                    
                    if (image.resizeMode === 'none') {
                      // Real-time crop compensation
                      const dx = position.x - image.x;
                      const dy = position.y - image.y;
                      
                      updateCardImage(index, image.id, {
                        width: newWidth,
                        height: newHeight,
                        x: position.x,
                        y: position.y,
                        crop: {
                          ...image.crop,
                          x: (image.crop.x || 0) - dx,
                          y: (image.crop.y || 0) - dy
                        }
                      });
                    } else {
                      updateCardImage(index, image.id, {
                        width: newWidth,
                        height: newHeight,
                        ...position,
                      });
                    }
                  }}
                  onResizeStop={() => {
                    setDraggingId(null);
                  }}
                  bounds="parent"
                  className={`pointer-events-auto ${selectedImageId === image.id ? 'z-30' : 'z-20'}`}
                  enableResizing={selectedImageId === image.id}
                  lockAspectRatio={image.resizeMode === 'contain'}
                >
                  <div 
                    className={`relative w-full h-full group cursor-move ${selectedImageId === image.id ? 'ring-2 ring-blue-500 bg-blue-500/5' : ''}`}
                    onMouseDown={() => {
                      setSelectedImageId(image.id);
                    }}
                  >
                    <div className="w-full h-full overflow-hidden rounded-sm pointer-events-none">
                      <img
                          src={image.src}
                          alt=""
                          className="max-w-none"
                          style={{
                            width: image.resizeMode === 'none' ? 'auto' : '100%',
                            height: image.resizeMode === 'none' ? 'auto' : '100%',
                            objectFit: image.resizeMode === 'none' ? undefined : image.resizeMode,
                            transform: image.resizeMode === 'none' 
                              ? `translate(${image.crop.x}px, ${image.crop.y}px) scale(${image.crop.scale})`
                              : `scale(${image.crop.scale})`,
                            transformOrigin: '0 0',
                          }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.opacity = '0';
                          }}
                        />
                      </div>
                      
                      {selectedImageId === image.id && (
                        <>
                          {/* Image Toolbar */}
                          <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-xl shadow-xl border border-black/5 dark:border-white/10 z-60 pointer-events-auto export-ignore">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateCardImage(index, image.id, { resizeMode: 'cover', crop: { x: 0, y: 0, scale: 1 } });
                              }}
                              className={`p-1.5 rounded-lg transition-colors ${image.resizeMode === 'cover' ? 'bg-blue-500 text-white' : 'hover:bg-black/5 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400'}`}
                              title="Cover"
                            >
                              <Square size={16} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const ratio = (image.naturalHeight || 1) / (image.naturalWidth || 1);
                                updateCardImage(index, image.id, { 
                                  resizeMode: 'contain', 
                                  height: image.width * ratio,
                                  crop: { x: 0, y: 0, scale: 1 } 
                                });
                              }}
                              className={`p-1.5 rounded-lg transition-colors ${image.resizeMode === 'contain' ? 'bg-blue-500 text-white' : 'hover:bg-black/5 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400'}`}
                              title="Contain (Keep Ratio)"
                            >
                              <Maximize2 size={16} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateCardImage(index, image.id, { resizeMode: 'fill', crop: { x: 0, y: 0, scale: 1 } });
                              }}
                              className={`p-1.5 rounded-lg transition-colors ${image.resizeMode === 'fill' ? 'bg-blue-500 text-white' : 'hover:bg-black/5 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400'}`}
                              title="Fill"
                            >
                              <StretchHorizontal size={16} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                // Calculate initial scale to match current visual size
                                const naturalWidth = image.naturalWidth || image.width;
                                const initialScale = image.width / naturalWidth;
                                
                                updateCardImage(index, image.id, { 
                                  resizeMode: 'none',
                                  crop: { 
                                    ...image.crop, 
                                    scale: initialScale,
                                    x: 0, 
                                    y: 0 
                                  } 
                                });
                              }}
                              className={`p-1.5 rounded-lg transition-colors ${image.resizeMode === 'none' ? 'bg-blue-500 text-white' : 'hover:bg-black/5 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400'}`}
                              title="Crop Mode (Figma Style)"
                            >
                              <Crop size={16} />
                            </button>
                            <div className="w-px h-4 bg-black/10 dark:bg-white/10 mx-1" />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeCardImage(index, image.id);
                                setSelectedImageId(null);
                              }}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                      </>
                    )}
                  </div>
                </Rnd>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
});

Card.displayName = 'Card';

export const Preview = () => {
  const { markdown, setIsScrolled, setActiveCardIndex, cardStyle, isEditorOpen, isSidebarOpen, previewZoom, setPreviewZoom } = useStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const { width, height } = getCardDimensions(cardStyle);
  
  // Window size state for responsive scaling
  const [windowSize, setWindowSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  
  useEffect(() => {
    const handleResize = () => setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const autoScale = useMemo(() => {
    const isDesktop = windowSize.w >= 1024;
    const editorSpace = (isDesktop && isEditorOpen) ? 448 : 40;
    const sidebarSpace = (isDesktop && isSidebarOpen) ? 398 : 40;
    const horizontalOccupied = editorSpace + sidebarSpace;
    const verticalSpace = 180;
    const availableWidth = Math.max(300, windowSize.w - horizontalOccupied);
    const availableHeight = Math.max(300, windowSize.h - verticalSpace);
    const wScale = availableWidth / width;
    const hScale = availableHeight / height;
    let s = cardStyle.autoHeight ? Math.min(wScale, 1) : Math.min(wScale, hScale, 1);
    if (s < 0.2) s = 0.2;
    return s;
  }, [width, height, isEditorOpen, isSidebarOpen, cardStyle.autoHeight, windowSize]);

  const scale = previewZoom > 0 ? previewZoom : autoScale;

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if ((e.ctrlKey || e.metaKey) && scrollRef.current?.contains(e.target as Node)) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        const currentScale = previewZoom > 0 ? previewZoom : autoScale;
        setPreviewZoom(Math.max(0.2, Math.min(4, currentScale + delta)));
      }
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [previewZoom, autoScale, setPreviewZoom]);
  
  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        setIsScrolled(scrollRef.current.scrollTop > 20);
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
  
  const pages = cardStyle.layoutMode === 'long'
    ? [markdown] 
    : markdown.split(/\n\s*---\s*\n|^\s*---\s*$/m).filter(page => page.trim() !== '');

  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024;
  const paddingLeft = (isDesktop && isEditorOpen) ? '448px' : '2rem';
  const paddingRight = (isDesktop && isSidebarOpen) ? '398px' : '2rem';

  return (
    <div 
      ref={scrollRef}
      className="w-full h-full overflow-y-auto pt-24 flex flex-col items-center gap-12 custom-scrollbar pb-32 transition-all duration-300"
      style={{ paddingLeft, paddingRight }}
      onMouseDown={(e) => {
        // If clicking on the main scroll container (empty space), deselect image
        if (e.target === e.currentTarget) {
          setSelectedImageId(null);
        }
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
