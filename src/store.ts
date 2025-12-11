import { create } from 'zustand';
import { temporal } from 'zundo';

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
  width: number;
  height: number;
  borderRadius: number;
  
  // Border
  borderWidth: number;
  borderColor: string;

  // Background Fill
  enableBackground: boolean;
  backgroundType: 'solid' | 'gradient';
  backgroundValue: string;
  // Gradient state for UI controls
  gradientStart: string;
  gradientEnd: string;
  gradientAngle: number;
  
  padding: number;

  customCSS: string;
  template: 'default'; // Simplified to just default
  fontSize: number;
  
  customFonts: CustomFont[];

  // Element Specific Styles
  blockquoteBackgroundColor: string;
  blockquoteBorderColor: string;
  codeBackgroundColor: string;
  
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
  };

  // Page Number
  pageNumber: {
    enabled: boolean;
    position: 'left' | 'center' | 'right';
  };
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
  updateCardStyle: (style: Partial<CardStyle>) => void;
  addCustomFont: (font: CustomFont) => void;
}

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

export const useStore = create<AppState>()(
  temporal(
    (set) => ({
  markdown: DEFAULT_MARKDOWN_ZH,
  setMarkdown: (markdown) => set({ markdown }),

  theme: 'dark',
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
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

  cardStyle: {
    fontFamily: 'Inter',
    backgroundColor: '#ffffff',
    textColor: '#000000',
    accentColor: '#3b82f6',
    aspectRatio: '4:3',
    orientation: 'portrait',
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
    padding: 40,
    customCSS: '',
    template: 'default',
    fontSize: 16,
    customFonts: [],
    blockquoteBackgroundColor: '#00000010', // 10% opacity black
    blockquoteBorderColor: '#3b82f6', // same as accentColor default
    codeBackgroundColor: '#00000010', // 10% opacity black
    shadowEnabled: true,
    shadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', // default shadow-2xl equivalent
    shadowConfig: {
      x: 0,
      y: 25,
      blur: 5,
      spread: 0,
      color: '#000000',
      opacity: 0.25
    },
    watermark: {
      enabled: false,
      content: 'Md2Design',
      position: 'center',
      opacity: 0.1
    },
    pageNumber: {
      enabled: false,
      position: 'center'
    }
  },
  updateCardStyle: (style) => set((state) => {
    // If updating shadow config, recompute shadow string
    let newStyle = { ...style };
    
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
  addCustomFont: (font) => set((state) => ({
    cardStyle: {
      ...state.cardStyle,
      customFonts: [...state.cardStyle.customFonts, font]
    }
  })),
    }),
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
