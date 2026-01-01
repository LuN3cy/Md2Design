import { create } from 'zustand';
import { temporal } from 'zundo';
import { persist, createJSONStorage } from 'zustand/middleware';

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
  rotation: number;
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
    color?: string;
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
  addCardImage: (cardIndex: number, src: string, id?: string) => void;
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
  fontFamily: 'Inter',
  backgroundColor: '#ffffff',
  textColor: '#000000',
  accentColor: '#3b82f6',
  aspectRatio: '4:3',
  orientation: 'portrait',
  autoHeight: false,
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
      fontSize: 16,
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
    color: '' // Empty means use default text color
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
  addCardImage: (cardIndex, src, id) => set((state) => {
    const images = state.cardImages[cardIndex] || [];
    const newImage: CardImage = {
      id: id || crypto.randomUUID(),
      src,
      x: 50,
      y: 50,
      width: 200, // Default width
      height: 200, // Default height - will be adjusted by aspect ratio in render if needed, or by user
      rotation: 0,
      crop: { x: 0, y: 0, scale: 1 },
    };
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
        
        // Convert hex color to rgb for opacity handling if needed, 
        // but easier to just use hex and assume browser handles or user provides rgba.
        // Actually user provides hex color usually. We need to apply opacity.
        // Let's assume color is HEX.
        let r = 0, g = 0, b = 0;
        if (color.startsWith('#')) {
          const hex = color.substring(1);
          if (hex.length === 3) {
            r = parseInt(hex[0] + hex[0], 16);
            g = parseInt(hex[1] + hex[1], 16);
            b = parseInt(hex[2] + hex[2], 16);
          } else if (hex.length === 6) {
            r = parseInt(hex.substring(0, 2), 16);
            g = parseInt(hex.substring(2, 4), 16);
            b = parseInt(hex.substring(4, 6), 16);
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
  applyPreset: (style) => set({ cardStyle: JSON.parse(JSON.stringify(style)) }),

  isEditorOpen: true,
  setIsEditorOpen: (isOpen) => set({ isEditorOpen: isOpen }),
  isSidebarOpen: true,
  setIsSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),

  isExporting: false,
  setIsExporting: (isExporting) => set({ isExporting }),
    }),
    {
      name: 'md2card-storage',
      storage: createJSONStorage(() => localStorage),
      version: 3,
      migrate: (persistedState: unknown, version: number) => {
        const state = persistedState as Partial<AppState>;
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
        return state;
      },
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
        markdown: state.markdown,
        cardStyle: state.cardStyle,
        cardImages: state.cardImages,
        activeCardIndex: state.activeCardIndex,
        presets: state.presets,
        isEditorOpen: state.isEditorOpen,
        isSidebarOpen: state.isSidebarOpen,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    }
    ),
    {
      // Configure Zundo: only track changes to markdown and cardImages
      partialize: (state) => ({ 
        markdown: state.markdown,
        cardImages: state.cardImages 
      }),
      limit: 100, // Limit history size
    }
  )
);
