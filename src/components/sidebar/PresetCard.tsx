import { type CSSProperties, type ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import type { CardStyle } from '../../store';

export const PresetCard = ({
  content,
  index,
  style,
  getPreviewDimensions
}: {
  content: string;
  index: number;
  style: CardStyle;
  getPreviewDimensions: (style: CardStyle) => { width: number; height: number };
}) => {
  const base = getPreviewDimensions(style);

  const outerStyle: CSSProperties = {
    width: `${base.width}px`,
    height: `${base.height}px`,
    padding: style.enableBackground ? `${style.padding}px` : '0',
    background: 'transparent',
  };

  const innerStyle: CSSProperties = {
    fontFamily: style.fontFamily,
    backgroundColor: 'transparent',
    color: style.textColor,
    fontSize: `${style.fontSize}px`,
    borderRadius: `${style.borderRadius}px`,
    borderWidth: `${style.borderWidth}px`,
    borderColor: style.borderColor,
    boxShadow: style.shadowEnabled ? style.shadow : 'none',
    paddingTop: `${style.cardPadding?.top ?? style.contentPadding}px`,
    paddingRight: `${style.cardPadding?.right ?? style.contentPadding}px`,
    paddingBottom: `${style.cardPadding?.bottom ?? style.contentPadding}px`,
    paddingLeft: `${style.cardPadding?.left ?? style.contentPadding}px`,
  };

  const renderOuterBackground = () => {
    if (!style.enableBackground) return null;

    if (style.backgroundType === 'image' && style.backgroundImage) {
      return (
        <div className="absolute inset-0 overflow-hidden -z-10 rounded-none pointer-events-none">
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundImage: `url(${style.backgroundImage})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              transform: `translate(${style.backgroundConfig.x}px, ${style.backgroundConfig.y}px) scale(${style.backgroundConfig.scale})`,
              filter: `blur(${style.backgroundConfig.blur}px)`
            }}
          />
        </div>
      );
    }

    if (style.backgroundType === 'gradient') {
      return <div className="absolute inset-0 -z-10 pointer-events-none" style={{ background: style.backgroundValue }} />;
    }

    return <div className="absolute inset-0 -z-10 pointer-events-none" style={{ background: style.backgroundValue }} />;
  };

  const renderInnerBackground = () => {
    const type = style.cardBackgroundType || 'solid';
    const innerRadius = Math.max(0, style.borderRadius - style.borderWidth);
    const radiusStyle: CSSProperties = { borderRadius: `${innerRadius}px` };

    if (type === 'image' && style.cardBackgroundImage) {
      return (
        <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none" style={radiusStyle}>
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundImage: `url(${style.cardBackgroundImage})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              transform: `translate(${style.cardBackgroundConfig.x}px, ${style.cardBackgroundConfig.y}px) scale(${style.cardBackgroundConfig.scale})`,
              filter: `blur(${style.cardBackgroundConfig.blur}px)`
            }}
          />
        </div>
      );
    }

    if (type === 'gradient') {
      return <div className="absolute inset-0 -z-10 pointer-events-none" style={{ ...radiusStyle, background: style.cardGradientValue }} />;
    }

    return <div className="absolute inset-0 -z-10 pointer-events-none bg-current" style={{ ...radiusStyle, color: style.backgroundColor }} />;
  };

  return (
    <div className="relative shadow-2xl overflow-hidden flex flex-col shrink-0" style={outerStyle}>
      {renderOuterBackground()}

      <div className="relative w-full h-full flex flex-col overflow-hidden" style={innerStyle}>
        {renderInnerBackground()}

        {style.template === 'default' && (
          <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-pink-400 to-orange-300 blur-3xl opacity-20 z-0 pointer-events-none" />
        )}

        <div className="relative z-10 h-full flex flex-col">
          <div className="prose prose-sm max-w-none flex-1 overflow-hidden">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkBreaks]}
              components={{
                h1: ({ ...props }) => (
                  <div className="flex flex-col items-center mb-8 first:mt-0 mt-8">
                    <h1 style={{ color: style.h1Color || style.textColor }} className="text-3xl font-bold mb-2 text-center" {...props} />
                    <div className="h-1 w-24 rounded-full" style={{ backgroundColor: style.h1LineColor || style.accentColor }} />
                  </div>
                ),
                h2: ({ ...props }) => (
                  <div className="flex justify-center mb-6 mt-8 first:mt-0">
                    <h2
                      style={{
                        backgroundColor: style.h2BackgroundColor || style.accentColor,
                        color: style.h2Color || '#fff'
                      }}
                      className="text-lg font-bold px-4 py-1.5 shadow-md rounded-lg"
                      {...props}
                    />
                  </div>
                ),
                h3: ({ ...props }) => (
                  <h3
                    style={{
                      color: style.h3Color || style.textColor,
                      borderLeftColor: style.h3LineColor || style.accentColor
                    }}
                    className="text-xl font-bold mb-4 mt-6 first:mt-0 pl-3 border-l-4"
                    {...props}
                  />
                ),
                p: ({ ...props }) => (
                  <p style={{ color: style.textColor }} className="mb-4 leading-relaxed opacity-90 first:mt-0" {...props} />
                ),
                ul: ({ ...props }) => <ul style={{ color: style.textColor }} className="mb-4 list-disc list-outside pl-5 space-y-1" {...props} />,
                ol: ({ ...props }) => <ol style={{ color: style.textColor }} className="mb-4 list-decimal list-outside pl-5 space-y-1" {...props} />,
                li: ({ ...props }) => <li className="pl-1 marker:opacity-70 [&>p]:mb-2" {...props} />,
                table: ({ ...props }) => (
                  <div className="overflow-x-auto mb-6 rounded-lg border border-current opacity-90">
                    <table className="w-full text-left text-sm border-collapse" {...props} />
                  </div>
                ),
                thead: ({ ...props }) => <thead className="bg-black/5 dark:bg-white/10 font-semibold" {...props} />,
                tbody: ({ ...props }) => <tbody className="divide-y divide-current/10" {...props} />,
                tr: ({ ...props }) => <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors" {...props} />,
                th: ({ ...props }) => <th className="p-3 border-b border-current/20 whitespace-nowrap" {...props} />,
                td: ({ ...props }) => <td className="p-3 border-b border-current/10" {...props} />,
                pre: ({ children }) => <>{children}</>,
                blockquote: ({ ...props }) => (
                  <blockquote
                    style={{
                      borderLeftColor: style.blockquoteBorderColor,
                      backgroundColor: style.blockquoteBackgroundColor
                    }}
                    className="border-l-4 pl-4 py-2 my-4 italic opacity-90 rounded-r-lg rounded-bl-sm [&>p:last-child]:mb-0"
                    {...props}
                  />
                ),
                a: ({ ...props }) => <a style={{ color: style.accentColor }} className="underline decoration-auto underline-offset-2" {...props} />,
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
                code: ({ children, ...props }: { children?: ReactNode }) => {
                  const text = String(children ?? '');
                  return !text.includes('\n') ? (
                    <code style={{ backgroundColor: style.codeBackgroundColor }} className="rounded px-1.5 py-0.5 text-[0.9em] font-mono" {...props}>
                      {children}
                    </code>
                  ) : (
                    <code style={{ backgroundColor: style.codeBackgroundColor, fontSize: '0.8em' }} className="block rounded-lg p-4 font-mono my-4 overflow-x-auto whitespace-pre-wrap wrap-break-word" {...props}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {content}
            </ReactMarkdown>
          </div>

          <div
            className="shrink-0 w-full pt-2 flex items-center relative font-mono uppercase tracking-widest pointer-events-none text-[10px] h-8"
            style={{ opacity: style.watermark?.opacity ?? 0.6 }}
          >
            <div className="absolute left-0 flex items-center gap-4">
              {style.pageNumber?.enabled && style.pageNumber?.position === 'left' && <span className="font-bold">{index + 1}</span>}
              {style.watermark?.enabled && style.watermark?.position === 'left' && <span>{style.watermark?.content}</span>}
            </div>

            <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-4">
              {style.pageNumber?.enabled && style.pageNumber?.position === 'center' && <span className="font-bold">{index + 1}</span>}
              {style.watermark?.enabled && style.watermark?.position === 'center' && <span>{style.watermark?.content}</span>}
            </div>

            <div className="absolute right-0 flex items-center gap-4">
              {style.watermark?.enabled && style.watermark?.position === 'right' && <span>{style.watermark?.content}</span>}
              {style.pageNumber?.enabled && style.pageNumber?.position === 'right' && <span className="font-bold">{index + 1}</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
