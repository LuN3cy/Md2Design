import type { CardStyle } from '../store';
import { getCardDimensions } from './cardUtils';

/**
 * Estimates the height of a markdown block based on current card styles.
 */
const estimateLineHeight = (line: string, nextLine: string | undefined, style: CardStyle, contentWidth: number, isFirst: boolean): number => {
  const fontSize = style.fontSize;
  const lineHeight = 1.5; // Slightly tighter for better space utilization
  const isCJK = /[\u4e00-\u9fa5]/.test(line);
  // More accurate character width estimation - reduce over-estimation for long lines
  const charWidthAvg = isCJK ? fontSize * 1.0 : fontSize * 0.52; 
  const charsPerLine = Math.floor(contentWidth / charWidthAvg) || 1;

  const trimmedLine = line.trim();
  if (trimmedLine === '') return 4;

  // Image height estimation (roughly 200px as defined in Preview.tsx spacer)
  if (trimmedLine.startsWith('![')) {
    return 220; 
  }

  // Headers
  if (line.startsWith('# ')) {
    const mt = isFirst ? 0 : 20;
    const mb = 16;
    return (fontSize * 2 * 1.4) + mt + mb;
  }
  if (line.startsWith('## ')) {
    const mt = isFirst ? 0 : 16;
    const mb = 12;
    return (fontSize * 1.5 * 1.4) + mt + mb;
  }
  if (line.startsWith('### ')) {
    const mt = isFirst ? 0 : 12;
    const mb = 8;
    return (fontSize * 1.25 * 1.4) + mt + mb;
  }

  // Quote
  if (line.startsWith('> ')) {
    const text = line.replace(/^> /, '');
    const wrapLines = Math.max(1, Math.ceil(text.length / charsPerLine));
    return (wrapLines * fontSize * lineHeight) + 6;
  }

  // List
  if (trimmedLine.match(/^[-*] /) || trimmedLine.match(/^\d+\. /)) {
    const text = trimmedLine.replace(/^[-*] |\d+\. /, '');
    const wrapLines = Math.max(1, Math.ceil(text.length / charsPerLine));
    const nextIsListItem = nextLine && (nextLine.trim().startsWith('-') || nextLine.trim().startsWith('*') || nextLine.trim().match(/^\d+\. /));
    const mb = nextIsListItem ? 2 : 8;
    return (wrapLines * fontSize * lineHeight) + mb;
  }

  // Table
  if (trimmedLine.startsWith('|')) {
    const wrapLines = Math.max(1, Math.ceil(line.length / charsPerLine));
    return (wrapLines * fontSize * lineHeight) + 8; // Extra for cell padding
  }

  // Code Block start/end
  if (trimmedLine.startsWith('```')) {
    return 20; // Padding for code block container
  }

  // Regular Paragraph line
  const wrapLines = Math.max(1, Math.ceil(line.length / charsPerLine));
  const nextIsEmpty = !nextLine || nextLine.trim() === '';
  const nextIsSpecial = nextLine && (nextLine.startsWith('#') || nextLine.startsWith('>') || nextLine.startsWith('-') || nextLine.startsWith('*') || nextLine.startsWith('|'));
  const mb = (nextIsEmpty || nextIsSpecial) ? 8 : 0;
  
  return (wrapLines * fontSize * lineHeight) + mb;
};

export const paginateMarkdown = (markdown: string, style: CardStyle): string[] => {
  const { width, height } = getCardDimensions(style);
  
  // Use a fixed base width for pagination calculation to prevent sudden height jumps when scaling
  const baseWidth = Math.min(width, 800); 
  // Calculate average horizontal padding
  const horizontalPadding = style.cardPadding ? (style.cardPadding.left + style.cardPadding.right) : (style.contentPadding * 2);
  const contentWidth = baseWidth - (style.padding * 2) - horizontalPadding;
  
  // Calculate vertical padding
  const verticalPadding = style.cardPadding ? (style.cardPadding.top + style.cardPadding.bottom) : (style.contentPadding * 2);
  
  const hasFooter = style.pageNumber.enabled || style.watermark.enabled;
  const footerHeight = hasFooter ? 8 : 0; 
  
  // Scale maxContentHeight according to the ratio of actual width to base width if needed,
  // but for most cases, we want the pagination to be consistent.
  const maxContentHeight = height - (style.padding * 2) - verticalPadding - footerHeight;

  // 1. Split by manual separators first
  const manualPages = markdown.split(/\n\s*---\s*\n|^\s*---\s*$/m);
  const finalPages: string[] = [];

  for (const pageContent of manualPages) {
    if (pageContent.trim() === '' && manualPages.length > 1) continue;

    const lines = pageContent.split('\n');
    let currentPageLines: string[] = [];
    let currentHeight = 0;
    let isFirstInPage = true;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();
      
      if (trimmedLine === '' && isFirstInPage) continue;

      const h = estimateLineHeight(line, lines[i+1], style, contentWidth, isFirstInPage);

      if (currentHeight + h > maxContentHeight && currentPageLines.length > 0) {
        // Clean trailing empty lines
        while (currentPageLines.length > 0 && currentPageLines[currentPageLines.length - 1].trim() === '') {
          currentPageLines.pop();
        }
        finalPages.push(currentPageLines.join('\n').trim());
        currentPageLines = [line];
        currentHeight = h;
        isFirstInPage = true;
        if (trimmedLine === '') isFirstInPage = true;
        else isFirstInPage = false;
      } else {
        currentPageLines.push(line);
        currentHeight += h;
        if (trimmedLine !== '') isFirstInPage = false;
      }
    }

    if (currentPageLines.length > 0) {
      finalPages.push(currentPageLines.join('\n').trim());
    }
  }

  return finalPages.length > 0 ? finalPages : [''];
};
