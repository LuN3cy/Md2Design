import { create } from 'zustand';
import { temporal } from 'zundo';
import { persist, createJSONStorage } from 'zustand/middleware';
import { getCardDimensions } from './utils/cardUtils';

export type CustomFont = {
  name: string;
  url: string;
  weight?: string; // 'normal' (400) or 'variable' (100 900)
};

export type CardImage = {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  naturalWidth?: number;
  naturalHeight?: number;
  rotation: number;
  resizeMode: 'cover' | 'contain' | 'fill' | 'none';
  spacerId?: string;
  isAttachedToSpacer?: boolean;
  crop: {
    x: number;
    y: number;
    scale: number;
  };
};

export type CardStyle = {
  fontFamily: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  aspectRatio: '1:1' | '4:3' | '3:2' | '16:9' | 'custom';
  orientation: 'portrait' | 'landscape';
  autoHeight: boolean;
  layoutMode: 'portrait' | 'landscape' | 'long' | 'flexible';
  width: number;
  height: number;
  borderRadius: number;
  
  // Border
  borderWidth: number;
  borderColor: string;

  // Background Fill
  enableBackground: boolean;
  backgroundType: 'solid' | 'gradient' | 'image';
  backgroundValue: string;
  // Gradient state for UI controls
  gradientStart: string;
  gradientEnd: string;
  gradientAngle: number;
  // Image state
  backgroundImage: string;
  backgroundConfig: {
    x: number;
    y: number;
    scale: number;
    blur: number;
  };
  
  padding: number;
  contentPadding: number;
  cardPadding: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  cardPaddingSync: boolean;

  customCSS: string;
  template: 'default'; // Simplified to just default
  fontSize: number;
  h1FontSize: number;
  h2FontSize: number;
  h3FontSize: number;
  headingScale: number;
  
  customFonts: CustomFont[];

  // Element Specific Styles
  // Card Background (Inner)
  cardBackgroundType: 'solid' | 'gradient' | 'image';
  cardGradientStart: string;
  cardGradientEnd: string;
  cardGradientAngle: number;
  cardGradientValue: string;
  cardBackgroundImage: string;
  cardBackgroundConfig: {
    x: number;
    y: number;
    scale: number;
    blur: number;
  };

  blockquoteBackgroundColor: string;
  blockquoteBorderColor: string;
  codeBackgroundColor: string;
  
  // Header Colors (Optional overrides, defaults to accent/text color logic)
  h1Color: string;
  h1LineColor: string;
  h2Color: string; // Text color for H2
  h2BackgroundColor: string; // Background for H2 pill
  h3Color: string;
  h3LineColor: string;
  underlineColor: string;
  strikethroughColor: string;

  // Shadow
  shadowEnabled: boolean;
  shadow: string; // Computed
  shadowConfig: {
    x: number;
    y: number;
    blur: number;
    spread: number;
    color: string;
    opacity: number;
  };

  // Watermark
  watermark: {
    enabled: boolean;
    content: string;
    position: 'left' | 'center' | 'right';
    opacity: number;
    fontSize: number;
    color: string;
    uppercase: boolean;
  };

  // Page Number
  pageNumber: {
    enabled: boolean;
    position: 'left' | 'center' | 'right';
    opacity: number;
    fontSize: number;
    color?: string;
  };
};

export type StylePreset = {
  id: string;
  name: string;
  style: CardStyle;
};

interface AppState {
  markdown: string;
  setMarkdown: (markdown: string) => void;
  
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  language: 'en' | 'zh';
  toggleLanguage: () => void;

  isScrolled: boolean;
  setIsScrolled: (isScrolled: boolean) => void;
  
  activeCardIndex: number;
  setActiveCardIndex: (index: number) => void;

  cardImages: Record<number, CardImage[]>;
  addCardImage: (cardIndex: number, src: string, id?: string, spacerId?: string) => void;
  updateCardImage: (cardIndex: number, imageId: string, updates: Partial<CardImage>) => void;
  removeCardImage: (cardIndex: number, imageId: string) => void;
  
  cardStyle: CardStyle;
  previousCardStyle: CardStyle | null;
  updateCardStyle: (style: Partial<CardStyle>) => void;
  resetCardStyle: () => void;
  undoReset: () => void;
  addCustomFont: (font: CustomFont) => void;

  isResetting: boolean;
  setIsResetting: (isResetting: boolean) => void;

  previewZoom: number; // 0 means auto-fit
  setPreviewZoom: (zoom: number) => void;

  presets: StylePreset[];
  savePreset: (name: string) => void;
  deletePreset: (id: string) => void;
  applyPreset: (style: CardStyle) => void;

  isEditorOpen: boolean;
  setIsEditorOpen: (isOpen: boolean) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;

  isExporting: boolean;
  setIsExporting: (isExporting: boolean) => void;

  // Naming rules for export
  namingMode: 'system' | 'custom';
  setNamingMode: (mode: 'system' | 'custom') => void;
  namingParts: ('prefix' | 'date' | 'custom' | 'number')[];
  setNamingParts: (parts: ('prefix' | 'date' | 'custom' | 'number')[]) => void;
  namingConfigs: {
    prefix: string;
    custom: string;
    includeTime: boolean;
    dateFormat: 'dateFormatFull' | 'dateFormatShort' | 'dateFormatMDY' | 'dateFormatDMY' | 'dateFormatYMD';
    numberType: 'arabic' | 'chinese';
    numberOrder: 'asc' | 'desc';
    zeroStart: boolean;
  };
  setNamingConfigs: (configs: Partial<AppState['namingConfigs']>) => void;
}

export const PRESET_GRADIENTS = [
  { start: '#a8ff78', end: '#78ffd6', name: 'Minty Fresh' },
  { start: '#E0C3FC', end: '#8EC5FC', name: 'Lavender Bliss' },
  { start: '#ff9a9e', end: '#fad0c4', name: 'Peach Sorbet' },
  { start: '#2193b0', end: '#6dd5ed', name: 'Cool Blues' },
  { start: '#ee9ca7', end: '#ffdde1', name: 'Cherry Blossom' },
  { start: '#d4dcdd', end: '#94b1cc', name: 'Default' },
  { start: '#f6d365', end: '#fda085', name: 'Spring Warmth' },
  { start: '#fccb90', end: '#d57eeb', name: 'Pastel Violet' },
];

const DEFAULT_MARKDOWN_EN = `# There should be a title

This is a **Markdown** to Card converter.

> Blockquotes are also supported.

\`\`\`javascript
console.log('Code blocks work too!');
\`\`\`

---

You can split content into multiple cards using three dashes.

- Feature 1
- Feature 2
- Feature 3`;

const DEFAULT_MARKDOWN_ZH = `# 此处应该有标题

这是一个 **Markdown** 转卡片工具。

> 引用也是支持的。

\`\`\`javascript
console.log('代码块也能完美显示！');
\`\`\`

---

使用三个横杠可以将内容分割成多张卡片。

- 功能 1
- 功能 2
- 功能 3`;

const INITIAL_CARD_STYLE: CardStyle = {
  fontFamily: 'GoogleSans-Regular',
  backgroundColor: '#ffffff',
  textColor: '#000000',
  accentColor: '#3b82f6',
  aspectRatio: '4:3',
  orientation: 'portrait',
  autoHeight: false,
  layoutMode: 'portrait',
  width: 800,
  height: 600,
  borderRadius: 24,
  borderWidth: 0,
  borderColor: '#000000',
  enableBackground: false,
  backgroundType: 'gradient',
  backgroundValue: 'linear-gradient(135deg, #d4dcdd 0%, #94b1cc 100%)',
  gradientStart: '#d4dcdd',
  gradientEnd: '#94b1cc',
  gradientAngle: 135,
  backgroundImage: '',
  backgroundConfig: {
    x: 0,
    y: 0,
    scale: 1,
    blur: 0
  },
  padding: 40,
  contentPadding: 24,
  cardPadding: {
    top: 32,
    right: 32,
    bottom: 32,
    left: 32
  },
  cardPaddingSync: true,
  customCSS: '',
      template: 'default',
  fontSize: 18,
  h1FontSize: 32,
  h2FontSize: 24,
  h3FontSize: 20,
  headingScale: 1.0,
      customFonts: [],

      cardBackgroundType: 'solid',
  cardGradientStart: '#ffffff',
  cardGradientEnd: '#f0f0f0',
  cardGradientAngle: 135,
  cardGradientValue: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
  cardBackgroundImage: '',
  cardBackgroundConfig: {
    x: 0,
    y: 0,
    scale: 1,
    blur: 0
  },
  blockquoteBackgroundColor: '#00000010',
  blockquoteBorderColor: '#3b82f6',
  codeBackgroundColor: '#00000010',
  h1Color: '#000000',
  h1LineColor: '#3b82f6',
  h2Color: '#ffffff',
  h2BackgroundColor: '#3b82f6',
  h3Color: '#000000',
  h3LineColor: '#3b82f6',
  underlineColor: '#3b82f6',
  strikethroughColor: '#000000',
  shadowEnabled: false,
  shadow: 'none',
  shadowConfig: {
    x: 2,
    y: 5,
    blur: 15,
    spread: 0,
    color: '#000000',
    opacity: 0.25
  },
  watermark: {
    enabled: false,
    content: 'Md2Design',
    position: 'center',
    opacity: 0.5,
    fontSize: 10,
    color: '', // Empty means use default text color
    uppercase: true
  },
  pageNumber: {
    enabled: false,
    position: 'center',
    opacity: 0.5,
    fontSize: 10,
    color: '' // Empty means use default text color
  }
};

export const useStore = create<AppState>()(
  temporal(
    persist(
      (set) => ({
  markdown: DEFAULT_MARKDOWN_ZH,
  setMarkdown: (markdown) => set({ markdown }),

  theme: 'light',
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    if (typeof document !== 'undefined') {
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    return { theme: newTheme };
  }),

  language: 'zh',
  toggleLanguage: () => set((state) => {
    const newLang = state.language === 'en' ? 'zh' : 'en';
    let newMarkdown = state.markdown;

    // Auto-switch demo text if current text matches one of the defaults
    // Normalizing newlines/whitespace for loose comparison might be needed, 
    // but strict check is safer to avoid overwriting user edits.
    if (state.markdown === DEFAULT_MARKDOWN_EN && newLang === 'zh') {
      newMarkdown = DEFAULT_MARKDOWN_ZH;
    } else if (state.markdown === DEFAULT_MARKDOWN_ZH && newLang === 'en') {
      newMarkdown = DEFAULT_MARKDOWN_EN;
    }

    return { 
      language: newLang,
      markdown: newMarkdown
    };
  }),

  isScrolled: false,
  setIsScrolled: (isScrolled) => set({ isScrolled }),

  activeCardIndex: 0,
  setActiveCardIndex: (index) => set({ activeCardIndex: index }),

  cardImages: {},
  addCardImage: (cardIndex, src, id, spacerId) => set((state) => {
    const images = state.cardImages[cardIndex] || [];
    
    // Create an image object to get natural dimensions
    const img = new Image();
    img.src = src;
    
    const newImage: CardImage = {
      id: id || crypto.randomUUID(),
      src,
      spacerId,
      isAttachedToSpacer: !!spacerId,
      x: 50,
      y: 50,
      width: 200, // Initial default, will be updated if possible
      height: 200,
      naturalWidth: 200,
      naturalHeight: 200,
      rotation: 0,
      resizeMode: 'cover',
      crop: { x: 0, y: 0, scale: 1 },
    };

    // If image is already loaded (from cache), or when it loads, we could update dimensions.
    // However, since this is a setter, we can't easily do async here without changing the store structure.
    // Let's assume the user will resize it anyway, or we can try to get dimensions if they're available.
    if (img.complete) {
      const { width: cardWidth } = getCardDimensions(state.cardStyle);
      const targetWidth = cardWidth * 0.7;
      const scale = targetWidth / img.naturalWidth;
      
      newImage.width = targetWidth;
      newImage.height = img.naturalHeight * scale;
      newImage.naturalWidth = img.naturalWidth;
      newImage.naturalHeight = img.naturalHeight;
    } else {
      img.onload = () => {
        const { width: cardWidth } = useStore.getState().cardStyle ? getCardDimensions(useStore.getState().cardStyle) : { width: 800 };
        const targetWidth = cardWidth * 0.7;
        const scale = targetWidth / img.naturalWidth;

        useStore.getState().updateCardImage(cardIndex, newImage.id, {
          width: targetWidth,
          height: img.naturalHeight * scale,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight
        });
      };
    }

    return {
      cardImages: {
        ...state.cardImages,
        [cardIndex]: [...images, newImage],
      },
    };
  }),
  updateCardImage: (cardIndex, imageId, updates) => set((state) => {
    const images = state.cardImages[cardIndex] || [];
    return {
      cardImages: {
        ...state.cardImages,
        [cardIndex]: images.map((img) =>
          img.id === imageId ? { ...img, ...updates } : img
        ),
      },
    };
  }),
  removeCardImage: (cardIndex, imageId) => set((state) => {
    const images = state.cardImages[cardIndex] || [];
    return {
      cardImages: {
        ...state.cardImages,
        [cardIndex]: images.filter((img) => img.id !== imageId),
      },
    };
  }),

  cardStyle: INITIAL_CARD_STYLE,
  previousCardStyle: null,
  updateCardStyle: (style) => set((state) => {
    // If updating shadow config, recompute shadow string
    const newStyle = { ...style };
    
    if (style.shadowConfig || style.shadowEnabled !== undefined) {
      const config = { ...state.cardStyle.shadowConfig, ...style.shadowConfig };
      const enabled = style.shadowEnabled !== undefined ? style.shadowEnabled : state.cardStyle.shadowEnabled;
      
      if (!enabled) {
        newStyle.shadow = 'none';
      } else {
        const { x, y, blur, spread, color, opacity } = config;
        
        // Parse color - support hex, rgb(), and rgba() formats
        let r = 0, g = 0, b = 0;
        
        if (color.startsWith('#')) {
          // Hex color
          if (color.length === 4) {
            r = parseInt(color[1] + color[1], 16);
            g = parseInt(color[2] + color[2], 16);
            b = parseInt(color[3] + color[3], 16);
          } else {
            r = parseInt(color.substring(1, 3), 16);
            g = parseInt(color.substring(3, 5), 16);
            b = parseInt(color.substring(5, 7), 16);
          }
        } else if (color.startsWith('rgb')) {
          // rgb() or rgba() - extract RGB values, ignore alpha (use our opacity instead)
          const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
          if (match) {
            r = parseInt(match[1], 10);
            g = parseInt(match[2], 10);
            b = parseInt(match[3], 10);
          }
        }
        
        newStyle.shadow = `${x}px ${y}px ${blur}px ${spread}px rgba(${r}, ${g}, ${b}, ${opacity})`;
      }
    }

    return {
      cardStyle: { ...state.cardStyle, ...newStyle }
    };
  }),
  resetCardStyle: () => set((state) => ({ 
    previousCardStyle: state.cardStyle,
    cardStyle: INITIAL_CARD_STYLE 
  })),
  undoReset: () => set((state) => {
    if (state.previousCardStyle) {
      return {
        cardStyle: state.previousCardStyle,
        previousCardStyle: null
      };
    }
    return state;
  }),
  addCustomFont: (font) => set((state) => ({
    cardStyle: {
      ...state.cardStyle,
      customFonts: [...state.cardStyle.customFonts, font]
    }
  })),

  isResetting: false,
  setIsResetting: (isResetting) => set({ isResetting }),

  previewZoom: 0,
  setPreviewZoom: (previewZoom) => set({ previewZoom }),

  presets: [],
  savePreset: (name) => set((state) => ({
    presets: [
      ...state.presets,
      {
        id: crypto.randomUUID(),
        name,
        style: JSON.parse(JSON.stringify(state.cardStyle)), // Deep clone
      }
    ]
  })),
  deletePreset: (id) => set((state) => ({
    presets: state.presets.filter((p) => p.id !== id)
  })),
  applyPreset: (style) => {
    const mergedStyle = {
      ...INITIAL_CARD_STYLE,
      ...style,
      watermark: { ...INITIAL_CARD_STYLE.watermark, ...(style.watermark || {}) },
      pageNumber: { ...INITIAL_CARD_STYLE.pageNumber, ...(style.pageNumber || {}) },
      backgroundConfig: { ...INITIAL_CARD_STYLE.backgroundConfig, ...(style.backgroundConfig || {}) },
      cardBackgroundConfig: { ...INITIAL_CARD_STYLE.cardBackgroundConfig, ...(style.cardBackgroundConfig || {}) },
      shadowConfig: { ...INITIAL_CARD_STYLE.shadowConfig, ...(style.shadowConfig || {}) },
      cardPadding: { ...INITIAL_CARD_STYLE.cardPadding, ...(style.cardPadding || {}) },
    };
    set({ cardStyle: JSON.parse(JSON.stringify(mergedStyle)) });
  },

  isEditorOpen: true,
  setIsEditorOpen: (isOpen) => set({ isEditorOpen: isOpen }),
  isSidebarOpen: true,
  setIsSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),

  isExporting: false,
  setIsExporting: (isExporting) => set({ isExporting }),

  namingMode: 'system',
  setNamingMode: (namingMode) => set({ namingMode }),
  namingParts: ['prefix', 'date', 'custom', 'number'],
  setNamingParts: (namingParts) => set({ namingParts }),
  namingConfigs: {
    prefix: 'Md2Design',
    custom: 'MyCard',
    includeTime: true,
    dateFormat: 'dateFormatFull',
    numberType: 'arabic',
    numberOrder: 'asc',
    zeroStart: false,
  },
  setNamingConfigs: (configs) => set((state) => ({
    namingConfigs: { ...state.namingConfigs, ...configs }
  })),
}),
    {
      name: 'md2card-storage',
      storage: createJSONStorage(() => localStorage),
      version: 6,
      migrate: (persistedState: unknown, version: number) => {
        if (!persistedState) return persistedState as AppState;
        const state = persistedState as AppState;

        // Ensure layoutMode exists if cardStyle exists (robustness check)
        if (state.cardStyle && !state.cardStyle.layoutMode) {
          let layoutMode: 'portrait' | 'landscape' | 'long' | 'flexible' = 'portrait';
          if (state.cardStyle.autoHeight) {
            layoutMode = 'long';
          } else if (state.cardStyle.orientation === 'landscape') {
            layoutMode = 'landscape';
          }
          state.cardStyle.layoutMode = layoutMode;
        }

        if (version === 0) {
          // Migration for v0 to v1: Add headingScale and contentPadding
          if (state.cardStyle) {
            state.cardStyle = {
              ...state.cardStyle,
              headingScale: state.cardStyle.headingScale ?? 1.0,
              contentPadding: state.cardStyle.contentPadding ?? 24,
            };
          }
        }
        if (version <= 1) {
          // Migration for v1 to v2: Add autoHeight and independent heading sizes
          if (state.cardStyle) {
            state.cardStyle = {
              ...state.cardStyle,
              autoHeight: state.cardStyle.autoHeight ?? false,
              h1FontSize: state.cardStyle.h1FontSize ?? 32,
              h2FontSize: state.cardStyle.h2FontSize ?? 24,
              h3FontSize: state.cardStyle.h3FontSize ?? 20,
            };
          }
        }
        if (version <= 2) {
          // Migration for v2 to v3: Add cardPadding and cardPaddingSync
          if (state.cardStyle) {
            state.cardStyle = {
              ...state.cardStyle,
              cardPadding: state.cardStyle.cardPadding ?? {
                top: state.cardStyle.contentPadding ?? 32,
                right: state.cardStyle.contentPadding ?? 32,
                bottom: state.cardStyle.contentPadding ?? 32,
                left: state.cardStyle.contentPadding ?? 32
              },
              cardPaddingSync: state.cardStyle.cardPaddingSync ?? true,
            };
          }
        }
        if (version <= 3) {
          // Migration for v3 to v4: Add watermark and pageNumber
          if (state.cardStyle) {
            state.cardStyle = {
              ...state.cardStyle,
              watermark: state.cardStyle.watermark ?? INITIAL_CARD_STYLE.watermark,
              pageNumber: state.cardStyle.pageNumber ?? INITIAL_CARD_STYLE.pageNumber,
            };
          }
        }
        if (version <= 4) {
          // Migration for v4 to v5: Add resizeMode to cardImages
          if (state.cardImages) {
            Object.keys(state.cardImages).forEach(key => {
              const cardIndex = parseInt(key, 10);
              state.cardImages[cardIndex] = state.cardImages[cardIndex].map((img: CardImage) => ({
                ...img,
                resizeMode: img.resizeMode ?? 'cover'
              }));
            });
          }
        }
        if (version <= 5) {
          // Migration for v5 to v6: Add layoutMode
          if (state.cardStyle) {
            let layoutMode: 'portrait' | 'landscape' | 'long' | 'flexible' = 'portrait';
            if (state.cardStyle.autoHeight) {
              layoutMode = 'long';
            } else if (state.cardStyle.orientation === 'landscape') {
              layoutMode = 'landscape';
            }
            state.cardStyle.layoutMode = layoutMode;
          }
        }
        if (version <= 6) {
          // Migration for v6 to v7: Add naming rules
          state.namingMode = state.namingMode ?? 'system';
          state.namingParts = state.namingParts ?? ['prefix', 'date', 'custom', 'number'];
          state.namingConfigs = state.namingConfigs ?? {
            prefix: 'Md2Design',
            custom: 'MyCard',
            includeTime: true,
            dateFormat: 'dateFormatFull',
            numberType: 'arabic',
            numberOrder: 'asc',
            zeroStart: false,
          };
        }
        return state;
      },
      partialize: (state) => {
        // Deep clone cardStyle to avoid mutating original state
        const cleanCardStyle = JSON.parse(JSON.stringify(state.cardStyle));
        // Remove base64 image data to prevent localStorage quota overflow
        if (cleanCardStyle.backgroundImage && cleanCardStyle.backgroundImage.startsWith('data:')) {
          cleanCardStyle.backgroundImage = '';
        }
        if (cleanCardStyle.cardBackgroundImage && cleanCardStyle.cardBackgroundImage.startsWith('data:')) {
          cleanCardStyle.cardBackgroundImage = '';
        }
        // Clean customFonts with inline base64 URLs
        if (cleanCardStyle.customFonts) {
          cleanCardStyle.customFonts = cleanCardStyle.customFonts.filter(
            (f: { url: string }) => !f.url.startsWith('data:')
          );
        }

        // Clean presets containing base64 data
        const cleanPresets = state.presets.map(preset => {
          const cleanStyle = JSON.parse(JSON.stringify(preset.style));
          if (cleanStyle.backgroundImage?.startsWith('data:')) cleanStyle.backgroundImage = '';
          if (cleanStyle.cardBackgroundImage?.startsWith('data:')) cleanStyle.cardBackgroundImage = '';
          
          // Also clean customFonts in presets
          if (cleanStyle.customFonts) {
            cleanStyle.customFonts = cleanStyle.customFonts.filter(
              (f: { url: string }) => !f.url.startsWith('data:')
            );
          }
          
          return { ...preset, style: cleanStyle };
        });

        return {
          theme: state.theme,
          language: state.language,
          markdown: state.markdown,
          cardStyle: cleanCardStyle,
          // cardImages removed - too large for localStorage
          activeCardIndex: state.activeCardIndex,
          presets: cleanPresets,
          isEditorOpen: state.isEditorOpen,
          isSidebarOpen: state.isSidebarOpen,
          namingMode: state.namingMode,
          namingParts: state.namingParts,
          namingConfigs: state.namingConfigs,
        };
      },
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        if (state.theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    }
    ),
    {
      // Configure Zundo: only track markdown changes (cardImages removed due to memory impact)
      partialize: (state) => ({ 
        markdown: state.markdown
        // cardImages removed - base64 data causes memory bloat in undo history
      }),
      limit: 100, // Limit history size
    }
  )
);
