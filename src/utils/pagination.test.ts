import { describe, it, expect } from 'vitest';
import { paginateMarkdown } from './pagination';
import { useStore } from '../store';

describe('Pagination Utility', () => {
  const defaultStyle = useStore.getState().cardStyle;

  it('should handle empty markdown', () => {
    const pages = paginateMarkdown('', defaultStyle);
    expect(pages).toHaveLength(1);
    expect(pages[0]).toBe('');
  });

  it('should split content by separator ---', () => {
    const markdown = 'Page 1\n\n---\n\nPage 2';
    const pages = paginateMarkdown(markdown, defaultStyle);
    expect(pages).toHaveLength(2);
    expect(pages[0].trim()).toBe('Page 1');
    expect(pages[1].trim()).toBe('Page 2');
  });

  it('should estimate pages for long content', () => {
    const longContent = Array(100).fill('Some text line.').join('\n');
    const pages = paginateMarkdown(longContent, { ...defaultStyle, height: 400 });
    expect(pages.length).toBeGreaterThan(1);
  });

  it('should handle tables correctly', () => {
    const tableContent = Array(50).fill('| Cell 1 | Cell 2 |').join('\n');
    const pages = paginateMarkdown(tableContent, { ...defaultStyle, height: 400 });
    expect(pages.length).toBeGreaterThan(1);
  });
});
