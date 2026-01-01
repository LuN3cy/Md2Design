import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from '../store';

describe('Md2Design Store', () => {
  beforeEach(() => {
    const { resetCardStyle } = useStore.getState();
    resetCardStyle();
  });

  it('should update markdown content', () => {
    const { setMarkdown } = useStore.getState();
    setMarkdown('Hello World');
    expect(useStore.getState().markdown).toBe('Hello World');
  });

  it('should toggle theme', () => {
    const initialTheme = useStore.getState().theme;
    const { toggleTheme } = useStore.getState();
    toggleTheme();
    expect(useStore.getState().theme).not.toBe(initialTheme);
  });

  it('should toggle language', () => {
    const initialLang = useStore.getState().language;
    const { toggleLanguage } = useStore.getState();
    toggleLanguage();
    expect(useStore.getState().language).not.toBe(initialLang);
  });

  it('should update card style', () => {
    const { updateCardStyle } = useStore.getState();
    updateCardStyle({ borderRadius: 20 });
    expect(useStore.getState().cardStyle.borderRadius).toBe(20);
  });

  it('should reset card style and handle undo', () => {
    const { updateCardStyle, resetCardStyle, undoReset } = useStore.getState();
    updateCardStyle({ borderRadius: 20 });
    resetCardStyle();
    expect(useStore.getState().cardStyle.borderRadius).not.toBe(20);
    
    // Test undo
    undoReset();
    expect(useStore.getState().cardStyle.borderRadius).toBe(20);
  });
});
