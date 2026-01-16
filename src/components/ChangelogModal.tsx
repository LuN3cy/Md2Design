import { motion, AnimatePresence, useMotionValue, useAnimation } from 'framer-motion';
import { X, CheckCircle2, Sparkles, Monitor, ChevronRight, RotateCcw, Plus, Image as ImageIcon, Trash2, Maximize2, MessageSquare, ChevronDown, Check as CheckIcon, Layout, List, Square, Frame, ThumbsUp, Info, Github, Languages, Sun, StretchHorizontal, MousePointer2, Crop, CornerDownLeft } from 'lucide-react';
import { useTranslation } from '../i18n';
import { useStore } from '../store';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import { useState, useEffect, useMemo, useRef } from 'react';

interface ChangelogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PaddingIcon = ({ side }: { side: 'top' | 'right' | 'bottom' | 'left' | 'all' }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-70">
    <rect x="2.5" y="2.5" width="9" height="9" rx="1" stroke="currentColor" strokeOpacity="0.3" strokeDasharray="2 2" />
    {side === 'top' && <path d="M3 2H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
    {side === 'bottom' && <path d="M3 12H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
    {side === 'left' && <path d="M2 3V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
    {side === 'right' && <path d="M12 3V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
    {side === 'all' && <rect x="2.5" y="2.5" width="9" height="9" rx="1" stroke="currentColor" strokeWidth="1.5" />}
  </svg>
);

export const ChangelogModal = ({ isOpen, onClose }: ChangelogModalProps) => {
  const t = useTranslation();
  const { language } = useStore();
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  // Update data
  const updates = useMemo(() => [
    {
      version: 'v1.9.1',
      date: '2026-01-10',
      title: {
        en: 'Text Styling & Watermark Polish',
        zh: '文本样式修复与水印优化'
      },
      changes: {
        en: [
          '1. Fixed: Bold, Italic, and Strikethrough text now correctly apply the configured text color.',
          '2. Added: Independent color controls for Underline and Strikethrough text.',
          '3. Added: Underline shortcut button (<u>) in the editor toolbar.',
          '4. Added: Uppercase toggle for Watermark settings (allows disabling all-caps mode).',
          '5. UI: Improved color settings layout for better accessibility.',
          '6. Fixed: An issue where the watermark and page number might not display in the footer.',
        ],
        zh: [
          '1. 修复：加粗、斜体和删除线文本现在可以正确应用所选的颜色；',
          '2. 新增：下划线和删除线的独立颜色控制功能；',
          '3. 新增：编辑器工具栏下划线快捷按钮（支持 <u> 标签）；',
          '4. 新增：水印大小写开关，支持关闭强制大写模式；',
          '5. 优化：改进了侧边栏颜色设置的布局；',
          '6. 修复：水印和页码在卡片底部可能无法显示的问题。',
        ]
      }
    },
    {
      version: 'v1.9.0',
      date: '2026-01-08',
      title: {
        en: 'Flexible Layout Mode',
        zh: '新增“灵活”布局模式'
      },
      changes: {
        en: [
          '1. Added "Flexible" layout mode: Cards now automatically adjust their height based on content.',
          '2. Smart Pagination: Use "---" to split content into multiple cards with independent heights.',
          'Special thanks to anonymous user feedback.',
        ],
        zh: [
          '1. 新增“灵活”布局模式：卡片高度现在会根据内容自动收缩，告别固定比例限制；',
          '2. 智能分页支持：在灵活模式下使用 "---" 分隔符，可将长文拆分为多张高度自适应的独立卡片；',
          '本次更新感谢匿名用户的反馈。',
        ]
      },
      demo: 'v190-features'
    },
    {
      version: 'v1.8.5',
      date: '2026-01-08',
      title: {
        en: 'Flexible Spacing with Blank Lines',
        zh: '灵活的空行间距控制'
      },
      changes: {
        en: [
          '1. Added "Insert Blank Line" button to the toolbar for easier vertical spacing control.',
          '2. Fixed deployment issue related to unused variables.',
          '3. Enhanced interactive demo in changelog.',
          'Special thanks to anonymous user feedback.',
        ],
        zh: [
          '1. 新增工具栏“插入空行”按钮，轻松实现多行连空效果；',
          '2. 修复了由于未使用的变量导致的部署报错问题；',
          '3. 优化了更新日志的可交互功能演示。',
          '本次更新感谢匿名用户的反馈。',
        ]
      },
      demo: 'v185-features'
    },
    {
      version: 'v1.8.4',
      date: '2026-01-08',
      title: {
        en: 'Editor Layout & Alignment Polish',
        zh: '编辑器布局与对齐优化'
      },
      changes: {
        en: [
          '1. Added text alignment (center/left/right) and ordered list buttons.',
          '2. Optimized editor UI display.',
          '3. Special thanks to anonymous user feedback.',
        ],
        zh: [
          '1.新增文本居中/左右对齐排列编辑功能以及有序列表按钮；',
          '2.优化编辑器功能UI显示；',
          '3.本次更新感谢匿名用户的反馈。',
        ]
      },
      demo: 'v184-features'
    },
    {
      version: 'v1.8.3',
      date: '2026-01-06',
      title: {
        en: 'Advanced Image Control',
        zh: '进阶图片控制'
      },
      changes: {
        en: [
          'Four Image Editing Modes: Added "Fill", "Fit", "Crop", and "Stretch" modes. Crop mode allows freely adjusting the mask without scaling the image.',
          'Smart Image Snapping: Added 15px snap threshold for horizontal centering, ensuring pixel-perfect alignment during drag-and-drop.',
          'UI & Interaction: Enhanced image toolbar with intuitive icons and smart positioning; fixed text selection and visual artifacts in the editor.',
        ],
        zh: [
          '四种图片编辑模式：新增“填充(Fill)”、“等比缩放”、“裁切(Crop)”和“拉伸(Stretch)”模式。裁切模式下可自由调整蒙版，不再受比例限制。',
          '图片居中吸附：新增 15px 智能吸附阈值，拖拽图片靠近居中线时自动精准对齐，实现像素级排版。',
          '界面与交互优化：重构了图片工具栏图标与定位逻辑；修复了编辑器下的文本选择、空行点击及视觉瑕疵问题。',
        ]
      },
      demo: 'v183-features'
    },
    {
      version: 'v1.8.2',
      date: '2026-01-06',
      title: {
        en: 'Smart Snap & Page Stability',
        zh: '智能吸附 & 页面稳定性'
      },
      changes: {
        en: [
          'Enhanced Image Snapping: Redesigned centering snap logic with breakout support for professional editing experience.',
          'Zero-Drift Locking: Images now lock precisely on the center axis with zero jitter within the threshold.',
          'Problem Feedback: @迷迭香741910496',
        ],
        zh: [
          '智能图片吸附：重构居中吸附逻辑，支持“跳跃式脱离”，提供专业级的设计编辑体验。',
          '零抖动锁定：图片在吸附阈值内实现绝对静止锁定，彻底消除拖拽过程中的视觉抖动。',
          '问题反馈：@迷迭香741910496',
        ]
      }
    },
    {
      version: 'v1.8.1',
      date: '2026-01-02',
      title: {
        en: 'Support Page & Manual Input',
        zh: '赞赏页面 & 参数手动输入'
      },
      changes: {
        en: [
          'Brand new support/donation flow with dedicated QR codes and persistent tips.',
          'Manual input support: Click on any numeric parameter value to type precisely.',
        ],
        zh: [
          '全新的赞赏/打赏流程：新增专属收款码与常驻打赏提示框，支持作者不再迷路。',
          '参数手动输入：点击任意数值参数即可直接输入精确数值，告别滑动误差。',
        ]
      },
      demo: 'v181-features'
    },
    {
      version: 'v1.8.0',
      date: '2025-12-31',
      title: {
        en: 'Progressive Disclosure & More Fonts',
        zh: '渐进式披露 & 更多字体预设'
      },
      changes: {
        en: [
          'Progressive Disclosure: Redesigned the sidebar with "Advanced Options" toggles to keep the interface clean while maintaining power.',
          'More Font Presets: Added a "More Presets" dropdown that automatically indexes and injects fonts from the local /fonts folder.',
        ],
        zh: [
          '渐进式披露：重构侧边栏布局，通过“更多设置”折叠高级选项，保持界面简洁且不失功能深度。',
          '更多字体预设：新增“更多预设字体”下拉菜单，自动索引并注入本地 fonts 文件夹中的所有字体。',
        ]
      },
      demo: 'v180-features'
    },
    {
      version: 'v1.7.2',
      date: '2025-12-31',
      title: {
        en: 'Interactive Controls & UI Polish',
        zh: '交互式调节 & UI 细节打磨'
      },
      changes: {
        en: [
          'All-new Interaction: Numeric parameters now support direct drag-to-adjust on icons or values for a smoother experience.',
          'Border Integration: Perfectly unified border color and width controls with a compact layout and increased max width of 40px.',
          '4-Way Padding: Independent adjustment for top, right, bottom, and left padding of the card.',
          'Icon Redesign: Redrawn all parameter icons inspired by Figma, ensuring clarity even at small scales.',
        ],
        zh: [
          '全新交互：数值参数现在支持直接在图标或数值上左右滑动调节，操作更丝滑直观。',
          '边框整合：将边框颜色选择与宽度调节完美整合，布局更紧凑，最大宽度提升至 40px。',
          '四向内边距：支持对卡片的上下左右四个方向进行独立内边距调节。',
          '图标重绘：参考 Figma 风格重绘了所有参数图标，在小尺寸下依然清晰可辨。',
        ]
      },
      demo: 'v172-features'
    },
    {
      version: 'v1.7.1',
      date: '2025-12-30',
      title: {
        en: 'Enhanced Customization & Fixes',
        zh: '水印字号调整 & 问题修复'
      },
      changes: {
        en: [
          'Added font size adjustment for page numbers and watermarks',
          'Added opacity control for page numbers',
          'Improved blockquote styling: removed extra top spacing',
          'Enhanced editor: support for multi-line list selection and toggling',
          'Integrated Tauri build into deployment process',
        ],
        zh: [
          '新增页码和水印字号调整功能',
          '新增页码不透明度调节功能',
          '优化引用块样式：移除了顶部的多余空白',
          '增强编辑器：支持多行列表的同时选择与切换',
          '自动化部署：集成 Tauri 桌面端打包流程',
        ]
      },
      demo: 'v171-features'
    },
    {
      version: 'v1.7.0',
      date: '2025-12-29',
      title: {
        en: 'Smart Pagination & Long Image Mode',
        zh: '智能自动分页 & 长图模式'
      },
      changes: {
        en: [
          'Added "Auto Pagination" star button to toolbar for one-click content splitting',
          'New "Long Image" mode allows cards to grow vertically based on content',
          'Independent heading styles: customize font size and color for H1, H2, and H3',
          'Added preview zoom slider and support for Ctrl/Command+Scroll shortcut zoom',
          'Support for card padding adjustment',
          'Support for strikethrough syntax and new editor toolbar shortcuts',
          'Improved pagination algorithm with precise CJK character height estimation',
          'Enhanced semantic block splitting to minimize empty space in cards',
        ],
        zh: [
          '工具栏新增“自动分页”星形按钮，一键智能分割长文本',
          '新增“长图”模式，卡片长度随内容自动增长',
          '标题样式独立化：支持为 H1、H2、H3 分别设置字号、颜色及装饰线',
          '新增预览窗口缩放滑条，同时支持 Ctrl/Command+滚轮的快捷缩放',
          '支持卡片内边距调整',
          '支持删除线语法，并新增编辑器快捷工具',
          '优化分页算法：引入精确的中文字符高度估算，分页更精准',
          '增强语义化分块：基于块级元素进行分页，最大限度减少底部留白',
        ]
      },
      demo: 'v170-features'
    },
    {
      version: 'v1.6.0',
      date: '2025-12-28',
      title: {
        en: 'Custom Export & Smart Hints',
        zh: '自定义导出 & 智能提示'
      },
      changes: {
        en: [
          'Added onboarding tooltip to help users find the feedback and update entrance',
          'Overhauled export settings with brand new custom filename feature',
          'Support for multiple naming parts: Prefix, Date, Custom Name, and Number Order',
          'Drag-and-drop or use arrows to reorder filename segments',
          'New hover animations for feedback and changelog buttons',
          'Added ZIP archive export for better compatibility with system folders',
        ],
        zh: [
          '新增引导提示框，快速帮助用户找到更新反馈入口',
          '全面重构导出设置，新增全新的文件名自定义功能',
          '支持多维度命名：前缀、日期、自定义名称、数字顺序',
          '支持通过箭头或拖拽调整文件名各部分的先后顺序',
          '为意见反馈和更新日志按钮添加了动感的悬浮动画',
          '新增 ZIP 压缩包导出模式，完美解决系统文件夹导出权限问题',
        ]
      },
      demo: 'export-naming'
    },
    {
      version: 'v1.5.1',
      date: '2025-12-26',
      title: {
        en: 'Responsive Layout & Safe Zones',
        zh: '响应式布局 & 安全区域'
      },
      changes: {
        en: [
          'Fixed preview card overlap with editor/sidebar',
          'Added intelligent safe zone calculation',
          'Card automatically centers in available space',
          'Improved scaling logic for large dimensions',
        ],
        zh: [
          '修复了预览卡片与编辑器/侧边栏重叠的问题',
          '增加了智能安全区域计算',
          '卡片自动在剩余可用空间中居中显示',
          '优化了大尺寸卡片的缩放逻辑',
        ]
      },
      demo: 'responsive-layout'
    },
    {
      version: 'v1.5.0',
      date: '2025-12-26',
      title: {
        en: 'Style Presets & Gradients',
        zh: '样式预设 & 渐变系统'
      },
      changes: {
        en: [
          'Added style presets management (Save, Preview, Delete)',
          'Added 8 beautiful built-in gradient presets',
          'Persistent storage for all your custom styles',
          'Optimized default shadow effects',
        ],
        zh: [
          '增加样式预设管理功能（保存、预览、删除）',
          '内置 8 款清新好看的渐变预设',
          '所有自定义样式均支持持久化存储',
          '优化了默认的阴影视觉效果',
        ]
      },
      demo: 'presets-gradients'
    },
    {
      version: 'v1.4.1',
      date: '2025-12-25',
      title: {
        en: 'Markdown Hard Breaks',
        zh: 'Markdown 文本硬换行'
      },
      changes: {
        en: [
          'Added support for hard line breaks in Markdown editor (What You See Is What You Get)',
          'No need to add two spaces or <br> for line breaks',
          'Improved text rendering consistency between editor and card',
        ],
        zh: [
          '增加 Markdown 编辑器文本硬换行支持（所见即所得）',
          '无需添加两个空格或 <br> 标签即可换行',
          '优化了编辑器与卡片之间的文本渲染一致性',
        ]
      },
      demo: 'markdown-breaks'
    },
    {
      version: 'v1.4.0',
      date: '2025-12-24',
      title: {
        en: 'Reset Style Undo',
        zh: '样式重置撤回'
      },
      changes: {
        en: [
          'Added undo functionality after resetting styles',
          '10-second countdown for undo operation',
          'Redesigned reset notification toast',
        ],
        zh: [
          '增加了样式重置后的撤回功能',
          '撤回操作支持 10 秒倒计时',
          '重新设计了重置通知样式',
        ]
      },
      demo: 'reset-undo'
    },
    {
      version: 'v1.3.0',
      date: '2025-12-23',
      title: {
        en: 'Custom Background & Layout',
        zh: '自定义背景 & 布局优化'
      },
      changes: {
        en: [
          'Added support for custom background images',
          'Optimized slider parameter display (moved to right side)',
          'Fixed slider overflow layout issues',
          'Refactored side panel for better visibility',
        ],
        zh: [
          '增加自定义背景图片支持',
          '优化滑块参数显示（移至右侧独立显示）',
          '修复滑块溢出布局问题',
          '重构侧边栏以提高可见性',
        ]
      },
      demo: 'bg-layout'
    }
  ], []);

  const currentUpdate = updates.find(u => u.version === selectedVersion) || updates[0];

  // Group updates by minor version (e.g., v1.8.x under v1.8)
  const groupedUpdates = updates.reduce((acc, update) => {
    const versionParts = update.version.split('.');
    const minorVersion = `${versionParts[0]}.${versionParts[1]}`;
    if (!acc[minorVersion]) acc[minorVersion] = [];
    acc[minorVersion].push(update);
    return acc;
  }, {} as Record<string, typeof updates>);

  const minorVersions = Object.keys(groupedUpdates).sort((a, b) => {
    const aParts = a.slice(1).split('.').map(Number);
    const bParts = b.slice(1).split('.').map(Number);
    if (aParts[0] !== bParts[0]) return bParts[0] - aParts[0];
    return bParts[1] - aParts[1];
  });

  useEffect(() => {
    if (isOpen && !selectedVersion) {
      setTimeout(() => {
        setSelectedVersion(updates[0].version);
      }, 0);
    }
  }, [isOpen, selectedVersion, updates]);

  // Auto-expand group of selected version
  useEffect(() => {
    if (selectedVersion) {
      const versionParts = selectedVersion.split('.');
      const minorVersion = `${versionParts[0]}.${versionParts[1]}`;
      setTimeout(() => {
        setExpandedGroups(prev => ({ ...prev, [minorVersion]: true }));
      }, 0);
    }
  }, [selectedVersion]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-8"
        >
          {/* Standard Backdrop with Noise for Banding Prevention */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md"
            onClick={onClose}
          >
            {/* Subtle Noise Layer - Essential for preventing banding on gradients/blurs */}
            <div 
              className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
              }}
            />
          </motion.div>

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 20 }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 300
            }}
            className="relative w-full max-w-4xl h-[80vh] overflow-hidden rounded-3xl flex flex-col md:flex-row border border-white/20 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            style={{
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            }}
          >
            {/* Dark mode override for background - Pure color, no blobs */}
            <div className="absolute inset-0 bg-white/40 dark:bg-[#0a0a0a]/90 -z-10" />
            
            {/* Left Sidebar: Version List */}
            <div className="w-full md:w-64 shrink-0 bg-black/5 dark:bg-white/5 border-b md:border-b-0 md:border-r border-black/5 dark:border-white/5 flex flex-col">
               <div className="p-6 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles size={20} className="text-blue-500" />
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t.changelogTitle || "Updates"}</h2>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 opacity-80">Md2Card History</p>
               </div>
               
               <div className="flex-1 overflow-y-auto custom-scrollbar px-3 pb-4 space-y-1">
                  {minorVersions.map((minorVersion) => {
                    const group = groupedUpdates[minorVersion];
                    const isExpanded = expandedGroups[minorVersion];
                    const hasMultiple = group.length > 1;
                    const latestInGroup = group[0];
                    const isSelectedInGroup = selectedVersion?.startsWith(minorVersion);
                    
                    return (
                      <div key={minorVersion} className="space-y-1">
                        {/* Minor Version Header */}
                        <motion.button
                          whileHover={{ scale: 1.02, x: 5 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            if (hasMultiple) {
                              setExpandedGroups(prev => ({ ...prev, [minorVersion]: !prev[minorVersion] }));
                            } else {
                              setSelectedVersion(latestInGroup.version);
                            }
                          }}
                          className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center justify-between group ${
                            isSelectedInGroup && (!hasMultiple || !isExpanded)
                              ? 'bg-white dark:bg-white/10 shadow-md dark:shadow-black/40 border border-black/5 dark:border-white/10' 
                              : 'hover:bg-black/5 dark:hover:bg-white/5 border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {hasMultiple ? (
                              <ChevronDown 
                                size={14} 
                                className={`text-slate-400 transition-transform duration-200 ${isExpanded ? '' : '-rotate-90'}`} 
                              />
                            ) : (
                              <div className="w-3.5" />
                            )}
                            <div>
                              <div className={`text-sm font-bold ${isSelectedInGroup && (!hasMultiple || !isExpanded) ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                {minorVersion}.x
                              </div>
                              {(!isExpanded || !hasMultiple) && (
                                <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                                  {latestInGroup.date}
                                </div>
                              )}
                            </div>
                          </div>
                          {isSelectedInGroup && (!hasMultiple || !isExpanded) && (
                            <ChevronRight size={14} className="text-blue-500 opacity-100" />
                          )}
                        </motion.button>

                        {/* Patch Versions (Secondary Menu) */}
                        {hasMultiple && isExpanded && (
                          <div className="ml-4 pl-2 border-l border-black/5 dark:border-white/10 space-y-1 py-1">
                            {group.map((update) => (
                              <motion.button
                                key={update.version}
                                whileHover={{ x: 3, backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setSelectedVersion(update.version)}
                                className={`w-full text-left px-4 py-2.5 rounded-lg transition-all flex items-center justify-between group ${
                                  selectedVersion === update.version 
                                    ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' 
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5'
                                }`}
                              >
                                <div className="text-xs font-semibold">
                                  {update.version}
                                </div>
                                <div className="text-[9px] opacity-60 font-medium">
                                  {update.date.split('-').slice(1).join('/')}
                                </div>
                              </motion.button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
               </div>

               <div className="p-4 border-t border-black/5 dark:border-white/5 text-center md:text-left">
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                    Made with ❤️ by LuN3cy
                  </p>
               </div>
            </div>

            {/* Right Content: Details & Demo */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
               <button 
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white z-20"
                >
                  <X size={20} />
                </button>

               <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10">
                  <motion.div
                    key={currentUpdate.version}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-baseline gap-3 mb-6">
                      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                        {currentUpdate.version}
                      </h1>
                      <span className="text-sm font-medium px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/10">
                        {language === 'zh' ? '已发布' : 'Released'}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-6">
                      {language === 'zh' ? currentUpdate.title.zh : currentUpdate.title.en}
                    </h2>

                    <motion.div 
                      className="space-y-3 mb-10"
                      initial="hidden"
                      animate="visible"
                      variants={{
                        visible: {
                          transition: {
                            staggerChildren: 0.1
                          }
                        }
                      }}
                    >
                      {(language === 'zh' ? currentUpdate.changes.zh : currentUpdate.changes.en).map((change, i) => {
                        const isThanks = change.includes('感谢') || change.includes('thanks');
                        return (
                          <motion.div 
                            key={i} 
                            variants={{
                              hidden: { opacity: 0, x: -10 },
                              visible: { opacity: 1, x: 0 }
                            }}
                            whileHover={{ x: 5 }}
                            className={`flex items-start gap-3 leading-relaxed group cursor-default py-2 px-3 rounded-xl transition-all ${
                              isThanks 
                                ? 'bg-linear-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/10 text-blue-700 dark:text-blue-300 shadow-sm' 
                                : 'text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'
                            }`}
                          >
                            <div className={`mt-2 w-1.5 h-1.5 rounded-full shrink-0 transition-all ${
                              isThanks 
                                ? 'bg-blue-500 animate-pulse' 
                                : 'bg-blue-500/40 group-hover:bg-blue-500 group-hover:scale-125'
                            }`} />
                            <span className={`transition-colors ${
                              isThanks 
                                ? 'font-medium' 
                                : 'group-hover:text-slate-900 dark:group-hover:text-white'
                            }`}>
                              {change}
                            </span>
                          </motion.div>
                        );
                      })}
                    </motion.div>

                    {/* Interactive Demo Section */}
                    {currentUpdate.demo && (
                      <div className="border-t border-black/5 dark:border-white/5 pt-8">
                         <div className="flex items-center gap-2 mb-6">
                            <div className="p-1.5 bg-purple-500/10 rounded-lg text-purple-600 dark:text-purple-400">
                              <Monitor size={16} />
                            </div>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                              {language === 'zh' ? '功能演示' : 'Feature Demo'}
                            </h3>
                         </div>

                         {currentUpdate.demo === 'v190-features' && (
                           <div className="bg-slate-100 dark:bg-[#0a0a0a] rounded-2xl p-6 md:p-8 border border-black/5 dark:border-white/10 shadow-inner min-h-[400px] flex flex-col items-center gap-12">
                              <DemoFlexibleLayout />
                           </div>
                         )}

                         {currentUpdate.demo === 'v185-features' && (
                           <div className="bg-slate-100 dark:bg-[#0a0a0a] rounded-2xl p-6 md:p-8 border border-black/5 dark:border-white/10 shadow-inner min-h-[400px] flex flex-col items-center gap-12">
                              <DemoBlankLine />
                           </div>
                         )}

                         {currentUpdate.demo === 'v184-features' && (
                           <div className="bg-slate-100 dark:bg-[#0a0a0a] rounded-2xl p-6 md:p-8 border border-black/5 dark:border-white/10 shadow-inner min-h-[400px] flex flex-col items-center gap-12">
                              <DemoAlignmentAndList />
                           </div>
                         )}

                         {currentUpdate.demo === 'v183-features' && (
                           <div className="bg-slate-100 dark:bg-[#0a0a0a] rounded-2xl p-6 md:p-8 border border-black/5 dark:border-white/10 shadow-inner min-h-[400px] flex flex-col items-center gap-12">
                              <DemoImageModes />
                              <div className="w-full h-px bg-black/5 dark:bg-white/10" />
                              <DemoImageSnapping />
                           </div>
                         )}

                         {currentUpdate.demo === 'v181-features' && (
                           <div className="bg-slate-100 dark:bg-[#0a0a0a] rounded-2xl p-6 md:p-8 border border-black/5 dark:border-white/10 shadow-inner min-h-[400px] flex flex-col items-center gap-12">
                              <DemoManualInput />
                              <div className="w-full h-px bg-black/5 dark:bg-white/10" />
                              <DemoSupportFlow />
                           </div>
                         )}

                         {currentUpdate.demo === 'v180-features' && (
                           <div className="bg-slate-100 dark:bg-[#0a0a0a] rounded-2xl p-6 md:p-8 border border-black/5 dark:border-white/10 shadow-inner min-h-[400px] flex flex-col items-center gap-12">
                              <DemoProgressiveDisclosure />
                              <div className="w-full h-px bg-black/5 dark:bg-white/10" />
                              <DemoFontPresets />
                           </div>
                         )}

                         {currentUpdate.demo === 'v172-features' && (
                           <div className="bg-slate-100 dark:bg-[#0a0a0a] rounded-2xl p-6 md:p-8 border border-black/5 dark:border-white/10 shadow-inner min-h-[400px] flex flex-col items-center gap-12">
                              <DemoSliderIntegration />
                              <div className="w-full h-px bg-black/5 dark:bg-white/10" />
                              <DemoPaddingCustomization />
                           </div>
                         )}

                         {currentUpdate.demo === 'v171-features' && (
                           <div className="bg-slate-100 dark:bg-[#0a0a0a] rounded-2xl p-6 md:p-8 border border-black/5 dark:border-white/10 shadow-inner min-h-[400px] flex flex-col items-center gap-12">
                              <DemoFooterCustomization />
                              <div className="w-full h-px bg-black/5 dark:bg-white/10" />
                              <DemoMultiLineList />
                           </div>
                         )}

                         {currentUpdate.demo === 'v170-features' && (
                           <div className="bg-slate-100 dark:bg-[#0a0a0a] rounded-2xl p-6 md:p-8 border border-black/5 dark:border-white/10 shadow-inner min-h-[500px] flex flex-col items-center gap-12">
                              <DemoSmartPagination />
                              <div className="w-full h-px bg-black/5 dark:bg-white/10" />
                              <DemoAutoHeight />
                              <div className="w-full h-px bg-black/5 dark:bg-white/10" />
                              <DemoPreviewZoom />
                              <div className="w-full h-px bg-black/5 dark:bg-white/10" />
                              <DemoCardPadding />
                           </div>
                         )}

                         {currentUpdate.demo === 'export-naming' && (
                           <div className="bg-slate-100 dark:bg-[#0a0a0a] rounded-2xl p-6 md:p-8 border border-black/5 dark:border-white/5 shadow-inner min-h-[400px] flex flex-col items-center justify-center gap-8">
                              <DemoOnboardingHint />
                              <div className="w-full max-w-md h-px bg-black/5 dark:bg-white/5" />
                              <DemoExportNaming />
                           </div>
                         )}

                         {currentUpdate.demo === 'markdown-breaks' && (
                           <div className="bg-slate-100 dark:bg-[#0a0a0a] rounded-2xl p-4 md:p-6 border border-black/5 dark:border-white/5 shadow-inner">
                             <DemoMarkdown />
                           </div>
                         )}

                         {currentUpdate.demo === 'presets-gradients' && (
                           <div className="bg-slate-100 dark:bg-[#0a0a0a] rounded-2xl p-6 border border-black/5 dark:border-white/5 shadow-inner min-h-[300px] flex flex-col items-center justify-center gap-8">
                              <DemoPresets />
                           </div>
                         )}

                         {currentUpdate.demo === 'responsive-layout' && (
                           <div className="bg-slate-100 dark:bg-[#0a0a0a] rounded-2xl p-6 border border-black/5 dark:border-white/5 shadow-inner min-h-[300px] flex flex-col items-center justify-center gap-8">
                              <DemoResponsiveLayout />
                           </div>
                         )}
                         
                         {currentUpdate.demo === 'reset-undo' && (
                           <div className="bg-slate-100 dark:bg-[#0a0a0a] rounded-2xl p-8 border border-black/5 dark:border-white/5 shadow-inner flex items-center justify-center min-h-[200px] overflow-hidden relative">
                              <DemoResetUndo />
                           </div>
                         )}

                         {currentUpdate.demo === 'bg-layout' && (
                           <div className="bg-slate-100 dark:bg-[#0a0a0a] rounded-2xl p-8 border border-black/5 dark:border-white/5 shadow-inner flex flex-col items-center gap-12 justify-center min-h-[200px]">
                              <div className="flex flex-col md:flex-row items-center justify-center gap-12 w-full max-w-3xl">
                                 <DemoOldLayout />
                                 <div className="hidden md:block w-px h-32 bg-black/10 dark:bg-white/10 relative">
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-100 dark:bg-[#0a0a0a] px-2 py-1 rounded text-[10px] font-bold text-slate-400 uppercase tracking-wider">VS</div>
                                 </div>
                                 <DemoLayoutOpt />
                              </div>
                              <div className="w-full max-w-3xl h-px bg-black/5 dark:bg-white/5" />
                              <DemoBgImage />
                           </div>
                         )}
                      </div>
                    )}
                  </motion.div>
               </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const DemoFlexibleLayout = () => {
  const { language } = useStore();
  const [mode, setMode] = useState<'fixed' | 'flexible'>('flexible');
  const [content, setContent] = useState(language === 'zh' ? '第一张卡片内容\n---\n第二张较长的卡片内容，展示灵活高度如何自适应不同长度的文本。' : 'First card content\n---\nSecond longer card content, demonstrating how flexible height adapts to different text lengths.');

  const pages = content.split(/\n---\n/).filter(p => p.trim() !== '');
  
  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-xs font-bold text-slate-400 uppercase text-center">
        {language === 'zh' ? '灵活布局与智能分页演示' : 'Flexible Layout & Smart Pagination'}
      </div>

      <div className="flex flex-col gap-8 items-center">
        {/* Layout Toggle */}
        <div className="flex bg-white dark:bg-white/5 p-1 rounded-2xl border border-black/5 dark:border-white/10 shadow-sm">
          <button 
            onClick={() => setMode('fixed')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${mode === 'fixed' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400'}`}
          >
            {language === 'zh' ? '固定比例' : 'Fixed Ratio'}
          </button>
          <button 
            onClick={() => setMode('flexible')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${mode === 'flexible' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400'}`}
          >
            {language === 'zh' ? '灵活模式' : 'Flexible Mode'}
          </button>
        </div>

        {/* Multi-Card Preview Area */}
        <div className="w-full flex flex-col items-center gap-4 min-h-[300px] p-4 bg-slate-50 dark:bg-white/5 rounded-3xl border border-black/5 dark:border-white/5 overflow-hidden">
          <AnimatePresence mode="popLayout">
            {pages.map((page, index) => (
              <motion.div 
                key={index}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-48 bg-white dark:bg-[#151515] rounded-xl border border-black/10 dark:border-white/10 shadow-xl overflow-hidden flex flex-col shrink-0"
                style={{ 
                  height: mode === 'fixed' ? '200px' : 'auto',
                  minHeight: mode === 'flexible' ? '60px' : '200px'
                }}
              >
                <div className="p-3 flex-1">
                  <div className="w-6 h-1 bg-blue-500 rounded-full mb-2" />
                  <p className="text-[10px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    {page}
                  </p>
                </div>
                <div className="p-1.5 border-t border-black/5 dark:border-white/5 flex justify-center">
                  <div className="text-[8px] font-bold text-slate-300">PAGE {index + 1}</div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {mode === 'fixed' && pages.length > 1 && (
             <div className="text-[9px] font-bold text-amber-500 bg-amber-500/10 px-2 py-1 rounded-full animate-pulse">
               {language === 'zh' ? '固定比例模式下存在大量留白' : 'Large gaps in Fixed Ratio mode'}
             </div>
          )}
        </div>

        {/* Editor Mock */}
        <div className="w-full space-y-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Editor Content</span>
              <button 
                onClick={() => setContent(content + '\n---\n' + (language === 'zh' ? '新分页内容' : 'New Page Content'))}
                className="text-[10px] font-bold text-blue-500 hover:text-blue-600 flex items-center gap-1"
              >
                <Plus size={10} />
                {language === 'zh' ? '添加分页' : 'Add Page'}
              </button>
            </div>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-24 bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-4 py-3 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
              placeholder={language === 'zh' ? '输入 --- 进行分页...' : 'Use --- to split pages...'}
            />
          </div>
          <p className="text-[10px] text-slate-400 text-center leading-relaxed italic px-4">
            {language === 'zh' 
              ? '在“灵活”模式下，不仅高度自适应内容，还能通过 "---" 实现多卡片独立排版。' 
              : 'In "Flexible" mode, height adapts to content and "---" enables multi-card layouts.'}
          </p>
        </div>
      </div>
    </div>
  );
};

const DemoBlankLine = () => {
  const { language } = useStore();
  const [text, setText] = useState(language === 'zh' ? '第一行文本\n第二行文本' : 'First line\nSecond line');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const addBlankLine = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    const insert = '\n<br/>\n';
    const newText = text.substring(0, start) + insert + text.substring(end);

    setText(newText);
    
    // Use setTimeout to refocus and set cursor after React render
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + insert.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-xs font-bold text-slate-400 uppercase text-center mb-2">
        {language === 'zh' ? '空行间距演示' : 'Blank Line Spacing Demo'}
      </div>

      <div className="bg-white dark:bg-[#151515] p-6 rounded-3xl border border-black/5 dark:border-white/10 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-black/5 dark:border-white/5">
          <div className="text-sm font-bold text-slate-500">Editor</div>
          <button
            onMouseDown={(e) => { e.preventDefault(); addBlankLine(); }}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95"
          >
            <CornerDownLeft size={14} />
            {language === 'zh' ? '插入空行' : 'Insert Blank Line'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 h-48">
          <div className="flex flex-col gap-2">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Markdown</div>
            <textarea 
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="flex-1 bg-slate-50 dark:bg-white/5 rounded-xl p-3 text-xs font-mono resize-none focus:outline-none border border-black/5 dark:border-white/5"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Preview</div>
            <div className="flex-1 bg-slate-50 dark:bg-white/5 rounded-xl p-3 text-xs overflow-y-auto custom-scrollbar border border-black/5 dark:border-white/5">
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
                        // 'style' removed for security
                      ],
                      'font': ['color', 'size', 'face']
                    }
                  }]
                ]}
                components={{
                  p: ({...props}) => <p className="mb-4 last:mb-0" {...props} />
                }}
              >
                {text}
              </ReactMarkdown>
            </div>
          </div>
        </div>
        
        <div className="text-[10px] text-slate-400 text-center italic">
          {language === 'zh' ? '点击“插入空行”按钮观察预览区的垂直间距变化' : 'Click "Insert Blank Line" to see vertical spacing changes'}
        </div>
      </div>
    </div>
  );
};

const DemoAlignmentAndList = () => {
  const { language } = useStore();
  const [align, setAlign] = useState<'left' | 'center' | 'right'>('center');
  const [listType, setListType] = useState<'none' | 'bullet' | 'ordered'>('none');

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-xs font-bold text-slate-400 uppercase text-center mb-2">
        {language === 'zh' ? '对齐与列表排版演示' : 'Alignment & List Demo'}
      </div>

      <div className="bg-white dark:bg-[#151515] p-6 rounded-3xl border border-black/5 dark:border-white/10 shadow-xl space-y-6">
        {/* Mock Toolbar */}
        <div className="flex items-center justify-center gap-2 pb-4 border-b border-black/5 dark:border-white/5">
          <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
            {(['left', 'center', 'right'] as const).map((a) => (
              <button
                key={a}
                onClick={() => setAlign(a)}
                className={`p-2 rounded-lg transition-all ${align === a ? 'bg-white dark:bg-white/10 shadow-sm text-blue-500' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {a === 'left' ? <Layout className="rotate-0" size={16} /> : a === 'center' ? <Layout className="rotate-0" size={16} /> : <Layout className="rotate-0" size={16} />}
                {a === 'left' ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="17" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="17" y1="18" x2="3" y2="18"></line></svg>
                ) : a === 'center' ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="10" x2="6" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="18" y1="18" x2="6" y2="18"></line></svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="10" x2="7" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="7" y2="18"></line></svg>
                )}
              </button>
            ))}
          </div>

          <div className="w-px h-6 bg-black/5 dark:border-white/5" />

          <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
            <button
              onClick={() => setListType(listType === 'bullet' ? 'none' : 'bullet')}
              className={`p-2 rounded-lg transition-all ${listType === 'bullet' ? 'bg-white dark:bg-white/10 shadow-sm text-blue-500' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <List size={16} />
            </button>
            <button
              onClick={() => setListType(listType === 'ordered' ? 'none' : 'ordered')}
              className={`p-2 rounded-lg transition-all ${listType === 'ordered' ? 'bg-white dark:bg-white/10 shadow-sm text-blue-500' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <span className="text-[10px] font-bold">1.</span>
            </button>
          </div>
        </div>

        {/* Mock Content Area */}
        <div className="min-h-[120px] flex flex-col justify-center px-4">
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ textAlign: align }}
            className="space-y-2"
          >
            <motion.h4 layout className="text-sm font-bold text-slate-800 dark:text-slate-100">
              {language === 'zh' ? '实时预览效果' : 'Real-time Preview'}
            </motion.h4>
            
            <motion.div layout className="space-y-1.5">
              {listType === 'none' ? (
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {language === 'zh' 
                    ? '点击上方的对齐按钮或列表按钮，观察此段文字的变化。我们采用了全新的渲染逻辑，确保排版整洁无空行。' 
                    : 'Click the buttons above to see the magic. Our new rendering logic ensures a clean layout with no extra vertical space.'}
                </p>
              ) : (
                <div className={`text-xs text-slate-500 dark:text-slate-400 space-y-1 ${align === 'center' ? 'flex flex-col items-center' : align === 'right' ? 'flex flex-col items-end' : ''}`}>
                  {[1, 2, 3].map((i) => (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={i} 
                      className="flex items-center gap-2"
                    >
                      <span className="font-bold text-blue-500">{listType === 'bullet' ? '•' : `${i}.`}</span>
                      <span>{language === 'zh' ? `这是第 ${i} 个列表项目` : `List item number ${i}`}</span>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const DemoManualInput = () => {
  const { language } = useStore();
  const [val, setVal] = useState(20);

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="text-xs font-bold text-slate-400 uppercase text-center mb-2">
        {language === 'zh' ? '手动输入参数演示' : 'Manual Input Demo'}
      </div>
      <div className="bg-white dark:bg-[#151515] p-6 rounded-3xl border border-black/5 dark:border-white/10 shadow-xl space-y-4">
        <p className="text-[10px] text-slate-400 text-center leading-relaxed">
          {language === 'zh' ? '点击数值即可精确输入，左右拖拽图标仍可快速调节' : 'Click the value to type precisely, or drag the icon to adjust quickly'}
        </p>
        <div className="flex justify-center">
           <DraggableValue 
             label={language === 'zh' ? '外边距' : 'Margin'}
             value={val} 
             onChange={setVal}
             icon={<Maximize2 size={14} />}
           />
        </div>
      </div>
    </div>
  );
};

const DemoImageModes = () => {
  const { language } = useStore();
  const [mode, setMode] = useState<'cover' | 'contain' | 'none' | 'fill'>('cover');
  
  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-xs font-bold text-slate-400 uppercase text-center mb-2">
        {language === 'zh' ? '图片编辑模式演示' : 'Image Editing Modes Demo'}
      </div>

      <div className="flex flex-col gap-6 items-center">
        {/* Image Container Mock */}
        <div className="w-48 h-48 bg-white dark:bg-black/40 rounded-2xl border-2 border-blue-500/30 overflow-hidden relative group shadow-2xl">
           <motion.div 
             layout
             className="w-full h-full relative"
           >
              <img 
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80" 
                alt="Demo"
                className={`w-full h-full transition-all duration-500 ${
                  mode === 'cover' ? 'object-cover' : 
                  mode === 'contain' ? 'object-contain' : 
                  mode === 'fill' ? 'object-fill' : 
                  'object-none scale-150'
                }`}
              />
              
              {/* Overlay Grid for Crop Mode */}
              {mode === 'none' && (
                <div className="absolute inset-0 border-2 border-blue-500 pointer-events-none">
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className="border-[0.5px] border-blue-500/30" />
                    ))}
                  </div>
                </div>
              )}
           </motion.div>

           {/* Toolbar Mock */}
           <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-black/90 backdrop-blur-md px-2 py-1.5 rounded-xl border border-black/10 shadow-xl flex items-center gap-1">
              <button onClick={() => setMode('cover')} className={`p-1.5 rounded-lg ${mode === 'cover' ? 'bg-blue-500 text-white' : 'text-slate-400'}`}><Square size={14} /></button>
              <button onClick={() => setMode('contain')} className={`p-1.5 rounded-lg ${mode === 'contain' ? 'bg-blue-500 text-white' : 'text-slate-400'}`}><Maximize2 size={14} /></button>
              <button onClick={() => setMode('none')} className={`p-1.5 rounded-lg ${mode === 'none' ? 'bg-blue-500 text-white' : 'text-slate-400'}`}><Crop size={14} /></button>
              <button onClick={() => setMode('fill')} className={`p-1.5 rounded-lg ${mode === 'fill' ? 'bg-blue-500 text-white' : 'text-slate-400'}`}><StretchHorizontal size={14} /></button>
           </div>
        </div>

        <div className="text-center space-y-1">
           <div className="text-sm font-bold text-slate-700 dark:text-slate-200">
             {mode === 'cover' ? (language === 'zh' ? '填充 (Fill)' : 'Fill') :
              mode === 'contain' ? (language === 'zh' ? '等比缩放' : 'Fit') :
              mode === 'none' ? (language === 'zh' ? '裁切 (Crop)' : 'Crop') :
              (language === 'zh' ? '拉伸 (Stretch)' : 'Stretch')}
           </div>
           <p className="text-[10px] text-slate-400 max-w-[200px]">
             {mode === 'none' 
               ? (language === 'zh' ? '借鉴 Figma 设计，裁切模式可自由调整蒙版而不改变图片比例。' : 'Like Figma, Crop mode lets you adjust the mask without scaling the image.')
               : (language === 'zh' ? '快速切换不同展示比例，满足各种排版需求。' : 'Quickly switch between ratios for any layout need.')}
           </p>
        </div>
      </div>
    </div>
  );
};

const DemoImageSnapping = () => {
  const { language } = useStore();
  const [isNear, setIsNear] = useState(false);
  const x = useMotionValue(0);
  const controls = useAnimation();
  
  const handleDrag = () => {
    const currentX = x.get();
    if (Math.abs(currentX) < 15) {
      setIsNear(true);
    } else {
      setIsNear(false);
    }
  };

  const handleDragEnd = () => {
    const currentX = x.get();
    if (Math.abs(currentX) < 15) {
      controls.start({ x: 0, transition: { type: "spring", stiffness: 500, damping: 30 } });
      setIsNear(true);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-xs font-bold text-slate-400 uppercase text-center mb-2">
        {language === 'zh' ? '图片智能居中吸附演示' : 'Smart Image Snapping Demo'}
      </div>

      <div className="h-48 bg-white dark:bg-[#151515] rounded-2xl border border-black/5 dark:border-white/10 relative overflow-hidden flex items-center justify-center shadow-xl">
        {/* Center Line */}
        <div className={`absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 transition-opacity duration-300 ${isNear ? 'bg-blue-500 opacity-100' : 'bg-slate-200 dark:bg-white/10 opacity-40'}`} />
        
        {/* Draggable Mockup */}
        <motion.div
          drag="x"
          dragConstraints={{ left: -120, right: 120 }}
          style={{ x }}
          animate={controls}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          className="relative group cursor-grab active:cursor-grabbing"
        >
          <div className={`w-24 h-24 rounded-xl border-2 transition-colors duration-300 flex flex-col items-center justify-center gap-2 ${isNear ? 'bg-blue-500/10 border-blue-500 shadow-lg shadow-blue-500/20' : 'bg-white dark:bg-black/20 border-slate-200 dark:border-white/10 shadow-sm'}`}>
            <ImageIcon size={24} className={isNear ? 'text-blue-500' : 'text-slate-300'} />
            <div className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${isNear ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-white/5 text-slate-400'}`}>
              {isNear ? 'SNAPPED' : 'DRAG ME'}
            </div>
            
            {/* Mouse Pointer Mock */}
            {!isNear && (
              <motion.div 
                className="absolute -top-4 -left-4 text-slate-900 dark:text-white drop-shadow-md pointer-events-none"
                initial={{ opacity: 1 }}
                animate={{ x: [0, 10, 0], y: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <MousePointer2 size={16} fill="currentColor" />
              </motion.div>
            )}
          </div>
        </motion.div>
        
        {/* Hint text */}
        <div className="absolute bottom-4 left-0 right-0 text-center">
           <AnimatePresence mode="wait">
             {isNear ? (
               <motion.span key="s" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-[10px] font-bold text-blue-500">
                 {language === 'zh' ? '已自动吸附至中心' : 'Snapped to center'}
               </motion.span>
             ) : (
               <motion.span key="d" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] text-slate-400">
                 {language === 'zh' ? '请尝试左右拖动图片靠近中心线' : 'Try dragging the image near the center line'}
               </motion.span>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const DemoSupportFlow = () => {
  const { language } = useStore();
  const t = useTranslation();
  const [showTip, setShowTip] = useState(true);
  const [selectedAmount, setSelectedAmount] = useState<5 | 15 | null>(null);

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="text-xs font-bold text-slate-400 uppercase text-center mb-2">
        {language === 'zh' ? '赞赏流程演示' : 'Support Flow Demo'}
      </div>
      
      <div className="bg-white dark:bg-[#151515] p-6 rounded-3xl border border-black/5 dark:border-white/10 shadow-xl space-y-6">
        {/* Step 1: Tip & Entrance */}
        {!selectedAmount && (
          <div className="space-y-6">
            <div className="relative h-24 bg-slate-50 dark:bg-black/20 rounded-2xl border border-dashed border-black/10 dark:border-white/10 flex items-center justify-center">
            <div className="flex items-center gap-1 p-1.5 bg-white/50 dark:bg-black/20 rounded-full border border-black/5 dark:border-white/10">
              <div className="relative">
                <div className="p-1.5 bg-white dark:bg-white/5 rounded-full border border-black/5 dark:border-white/10 text-blue-500 shadow-sm">
                  <Info size={16} />
                </div>
                
                <AnimatePresence>
                  {showTip && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: 0 }}
                      animate={{ opacity: 1, scale: 1, y: 10 }}
                      exit={{ opacity: 0, scale: 0.8, y: 0 }}
                      className="absolute top-full right-0 whitespace-nowrap z-10"
                    >
                      <div className="bg-orange-400/85 dark:bg-orange-500/80 backdrop-blur-md text-white px-3 py-1.5 rounded-lg shadow-lg text-[9px] font-bold flex items-center gap-2 border border-white/20">
                        <div className="w-1 h-1 rounded-full bg-white animate-pulse" />
                        {language === 'zh' ? '欢迎打赏，老板大气，老板永远不死' : 'Support the author!'}
                        <button onClick={() => setShowTip(false)} className="hover:bg-white/20 rounded-full p-0.5">
                          <X size={10} />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="p-1.5 text-slate-400 opacity-40">
                <Github size={16} />
              </div>
              <div className="p-1.5 text-slate-400 opacity-40">
                <Languages size={16} />
              </div>
              <div className="p-1.5 text-slate-400 opacity-40">
                <Sun size={16} />
              </div>
            </div>
          </div>

            <div className="space-y-3">
              <p className="text-[10px] text-slate-400 text-center">
                {language === 'zh' ? '点击下方按钮进入打赏流程' : 'Click the button below to support'}
              </p>
              <button
                onClick={() => setSelectedAmount(null)}
                className="w-full p-3 bg-red-500/10 dark:bg-red-500/20 border border-red-500/20 dark:border-red-500/30 rounded-xl flex items-center justify-center gap-2 text-red-600 dark:text-red-400 text-xs font-bold transition-all hover:bg-red-500/20"
              >
                <ThumbsUp size={14} />
                <span>{t.supportMe}</span>
              </button>
            </div>

            {/* Support Selection Panel (Simplified) */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {[
                { amount: 5 as const, label: t.fiveRMB, img: 'assets/support/options/5rmb.png' },
                { amount: 15 as const, label: t.fifteenRMB, img: 'assets/support/options/15rmb.png' }
              ].map((item) => (
                <button
                  key={item.amount}
                  onClick={() => setSelectedAmount(item.amount)}
                  className="aspect-square relative group overflow-hidden rounded-xl border border-black/5 dark:border-white/10 transition-all hover:scale-[1.02] active:scale-95 shadow-sm"
                >
                  <img 
                    src={item.img} 
                    alt={item.label}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://placehold.co/200x200/fee2e2/dc2626?text=${item.label}`;
                    }}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent flex items-end justify-center pb-2">
                    <span className="text-white text-[10px] font-bold">{item.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: QR Codes */}
        {selectedAmount && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200">
                {selectedAmount === 5 ? t.fiveRMB : t.fifteenRMB} {t.supportAuthor}
              </h4>
              <button 
                onClick={() => setSelectedAmount(null)}
                className="text-[10px] text-blue-500 hover:underline"
              >
                {language === 'zh' ? '返回' : 'Back'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center gap-2">
                <span className="text-[9px] font-bold text-blue-500">{t.alipay}</span>
                <div className="p-2 bg-white rounded-xl border border-black/5 shadow-inner">
                  <img 
                    src={`assets/support/qrcodes/${selectedAmount}/alipay.jpg`} 
                    alt="Alipay"
                    className="w-24 h-24 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://placehold.co/200x200/00a1e9/ffffff?text=Alipay`;
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-[9px] font-bold text-green-500">{t.wechat}</span>
                <div className="p-2 bg-white rounded-xl border border-black/5 shadow-inner">
                  <img 
                    src={`assets/support/qrcodes/${selectedAmount}/wechat.jpg`} 
                    alt="WeChat"
                    className="w-24 h-24 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://placehold.co/200x200/07c160/ffffff?text=WeChat`;
                    }}
                  />
                </div>
              </div>
            </div>
            
            <p className="text-[9px] text-slate-400 text-center italic">
              {language === 'zh' ? '此演示即为真实打赏入口，感谢支持！' : 'This demo is a real support entry, thanks!'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const DemoProgressiveDisclosure = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useStore();
  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="text-xs font-bold text-slate-400 uppercase text-center mb-2">
        {language === 'zh' ? '渐进式披露演示' : 'Progressive Disclosure Demo'}
      </div>
      <div className="bg-white dark:bg-[#151515] rounded-2xl border border-black/5 dark:border-white/10 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-black/5 dark:border-white/10 flex items-center justify-between">
           <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
             {language === 'zh' ? '侧边栏设置' : 'Sidebar Settings'}
           </span>
         </div>
        <div className="p-5 space-y-5">
          <div className="space-y-2">
            <div className="h-2 w-20 bg-slate-200 dark:bg-white/10 rounded" />
            <div className="h-9 w-full bg-slate-100 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5" />
          </div>
          
          <div className="pt-2">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 text-xs font-bold text-blue-500 hover:text-blue-600 transition-colors group"
            >
              <div className={`p-1 rounded-md bg-blue-500/10 group-hover:bg-blue-500/20 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                <ChevronDown size={12} />
              </div>
              {language === 'zh' ? '更多设置' : 'Advanced Options'}
            </button>
          </div>

          <AnimatePresence>
            {isOpen && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-2 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-14 bg-blue-500/5 dark:bg-blue-500/10 rounded-xl border border-blue-500/20 flex flex-col items-center justify-center gap-1.5">
                      <div className="h-1.5 w-8 bg-blue-500/30 rounded-full" />
                      <div className="h-1.5 w-12 bg-blue-500/50 rounded-full" />
                    </div>
                    <div className="h-14 bg-purple-500/5 dark:bg-purple-500/10 rounded-xl border border-purple-500/20 flex flex-col items-center justify-center gap-1.5">
                      <div className="h-1.5 w-8 bg-purple-500/30 rounded-full" />
                      <div className="h-1.5 w-12 bg-purple-500/50 rounded-full" />
                    </div>
                  </div>
                  <div className="h-9 w-full bg-slate-50 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const DemoFontPresets = () => {
   const { language } = useStore();
   const fonts = [
     { name: 'Helvetica', family: '"Helvetica", sans-serif', desc: 'Classic & Professional' },
     { name: 'Google Sans Code', family: '"GoogleSansCode-Regular", monospace', desc: 'Modern Monospace' },
     { name: 'OPPO Sans', family: '"OPPO Sans 4.0", sans-serif', desc: 'Balanced & Clear' },
   ];
   const [selected, setSelected] = useState(fonts[0].name);

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="text-xs font-bold text-slate-400 uppercase text-center mb-2">
        {language === 'zh' ? '更多字体预设演示' : 'More Font Presets Demo'}
      </div>
      <div className="grid grid-cols-1 gap-2.5">
        {fonts.map(f => (
          <button
            key={f.name}
            onClick={() => setSelected(f.name)}
            className={`p-4 rounded-2xl border transition-all text-left flex items-center justify-between group ${
              selected === f.name 
                ? 'bg-blue-600 border-blue-700 text-white shadow-lg shadow-blue-500/20' 
                : 'bg-white dark:bg-white/5 border-black/5 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-blue-500/50'
            }`}
          >
            <div className="flex flex-col gap-0.5">
              <span style={{ fontFamily: f.family }} className="text-base font-medium">
                {f.name}
              </span>
              <span className={`text-[10px] uppercase tracking-wider ${selected === f.name ? 'text-blue-100/70' : 'text-slate-400'}`}>
                {f.desc}
              </span>
            </div>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${selected === f.name ? 'bg-white/20' : 'bg-black/5 dark:bg-white/5 group-hover:bg-blue-500/10'}`}>
              {selected === f.name ? <CheckIcon size={12} /> : <Plus size={12} className="opacity-40" />}
            </div>
          </button>
        ))}
      </div>
      <div 
         className="mt-4 p-8 rounded-3xl bg-white dark:bg-[#151515] border border-black/5 dark:border-white/10 shadow-xl min-h-[120px] flex items-center justify-center text-center transition-all duration-500 ease-out"
         style={{ fontFamily: fonts.find(f => f.name === selected)?.family }}
       >
         <div className="space-y-2">
           <p className="text-xl text-slate-800 dark:text-white leading-snug font-medium">
             在这里预览不同字体的独特魅力
           </p>
           <p className="text-sm text-slate-500 dark:text-slate-400 leading-snug opacity-80">
             Preview the unique charm of different fonts
           </p>
         </div>
       </div>
    </div>
  );
};

const DraggableValue = ({ 
  value, 
  onChange, 
  min = 0, 
  max = 100, 
  step = 1,
  icon, 
  label 
}: { 
  value: number, 
  onChange: (v: number) => void, 
  min?: number, 
  max?: number, 
  step?: number,
  icon: React.ReactNode, 
  label: string 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value.toString());
  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isEditing) return;
    setIsDragging(true);
    const startX = e.clientX;
    const startValue = value;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const sensitivity = step < 1 ? 0.01 : 0.5;
      const change = deltaX * sensitivity;
      const rawValue = startValue + change;
      
      const steppedValue = Math.round(rawValue / step) * step;
      const newValue = Math.max(min, Math.min(max, steppedValue));
      
      const finalValue = parseFloat(newValue.toFixed(step < 1 ? 2 : 0));
      onChange(finalValue);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleInputBlur = () => {
    setIsEditing(false);
    let newValue = parseFloat(inputValue);
    if (isNaN(newValue)) {
      setInputValue(value.toString());
      return;
    }
    newValue = Math.max(min, Math.min(max, newValue));
    onChange(newValue);
  };

  return (
    <div className="space-y-1.5 flex-1 min-w-[120px]">
      <div className="flex items-center justify-between px-0.5">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
      </div>
      <div 
        onMouseDown={handleMouseDown}
        className={`flex items-center gap-2 px-3 py-2 bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl cursor-ew-resize select-none transition-all ${isDragging ? 'border-blue-500 shadow-sm' : 'hover:border-black/20 dark:hover:border-white/20'} ${isEditing ? 'ring-2 ring-blue-500 bg-white dark:bg-black/20' : ''}`}
      >
        <div className="text-slate-400 shrink-0">
          {icon}
        </div>
        <div 
          className="flex-1 text-right text-sm font-mono font-bold text-slate-700 dark:text-slate-200"
          onClick={() => setIsEditing(true)}
        >
          {isEditing ? (
            <input
              autoFocus
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onBlur={handleInputBlur}
              onKeyDown={(e) => e.key === 'Enter' && handleInputBlur()}
              className="w-full bg-transparent outline-none text-blue-500 text-right"
              onMouseDown={(e) => e.stopPropagation()}
            />
          ) : (
            value
          )}
        </div>
      </div>
    </div>
  );
};

const DemoSliderIntegration = () => {
  const { language } = useStore();
  const [radius, setRadius] = useState(16);
  const [borderWidth, setBorderWidth] = useState(2);
  const borderColor = '#3b82f6';

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="flex flex-col items-center gap-2">
        <div className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full text-[10px] font-bold uppercase tracking-widest">
          {language === 'zh' ? '交互演示：无感滑动调节' : 'Demo: Seamless Drag Adjustment'}
        </div>
        <p className="text-xs text-slate-400 text-center">
          {language === 'zh' ? '在数值区域左右拖拽，即可快速调整参数' : 'Drag left/right on values to adjust parameters'}
        </p>
      </div>

      <div className="bg-white dark:bg-[#151515] p-6 rounded-3xl border border-black/5 dark:border-white/10 shadow-xl space-y-6">
        <div className="flex flex-wrap gap-4">
          <DraggableValue 
            label={language === 'zh' ? '圆角' : 'Radius'}
            value={radius} 
            onChange={setRadius}
            max={40}
            icon={<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 7V3C2 2.44772 2.44772 2 3 2H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><rect x="5" y="5" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/></svg>}
          />
          <DraggableValue 
            label={language === 'zh' ? '边框宽度' : 'Border'}
            value={borderWidth} 
            onChange={setBorderWidth}
            max={40}
            icon={<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2.5" y="2.5" width="9" height="9" rx="1" stroke="currentColor" strokeWidth="2"/></svg>}
          />
        </div>

        <div className="aspect-video w-full rounded-2xl bg-slate-50 dark:bg-black/20 flex items-center justify-center p-8 overflow-hidden relative">
          <motion.div 
            animate={{ 
              borderRadius: `${radius}px`,
              borderWidth: `${borderWidth}px`
            }}
            style={{ borderColor: borderColor }}
            className="w-full h-full bg-white dark:bg-[#202020] shadow-2xl flex items-center justify-center border-solid"
          >
            <div className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">
              Preview
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const DemoPaddingCustomization = () => {
  const { language } = useStore();
  const [padding, setPadding] = useState({ top: 20, right: 20, bottom: 20, left: 20 });
  const [isSynced, setIsSynced] = useState(true);

  const updatePadding = (side: keyof typeof padding, val: number) => {
    if (isSynced) {
      setPadding({ top: val, right: val, bottom: val, left: val });
    } else {
      setPadding(prev => ({ ...prev, [side]: val }));
    }
  };


  return (
    <div className="w-full max-w-md space-y-8">
      <div className="flex flex-col items-center gap-2">
        <div className="px-3 py-1 bg-purple-500/10 text-purple-500 rounded-full text-[10px] font-bold uppercase tracking-widest">
          {language === 'zh' ? '四向调节：精准控制间距' : '4-Way Control: Precise Spacing'}
        </div>
        <p className="text-xs text-slate-400 text-center">
          {language === 'zh' ? '点击锁定按钮，可独立调节每个方向的边距' : 'Click the lock button to adjust each margin independently'}
        </p>
      </div>

      <div className="bg-white dark:bg-[#151515] p-6 rounded-3xl border border-black/5 dark:border-white/10 shadow-xl space-y-6">
        <div className="flex items-center justify-between px-1">
          <div className="text-xs font-bold text-slate-500">{language === 'zh' ? '内边距' : 'Padding'}</div>
          <button 
            onClick={() => setIsSynced(!isSynced)}
            className={`p-1.5 rounded-md transition-all hover:bg-black/5 dark:hover:bg-white/5 ${isSynced ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}
          >
            {isSynced ? <Square size={14} /> : <Frame size={14} />}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {isSynced ? (
            <div className="col-span-2">
              <DraggableValue 
                label={language === 'zh' ? '全部' : 'All'}
                value={padding.top} 
                onChange={(v) => updatePadding('top', v)}
                max={80}
                icon={<PaddingIcon side="all" />}
              />
            </div>
          ) : (
            <>
              <DraggableValue label={language === 'zh' ? '上方' : 'Top'} value={padding.top} onChange={(v) => updatePadding('top', v)} max={80} icon={<PaddingIcon side="top" />} />
              <DraggableValue label={language === 'zh' ? '下方' : 'Bottom'} value={padding.bottom} onChange={(v) => updatePadding('bottom', v)} max={80} icon={<PaddingIcon side="bottom" />} />
              <DraggableValue label={language === 'zh' ? '左侧' : 'Left'} value={padding.left} onChange={(v) => updatePadding('left', v)} max={80} icon={<PaddingIcon side="left" />} />
              <DraggableValue label={language === 'zh' ? '右侧' : 'Right'} value={padding.right} onChange={(v) => updatePadding('right', v)} max={80} icon={<PaddingIcon side="right" />} />
            </>
          )}
        </div>

        <div className="aspect-video w-full rounded-2xl bg-slate-50 dark:bg-black/20 flex items-center justify-center p-4 overflow-hidden">
          <div className="w-full h-full bg-blue-500/10 rounded-xl border border-dashed border-blue-500/30 flex items-center justify-center p-0">
             <motion.div 
               animate={{ 
                 paddingTop: `${padding.top}px`,
                 paddingRight: `${padding.right}px`,
                 paddingBottom: `${padding.bottom}px`,
                 paddingLeft: `${padding.left}px`,
               }}
               className="w-full h-full"
             >
                <div className="w-full h-full bg-white dark:bg-[#202020] shadow-lg rounded-lg flex flex-col gap-2 p-4">
                  <div className="w-1/2 h-2 bg-blue-500/20 rounded-full" />
                  <div className="w-full h-1.5 bg-slate-200 dark:bg-white/5 rounded-full" />
                  <div className="w-5/6 h-1.5 bg-slate-200 dark:bg-white/5 rounded-full" />
                </div>
             </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};


const DemoFooterCustomization = () => {
  const { language } = useStore();
  const [watermark, setWatermark] = useState({ fontSize: 10, opacity: 0.5, position: 'center' as 'left' | 'center' | 'right', color: '', uppercase: true });
  const [pageNumber, setPageNumber] = useState({ fontSize: 10, opacity: 0.5, position: 'center' as 'left' | 'center' | 'right', color: '' });
  const [activeTab, setActiveTab] = useState<'watermark' | 'pageNumber'>('pageNumber');

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-xs font-bold text-slate-400 uppercase text-center mb-2">
        {language === 'zh' ? '页码 & 水印独立自定义' : 'Independent Footer Customization'}
      </div>

      <div className="bg-white dark:bg-[#151515] p-6 rounded-2xl border border-black/5 dark:border-white/5 shadow-sm space-y-6">
        {/* Tab Switcher */}
        <div className="flex p-1 bg-black/5 dark:bg-white/5 rounded-xl">
          <button
            onClick={() => setActiveTab('pageNumber')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'pageNumber' ? 'bg-white dark:bg-white/10 text-blue-600 shadow-sm' : 'text-slate-400'
            }`}
          >
            {language === 'zh' ? '页码设置' : 'Page Number'}
          </button>
          <button
            onClick={() => setActiveTab('watermark')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'watermark' ? 'bg-white dark:bg-white/10 text-blue-600 shadow-sm' : 'text-slate-400'
            }`}
          >
            {language === 'zh' ? '水印设置' : 'Watermark'}
          </button>
        </div>

        {/* Active Tab Controls */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
              <span>{language === 'zh' ? '字号' : 'Font Size'}</span>
              <span>{activeTab === 'pageNumber' ? pageNumber.fontSize : watermark.fontSize}px</span>
            </div>
            <input 
              type="range" min="6" max="64" 
              value={activeTab === 'pageNumber' ? pageNumber.fontSize : watermark.fontSize} 
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (activeTab === 'pageNumber') setPageNumber({ ...pageNumber, fontSize: val });
                else setWatermark({ ...watermark, fontSize: val });
              }}
              className="w-full h-1.5 bg-black/5 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
              <span>{language === 'zh' ? '不透明度' : 'Opacity'}</span>
              <span>{Math.round((activeTab === 'pageNumber' ? pageNumber.opacity : watermark.opacity) * 100)}%</span>
            </div>
            <input 
              type="range" min="0" max="1" step="0.05" 
              value={activeTab === 'pageNumber' ? pageNumber.opacity : watermark.opacity} 
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (activeTab === 'pageNumber') setPageNumber({ ...pageNumber, opacity: val });
                else setWatermark({ ...watermark, opacity: val });
              }}
              className="w-full h-1.5 bg-black/5 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">{language === 'zh' ? '位置' : 'Position'}</span>
            <div className="flex bg-black/5 dark:bg-white/5 rounded-lg p-1">
              {(['left', 'center', 'right'] as const).map((pos) => {
                const isActive = (activeTab === 'pageNumber' ? pageNumber.position : watermark.position) === pos;
                return (
                  <button
                    key={pos}
                    onClick={() => {
                      if (activeTab === 'pageNumber') setPageNumber({ ...pageNumber, position: pos });
                      else setWatermark({ ...watermark, position: pos });
                    }}
                    className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all capitalize ${
                      isActive ? 'bg-white dark:bg-white/10 text-blue-600 shadow-sm' : 'text-slate-400'
                    }`}
                  >
                    {pos}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">{language === 'zh' ? '颜色' : 'Color'}</span>
            <div className="flex gap-2">
              {['', '#3b82f6', '#ef4444', '#10b981', '#f59e0b'].map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    if (activeTab === 'pageNumber') setPageNumber({ ...pageNumber, color: c });
                    else setWatermark({ ...watermark, color: c });
                  }}
                  className={`w-5 h-5 rounded-full border-2 transition-all ${
                    (activeTab === 'pageNumber' ? pageNumber.color : watermark.color) === c
                      ? 'border-blue-500 scale-110 shadow-sm'
                      : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: c || '#94a3b8' }}
                />
              ))}
            </div>
          </div>

          {activeTab === 'watermark' && (
            <div className="flex items-center justify-between pt-2 border-t border-black/5 dark:border-white/5">
              <span className="text-[10px] font-bold text-slate-400 uppercase">{language === 'zh' ? '全大写' : 'Uppercase'}</span>
              <button 
                onClick={() => setWatermark({ ...watermark, uppercase: !watermark.uppercase })}
                className={`w-8 h-4 rounded-full transition-colors relative ${watermark.uppercase ? 'bg-blue-500' : 'bg-black/10 dark:bg-white/10'}`}
              >
                <div className={`w-2.5 h-2.5 rounded-full bg-white absolute top-0.75 transition-all ${watermark.uppercase ? 'left-4.5' : 'left-1'}`} />
              </button>
            </div>
          )}
        </div>

        {/* Real-time Preview Area */}
        <div className="pt-4 border-t border-black/5 dark:border-white/5">
          <div className="text-[10px] font-bold text-slate-400 uppercase mb-3 text-center">{language === 'zh' ? '实时预览 (底部栏)' : 'Real-time Preview (Footer)'}</div>
          <div className="relative h-16 bg-slate-50 dark:bg-black/20 rounded-xl border border-dashed border-black/10 dark:border-white/10 flex items-center px-4 overflow-hidden">
            {/* Watermark Preview */}
            <div 
              className="absolute transition-all duration-300 font-mono"
              style={{ 
                left: watermark.position === 'left' ? '1rem' : watermark.position === 'center' ? '50%' : 'auto',
                right: watermark.position === 'right' ? '1rem' : 'auto',
                transform: watermark.position === 'center' ? 'translateX(-50%)' : 'none',
                fontSize: `${watermark.fontSize}px`,
                opacity: watermark.opacity,
                color: watermark.color || 'currentColor',
                textTransform: watermark.uppercase ? 'uppercase' : 'none'
              }}
            >
              MD2DESIGN
            </div>
            
            {/* Page Number Preview */}
            <div 
              className="absolute transition-all duration-300 font-mono font-bold"
              style={{ 
                left: pageNumber.position === 'left' ? '1rem' : pageNumber.position === 'center' ? '50%' : 'auto',
                right: pageNumber.position === 'right' ? '1rem' : 'auto',
                transform: pageNumber.position === 'center' ? 'translateX(-50%)' : 'none',
                fontSize: `${pageNumber.fontSize}px`,
                opacity: pageNumber.opacity,
                color: pageNumber.color || 'currentColor'
              }}
            >
              1
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DemoMultiLineList = () => {
  const { language } = useStore();
  const [isList, setIsList] = useState(false);
  const lines = [
    language === 'zh' ? '第一行内容' : 'First line of content',
    language === 'zh' ? '第二行内容' : 'Second line of content',
    language === 'zh' ? '第三行内容' : 'Third line of content',
  ];

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-xs font-bold text-slate-400 uppercase text-center mb-2">
        {language === 'zh' ? '多行列表切换' : 'Multi-line List Toggle'}
      </div>

      <div className="bg-white dark:bg-[#151515] rounded-2xl border border-black/5 dark:border-white/5 shadow-sm overflow-hidden">
        {/* Editor-like Toolbar */}
        <div className="px-4 py-2 border-b border-black/5 dark:border-white/5 bg-black/2 dark:bg-white/2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsList(!isList)}
              className={`p-1.5 rounded transition-all flex items-center gap-2 ${
                isList ? 'bg-blue-500/10 text-blue-600' : 'hover:bg-black/5 dark:hover:bg-white/5 text-slate-400'
              }`}
            >
              <List size={14} />
            </button>
            <div className="w-px h-4 bg-black/10 dark:bg-white/10" />
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-full bg-slate-200 dark:bg-white/10" />
              <div className="w-3 h-3 rounded-full bg-slate-200 dark:bg-white/10" />
            </div>
          </div>
          <div className="text-[10px] font-mono text-slate-400 opacity-60">Markdown Editor</div>
        </div>

        {/* Editor-like Content Area */}
        <div className="p-6 font-mono text-xs space-y-1.5 min-h-[120px] bg-white dark:bg-[#151515]">
          {lines.map((line, i) => (
            <motion.div 
              key={i} 
              layout
              className="flex items-center gap-2"
            >
              <span className={isList ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500'}>
                {isList ? `- ${line}` : line}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      <p className="text-[10px] text-center text-slate-400 px-8 leading-relaxed">
        {language === 'zh' 
          ? '现在支持在编辑器中一次性选中多行文本，并点击工具栏按钮一键添加/取消列表前缀。' 
          : 'Now supports selecting multiple lines in the editor and toggling list prefixes for all of them at once.'}
      </p>
    </div>
  );
};

const DemoMarkdown = () => {
  const { language } = useStore();
  const [text, setText] = useState(language === 'zh' ? "在此输入...\n按回车换行。" : "Type here...\nPress Enter to break line.");
  
  return (
    <div className="flex flex-col md:flex-row gap-6 h-[320px]">
      {/* Editor Side */}
      <div className="flex-1 flex flex-col gap-2">
        <div className="text-xs font-bold text-slate-500 uppercase">{language === 'zh' ? '编辑器' : 'Editor'}</div>
        <textarea
          id="demo-markdown-input"
          name="demoMarkdown"
          aria-label={language === 'zh' ? "Markdown 演示输入" : "Markdown Demo Input"}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-full p-4 text-sm font-mono rounded-xl bg-white dark:bg-[#151515] border border-transparent focus:border-blue-500/50 outline-none shadow-sm resize-none transition-all"
          placeholder={language === 'zh' ? "输入 markdown..." : "Type markdown..."}
        />
      </div>

      {/* Preview Side - Mocking the Card Style */}
      <div className="flex-1 flex flex-col gap-2">
        <div className="text-xs font-bold text-slate-500 uppercase">{language === 'zh' ? '卡片预览' : 'Card Preview'}</div>
        <div className="w-full h-full rounded-xl overflow-hidden relative shadow-xl group">
          {/* Card Background Mock */}
          <div className="absolute inset-0 bg-linear-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900" />
          
          {/* Card Content Mock */}
          <div className="absolute inset-4 bg-white dark:bg-[#1a1a1a] rounded-lg shadow-lg overflow-y-auto custom-scrollbar">
             <div className="p-6 prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm, remarkBreaks]}
                  components={{
                    // Simplified component overrides to match main app style broadly
                    h1: ({...props}) => <h1 className="text-2xl font-bold mb-4 pb-2 border-b border-black/10 dark:border-white/10" {...props} />,
                    p: ({...props}) => <p className="mb-4 leading-relaxed opacity-90" {...props} />,
                    li: ({...props}) => <li className="marker:text-blue-500" {...props} />,
                  }}
                >
                  {text}
                </ReactMarkdown>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DemoExportNaming = () => {
  const { language } = useStore();
  const t = useTranslation();
  const [namingMode, setNamingMode] = useState<'system' | 'custom'>('system');
  const [namingParts, setNamingParts] = useState<('prefix' | 'date' | 'custom' | 'number')[]>(['prefix', 'date', 'custom', 'number']);
  const [namingConfigs, setNamingConfigs] = useState({
    prefix: 'Md2Design',
    custom: 'MyCard',
    includeTime: true,
    dateFormat: 'dateFormatFull' as 'dateFormatFull' | 'dateFormatShort' | 'dateFormatMDY' | 'dateFormatDMY' | 'dateFormatYMD',
    numberType: 'arabic' as 'arabic' | 'chinese',
    numberOrder: 'asc' as 'asc' | 'desc',
    zeroStart: false,
  });

  const CustomDropdown = <T extends string>({ 
    value, 
    options, 
    onChange, 
    className = "" 
  }: { 
    value: T, 
    options: { id: T, label: string }[], 
    onChange: (val: T) => void,
    className?: string
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = options.find(o => o.id === value);

    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-white/50 dark:bg-black/20 border border-black/5 dark:border-white/5 rounded-lg p-2 text-[10px] flex items-center justify-between hover:border-blue-500/30 transition-all"
        >
          <span className="truncate">{selectedOption?.label}</span>
          <ChevronDown size={10} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
              <div className="fixed inset-0 z-120" onClick={() => setIsOpen(false)} />
              <motion.div
                initial={{ opacity: 0, y: 4, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.95 }}
                className="absolute left-0 right-0 top-full mt-1 z-121 bg-white dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden py-1"
              >
                {options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      onChange(option.id);
                      setIsOpen(false);
                    }}
                    className={`w-full px-3 py-1.5 text-left text-[10px] transition-colors flex items-center justify-between ${
                      value === option.id 
                        ? 'bg-blue-500 text-white' 
                        : 'text-slate-700 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    {option.label}
                    {value === option.id && <CheckIcon size={10} />}
                  </button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  };
  
  const move = (idx: number, dir: number) => {
    const newParts = [...namingParts];
    const targetIdx = idx + dir;
    if (targetIdx < 0 || targetIdx >= namingParts.length) return;
    [newParts[idx], newParts[targetIdx]] = [newParts[targetIdx], newParts[idx]];
    setNamingParts(newParts);
  };

  const getLabel = (part: string) => {
    const labels: Record<string, string> = { 
      'prefix': language === 'zh' ? '前缀' : 'Prefix', 
      'date': language === 'zh' ? '日期' : 'Date', 
      'custom': language === 'zh' ? '自定义名称' : 'Custom Name', 
      'number': language === 'zh' ? '数字顺序' : 'Number Order' 
    };
    return labels[part] || part;
  };

  const generateFileName = (index: number, total: number) => {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    
    const getFormattedDate = () => {
      const yy = now.getFullYear().toString().slice(-2);
      const mm = pad(now.getMonth() + 1);
      const dd = pad(now.getDate());
      
      switch (namingConfigs.dateFormat) {
        case 'dateFormatFull': return `${yy}${mm}${dd}`;
        case 'dateFormatShort': return `${mm}${dd}`;
        case 'dateFormatMDY': return `${mm}${dd}${yy}`;
        case 'dateFormatDMY': return `${dd}${mm}${yy}`;
        case 'dateFormatYMD': return `${yy}${mm}${dd}`;
        default: return `${yy}${mm}${dd}`;
      }
    };

    const dateStr = getFormattedDate();
    const timeStr = `${pad(now.getHours())}${pad(now.getMinutes())}`;
    
    if (namingMode === 'system') {
      return `Md2Design_${dateStr}_${timeStr}_${namingConfigs.custom}_${index + 1}`;
    }

    const parts = namingParts.map(part => {
      switch (part) {
        case 'prefix': return namingConfigs.prefix;
        case 'date': return namingConfigs.includeTime ? `${dateStr}_${timeStr}` : dateStr;
        case 'custom': return namingConfigs.custom;
        case 'number': {
          let num = namingConfigs.numberOrder === 'asc' ? index : (total - 1 - index);
          if (!namingConfigs.zeroStart) num += 1;
          
          if (namingConfigs.numberType === 'chinese') {
            const chineseNums = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
            return num <= 10 ? chineseNums[num] : num.toString();
          }
          return num.toString();
        }
        default: return '';
      }
    });

    return parts.filter(Boolean).join('_');
  };

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="text-xs font-bold text-slate-400 uppercase text-center mb-2">
        {language === 'zh' ? '文件名自定义演示' : 'Filename Customization Demo'}
      </div>

      {/* Mode Toggle - Matching TopBar Style */}
      <div className="flex p-1 bg-black/5 dark:bg-white/5 rounded-lg border border-black/5 dark:border-white/5">
        {[
          { id: 'system', label: t.namingModeSystem },
          { id: 'custom', label: t.namingModeCustom }
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => setNamingMode(m.id as 'system' | 'custom')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
              namingMode === m.id ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {namingMode === 'system' ? (
        <div className="space-y-4 py-4">
          <div className="p-4 bg-white dark:bg-[#151515] rounded-xl border border-black/5 dark:border-white/5 shadow-sm space-y-3">
             <div className="text-[10px] font-bold text-slate-400 uppercase">{language === 'zh' ? '系统默认格式' : 'System Default Format'}</div>
             <div className="text-xs text-slate-600 dark:text-slate-400 font-mono leading-relaxed">
               Md2Design_日期(YYMMDD)_时间(HHMM)_自定义名称_数字序号.png
             </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            {namingParts.map((part, i) => (
              <motion.div
                key={part}
                layout
                className="flex flex-col p-3 bg-white dark:bg-[#151515] rounded-xl border border-black/5 dark:border-white/5 shadow-sm gap-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center text-[10px] font-bold">
                      {i + 1}
                    </div>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{getLabel(part)}</span>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => move(i, -1)} className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded disabled:opacity-20" disabled={i === 0}>
                      <ChevronRight size={14} className="-rotate-90 opacity-60" />
                    </button>
                    <button onClick={() => move(i, 1)} className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded disabled:opacity-20" disabled={i === namingParts.length - 1}>
                      <ChevronRight size={14} className="rotate-90 opacity-60" />
                    </button>
                  </div>
                </div>

                {/* Nested Configs */}
                {part === 'date' && (
                  <div className="pl-9 space-y-2 border-l border-black/5 dark:border-white/5">
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] text-slate-400">{t.namingIncludeTime || (language === 'zh' ? '包含时间' : 'Include Time')}</span>
                       <button onClick={() => setNamingConfigs({...namingConfigs, includeTime: !namingConfigs.includeTime})} className={`w-7 h-3.5 rounded-full relative transition-colors ${namingConfigs.includeTime ? 'bg-blue-500' : 'bg-black/10 dark:bg-white/10'}`}>
                         <div className={`absolute top-0.5 w-2.5 h-2.5 bg-white rounded-full transition-all ${namingConfigs.includeTime ? 'right-0.5' : 'left-0.5'}`} />
                       </button>
                    </div>
                    <CustomDropdown
                      value={namingConfigs.dateFormat}
                      options={[
                        { id: 'dateFormatFull', label: t.dateFormatFull || 'YYMMDD' },
                        { id: 'dateFormatShort', label: t.dateFormatShort || 'MMDD' },
                        { id: 'dateFormatYMD', label: t.dateFormatYMD || 'YY/MM/DD' }
                      ]}
                      onChange={(val) => setNamingConfigs({ ...namingConfigs, dateFormat: val })}
                    />
                  </div>
                )}

                {part === 'number' && (
                  <div className="pl-9 space-y-2 border-l border-black/5 dark:border-white/5">
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] text-slate-400">{t.namingZeroStart || (language === 'zh' ? '0作为起始' : 'Zero Start')}</span>
                       <button onClick={() => setNamingConfigs({...namingConfigs, zeroStart: !namingConfigs.zeroStart})} className={`w-7 h-3.5 rounded-full relative transition-colors ${namingConfigs.zeroStart ? 'bg-blue-500' : 'bg-black/10 dark:bg-white/10'}`}>
                         <div className={`absolute top-0.5 w-2.5 h-2.5 bg-white rounded-full transition-all ${namingConfigs.zeroStart ? 'right-0.5' : 'left-0.5'}`} />
                       </button>
                    </div>
                    <div className="flex gap-2">
                      <CustomDropdown
                        className="flex-1"
                        value={namingConfigs.numberType}
                        options={[
                          { id: 'arabic', label: t.namingArabic || '1, 2, 3' },
                          { id: 'chinese', label: t.namingChinese || (language === 'zh' ? '一, 二, 三' : 'Chinese') }
                        ]}
                        onChange={(val) => setNamingConfigs({ ...namingConfigs, numberType: val })}
                      />
                      <CustomDropdown
                        className="flex-1"
                        value={namingConfigs.numberOrder}
                        options={[
                          { id: 'asc', label: t.namingOrderAsc || (language === 'zh' ? '升序' : 'ASC') },
                          { id: 'desc', label: t.namingOrderDesc || (language === 'zh' ? '降序' : 'DESC') }
                        ]}
                        onChange={(val) => setNamingConfigs({ ...namingConfigs, numberOrder: val })}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 bg-blue-500/5 rounded-xl border border-blue-500/10">
        <div className="text-[10px] font-bold text-blue-500 uppercase mb-2 tracking-widest">
          {t.namingPreview || (language === 'zh' ? '预览文件名' : 'Filename Preview')}
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="text-xs font-mono text-slate-600 dark:text-slate-400 break-all leading-relaxed">
            {generateFileName(0, 10)}.png
          </div>
          {namingMode === 'custom' && namingParts.includes('number') && (
            <>
              <div className="text-xs font-mono text-slate-600 dark:text-slate-400 break-all leading-relaxed opacity-60">
                {generateFileName(1, 10)}.png
              </div>
              <div className="text-xs font-mono text-slate-400 dark:text-slate-500 opacity-40">...</div>
              <div className="text-xs font-mono text-slate-600 dark:text-slate-400 break-all leading-relaxed">
                {generateFileName(9, 10)}.png
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const DemoOnboardingHint = () => {
  const { language } = useStore();
  const t = useTranslation();
  const [show, setShow] = useState(true);
  
  return (
    <div className="w-full max-w-sm flex flex-col items-center gap-6">
      <div className="text-xs font-bold text-slate-400 uppercase text-center mb-2">
        {language === 'zh' ? '交互引导提示' : 'Onboarding Tooltip'}
      </div>

      <div className="relative flex items-center gap-2">
        {/* Updates Button - Matching TopBar Style */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-white/80 dark:bg-white/10 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-bold border border-blue-500/20 relative overflow-hidden shadow-sm">
          {/* Outer soft glow (Diffuse) */}
          <motion.div 
            className="absolute inset-0 rounded-full bg-blue-500/20 blur-md -z-10 pointer-events-none"
            animate={{ 
              opacity: [0.4, 0.8, 0.4],
              scale: [1, 1.15, 1]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <Sparkles size={10} className="text-blue-500" />
          <span>{t.changelogTitle || 'Updates'}</span>
        </div>

        {/* Feedback Button - Matching TopBar Style */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-white/80 dark:bg-white/10 text-green-600 dark:text-green-400 rounded-full text-[10px] font-bold border border-green-500/20 relative shadow-sm">
          {/* Outer soft glow (Diffuse) */}
          <motion.div 
            className="absolute inset-0 rounded-full bg-green-500/20 blur-md -z-10 pointer-events-none"
            animate={{ 
              opacity: [0.4, 0.8, 0.4],
              scale: [1, 1.15, 1]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <MessageSquare size={10} className="text-green-500" />
          <span>{t.feedback || 'Feedback'}</span>
        </div>

        {/* Onboarding Tooltip - Matching the morphing animation in TopBar */}
        <AnimatePresence>
          {show && (
            <motion.div
              initial={{ 
                opacity: 0, 
                scaleX: 0, 
                scaleY: 0,
                originX: 0,
                x: 10,
                borderRadius: "100px"
              }}
              animate={{ 
                opacity: 1, 
                scaleX: 1, 
                scaleY: 1,
                originX: 0,
                x: 12,
                borderRadius: "12px"
              }}
              exit={{ 
                opacity: 0, 
                scaleX: 0, 
                scaleY: 0,
                originX: 0,
                x: 10,
                borderRadius: "100px"
              }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20
              }}
              className="absolute left-full whitespace-nowrap z-30"
            >
              <div className="bg-orange-400/85 dark:bg-orange-500/80 backdrop-blur-md text-white px-4 py-2 rounded-xl shadow-[0_10px_30px_-10px_rgba(251,146,60,0.5)] text-[10px] font-bold flex items-center gap-2 border border-white/20">
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                {t.onboardingTip || (language === 'zh' ? '这里可以查看更新和反馈bug' : 'Check updates and report bugs here')}
                <button 
                  onClick={() => setShow(false)}
                  className="ml-2 p-1 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={12} className="text-white" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reset button if hidden */}
        {!show && (
          <button 
            onClick={() => setShow(true)}
            className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[10px] text-blue-500 hover:underline"
          >
            {language === 'zh' ? '重现提示' : 'Replay Hint'}
          </button>
        )}
      </div>
      
      <div className="mt-16 flex items-center gap-2 text-[10px] text-slate-400 italic">
        <CheckCircle2 size={12} className="text-green-500" />
        <span>{language === 'zh' ? '仅在有重大更新或首次使用时显示' : 'Shows on major updates or first use'}</span>
      </div>
    </div>
  );
};

const DemoResetUndo = () => {
  const t = useTranslation();
  const [showToast, setShowToast] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isActive && countdown > 0) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
    } else if (countdown === 0) {
      setTimeout(() => {
        setIsActive(false);
        setShowToast(false);
      }, 0);
    }
    return () => clearInterval(timer);
  }, [isActive, countdown]);

  const handleReset = () => {
    setCountdown(10);
    setShowToast(true);
    setIsActive(true);
  };

  const handleUndo = () => {
    setIsActive(false);
    setShowToast(false);
    setCountdown(10);
  };

  const getCountdownColor = () => {
    if (countdown > 6) return '#22c55e'; // green-500
    if (countdown > 3) return '#eab308'; // yellow-500
    return '#ef4444'; // red-500
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-sm relative z-10 min-h-[80px] justify-center">
      <AnimatePresence mode="wait">
        {!showToast ? (
          <motion.button
            key="reset-btn"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-3 bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 rounded-full font-bold transition-all"
          >
            <RotateCcw size={18} />
            {t.resetStyle || 'Reset Style'}
          </motion.button>
        ) : (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="bg-white/80 dark:bg-black/80 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl rounded-full px-6 py-4 flex items-center gap-6 w-full absolute"
          >
            {/* Countdown Circle */}
            <div className="relative w-12 h-12 shrink-0 flex items-center justify-center">
              <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-black/5 dark:text-white/5" />
                <motion.circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke={getCountdownColor()}
                  strokeWidth="3"
                  fill="transparent"
                  strokeDasharray="125.6"
                  animate={{ strokeDashoffset: 125.6 * (1 - countdown / 10) }}
                  transition={{ duration: 1, ease: "linear" }}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] font-bold font-mono text-black dark:text-white leading-none">
                  {Math.ceil(countdown)}s
                </span>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-black dark:text-white mb-0.5 whitespace-nowrap">{t.styleResetToast || 'Style Reset'}</h3>
              <p className="text-[10px] opacity-60 text-black dark:text-white whitespace-nowrap truncate">{t.settingsRestoredToast || 'Settings restored'}</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleUndo}
                className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-full text-xs font-bold hover:opacity-90 transition-opacity active:scale-95 whitespace-nowrap"
              >
                {t.undo || 'Undo'}
              </button>
              <button
                onClick={() => setShowToast(false)}
                className="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors text-black dark:text-white opacity-40 hover:opacity-100 shrink-0"
              >
                <Plus size={16} className="rotate-45" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const INITIAL_DEMO_PRESETS = [
  { start: '#a8ff78', end: '#78ffd6', name: 'Minty Fresh' },
  { start: '#E0C3FC', end: '#8EC5FC', name: 'Lavender' },
  { start: '#ff9a9e', end: '#fad0c4', name: 'Peach' },
  { start: '#2193b0', end: '#6dd5ed', name: 'Cool Blue' },
];

const DemoPresets = () => {
  const { language } = useStore();
  const [activePreset, setActivePreset] = useState(0);
  const [presetList, setPresetList] = useState([...INITIAL_DEMO_PRESETS]);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  
  const safeActive = presetList.length ? Math.min(activePreset, presetList.length - 1) : 0;
  const active = presetList[safeActive];
  const preview = previewIndex === null ? null : presetList[previewIndex];

  const handleRestore = () => {
    setPresetList([...INITIAL_DEMO_PRESETS]);
    setActivePreset(0);
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-md">
      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-120 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md"
            onClick={() => setPreviewIndex(null)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 16 }}
              className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-white/20 bg-white/50 dark:bg-black/40 backdrop-blur-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-black/5 dark:border-white/10">
                <div className="min-w-0">
                  <div className="text-sm font-bold truncate">{preview.name}</div>
                  <div className="text-[10px] opacity-60 truncate">{language === 'zh' ? '单独预览' : 'Quick Preview'}</div>
                </div>
                <button
                  onClick={() => setPreviewIndex(null)}
                  className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="p-6">
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/20">
                  <div
                    className="absolute inset-0"
                    style={{ background: `linear-gradient(135deg, ${preview.start} 0%, ${preview.end} 100%)` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    <div className="w-full h-full bg-white/85 dark:bg-black/35 backdrop-blur-md rounded-2xl p-6 flex flex-col gap-3 shadow-2xl">
                      <div className="w-12 h-2 bg-blue-500/50 rounded-full" />
                      <div className="space-y-2">
                        <div className="w-full h-2 bg-black/5 dark:bg-white/10 rounded-full" />
                        <div className="w-5/6 h-2 bg-black/5 dark:bg-white/10 rounded-full" />
                        <div className="w-4/6 h-2 bg-black/5 dark:bg-white/10 rounded-full" />
                      </div>
                      <div className="mt-auto flex justify-between items-end opacity-60 font-mono uppercase tracking-widest text-[10px]">
                        <span>{language === 'zh' ? '水印' : 'Watermark'}</span>
                        <span>1</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Visual Preview */}
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl group border border-white/20">
        <motion.div 
          key={safeActive}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0"
          style={{ background: active ? `linear-gradient(135deg, ${active.start} 0%, ${active.end} 100%)` : 'linear-gradient(135deg, #e5e7eb 0%, #cbd5e1 100%)' }}
        />
        
        {/* Mock Card */}
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <motion.div 
            animate={{ 
              boxShadow: "2px 5px 15px rgba(0,0,0,0.15)"
            }}
            className="w-full h-full bg-white/90 dark:bg-black/40 backdrop-blur-md rounded-2xl p-6 flex flex-col gap-3"
          >
             <div className="w-12 h-2 bg-blue-500/50 rounded-full" />
             <div className="space-y-2">
               <div className="w-full h-2 bg-black/5 dark:bg-white/10 rounded-full" />
               <div className="w-5/6 h-2 bg-black/5 dark:bg-white/10 rounded-full" />
               <div className="w-4/6 h-2 bg-black/5 dark:bg-white/10 rounded-full" />
             </div>
             <div className="mt-auto flex justify-between items-end">
                <div className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10" />
                <div className="text-[8px] font-bold opacity-20 tracking-widest uppercase">Preset Preview</div>
             </div>
          </motion.div>
        </div>

        {/* Floating Label */}
        <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/20 backdrop-blur-md rounded-full text-[10px] font-bold text-white border border-white/10">
          {active?.name || (language === 'zh' ? '暂无预设' : 'No presets')}
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="flex flex-col items-center gap-4 w-full">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {language === 'zh' ? '点击切换渐变预设' : 'Click to Switch Gradients'}
        </div>
        <div className="flex gap-3">
          {presetList.map((p, i) => (
            <button
              key={i}
              onClick={() => setActivePreset(i)}
              className={`w-10 h-10 rounded-xl border-2 transition-all p-0.5 ${safeActive === i ? 'border-blue-500 scale-110 shadow-lg' : 'border-transparent hover:scale-105'}`}
            >
              <div 
                className="w-full h-full rounded-lg"
                style={{ background: `linear-gradient(135deg, ${p.start} 0%, ${p.end} 100%)` }}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="w-full">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {language === 'zh' ? '单独预览与删除预设' : 'Preview & Delete Presets'}
          </div>
          <button
            onClick={handleRestore}
            className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-md text-blue-500 transition-colors flex items-center gap-1"
            title={language === 'zh' ? '恢复默认预设' : 'Restore Default Presets'}
          >
            <RotateCcw size={10} />
            <span className="text-[8px] font-bold uppercase">{language === 'zh' ? '恢复' : 'Restore'}</span>
          </button>
        </div>
        <div className="grid grid-cols-4 gap-3 justify-items-center">
          {presetList.map((p, i) => (
            <div key={p.name} className="group w-14">
              <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-white/20 shadow-lg transform-gpu">
                <div style={{ background: `linear-gradient(135deg, ${p.start} 0%, ${p.end} 100%)` }} className="absolute inset-0" />
                <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-sm rounded-2xl">
                  <button
                    onClick={() => setPreviewIndex(i)}
                    className="p-1.5 rounded-full bg-white/80 dark:bg-black/40 hover:scale-110 transition-transform"
                    aria-label="Preview"
                  >
                    <Maximize2 size={12} className="text-blue-500" />
                  </button>
                  <button
                    onClick={() => {
                      setPresetList((prev) => prev.filter((_, idx) => idx !== i));
                      setActivePreset((prev) => (prev === i ? 0 : prev > i ? prev - 1 : prev));
                      setPreviewIndex((prev) => (prev === i ? null : prev !== null && prev > i ? prev - 1 : prev));
                    }}
                    className="p-1.5 rounded-full bg-white/80 dark:bg-black/40 hover:scale-110 transition-transform"
                    aria-label="Delete"
                  >
                    <Trash2 size={12} className="text-red-500" />
                  </button>
                </div>
              </div>
              <div className="mt-1 text-[9px] text-center truncate opacity-70">{p.name}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex items-center gap-4 p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10 w-full">
         <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500">
           <Plus size={20} />
         </div>
         <div className="flex-1">
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {language === 'zh' ? '样式预设管理' : 'Style Presets'}
            </div>
            <div className="text-[10px] text-slate-500">
              {language === 'zh' ? '现在您可以一键保存并管理您喜欢的样式组合。' : 'Save and manage your favorite style combinations easily.'}
            </div>
         </div>
      </div>
    </div>
  );
};

const DemoBgImage = () => {
  const { language } = useStore();

  return (
    <div className="w-full max-w-xs space-y-4">
      <div className="text-xs font-bold text-slate-400 uppercase text-center mb-2">
        {language === 'zh' ? '自定义背景' : 'Custom Background'}
      </div>
      
      <div className="relative aspect-video rounded-xl overflow-hidden border border-black/5 dark:border-white/5 bg-slate-100 dark:bg-[#151515] group">
         <motion.div 
           className="absolute inset-0 z-10"
           animate={{ opacity: [0, 1, 1, 0] }}
           transition={{ duration: 4, repeat: Infinity, times: [0, 0.2, 0.8, 1], ease: "easeInOut", repeatDelay: 1 }}
         >
            <img 
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop" 
              className="w-full h-full object-cover"
              alt="demo"
            />
            <div className="absolute inset-0 bg-black/10" />
         </motion.div>
         
         <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-400 z-20 pointer-events-none">
            {/* Mock Card Content */}
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-32 h-20 bg-white/80 dark:bg-black/60 backdrop-blur-md rounded-lg shadow-xl border border-white/20 p-3 flex flex-col gap-1.5"
            >
              <div className="w-8 h-1 bg-blue-500 rounded-full" />
              <div className="space-y-1">
                <div className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-full" />
                <div className="w-4/5 h-1 bg-black/10 dark:bg-white/10 rounded-full" />
                <div className="w-3/5 h-1 bg-black/10 dark:bg-white/10 rounded-full" />
              </div>
              <div className="mt-auto flex justify-between items-center">
                <div className="w-4 h-4 rounded-full bg-black/5 dark:bg-white/5" />
                <div className="text-[6px] font-bold opacity-30 uppercase tracking-tighter">Md2Card</div>
              </div>
            </motion.div>
            
            <div className="flex flex-col items-center mt-2">
               <ImageIcon size={16} className="opacity-40" />
               <span className="text-[8px] font-bold uppercase tracking-widest opacity-30 mt-1">
                 {language === 'zh' ? '自定义预览' : 'Preview'}
               </span>
            </div>
         </div>
      </div>
      
      <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400">
         <CheckCircle2 size={12} className="text-green-500" />
         <span>{language === 'zh' ? '支持动态调整' : 'Supports continuous adjustment'}</span>
       </div>
    </div>
  );
};

const DemoResponsiveLayout = () => {
  const { language } = useStore();
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);

  return (
    <div className="w-full flex flex-col items-center gap-6">
      <div className="text-xs font-bold text-slate-400 uppercase text-center">
        {language === 'zh' ? '智能安全区域演示' : 'Safe Zone Calculation Demo'}
      </div>

      <div className="relative w-full max-w-md aspect-video bg-slate-200 dark:bg-[#151515] rounded-xl border border-black/5 dark:border-white/5 overflow-hidden shadow-sm flex">
        {/* Left Panel */}
        <motion.div 
          animate={{ width: leftOpen ? '30%' : '0%' }}
          className="h-full bg-white/50 dark:bg-white/5 border-r border-black/5 dark:border-white/5 relative overflow-hidden"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[10px] font-mono opacity-30 rotate-90 whitespace-nowrap">EDITOR</span>
          </div>
        </motion.div>

        {/* Center Content */}
        <motion.div 
          className="flex-1 h-full relative flex items-center justify-center"
          animate={{ 
            paddingLeft: leftOpen ? '0px' : '0px', 
            paddingRight: rightOpen ? '0px' : '0px'
          }}
        >
          <div className="absolute inset-0 grid-bg opacity-[0.03]" />
          
          {/* The Card */}
          <motion.div
            layout
            className="w-24 aspect-3/4 bg-white dark:bg-[#202020] rounded-lg shadow-lg border border-black/5 dark:border-white/10 flex flex-col p-2 gap-2 z-10"
          >
            <div className="w-8 h-1 bg-blue-500 rounded-full" />
            <div className="space-y-1">
              <div className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-full" />
              <div className="w-4/5 h-1 bg-black/10 dark:bg-white/10 rounded-full" />
              <div className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-full" />
            </div>
          </motion.div>

          {/* Safe Zone Indicators */}
          <motion.div 
            className="absolute left-0 top-0 bottom-0 border-l-2 border-dashed border-green-500/30"
            animate={{ x: 0 }}
          />
          <motion.div 
            className="absolute right-0 top-0 bottom-0 border-r-2 border-dashed border-green-500/30"
            animate={{ x: 0 }}
          />
          
          <div className="absolute bottom-2 flex gap-4 text-[8px] font-mono opacity-40">
            <motion.span animate={{ opacity: leftOpen ? 1 : 0.3 }}>PAD-L</motion.span>
            <motion.span animate={{ opacity: rightOpen ? 1 : 0.3 }}>PAD-R</motion.span>
          </div>
        </motion.div>

        {/* Right Panel */}
        <motion.div 
          animate={{ width: rightOpen ? '25%' : '0%' }}
          className="h-full bg-white/50 dark:bg-white/5 border-l border-black/5 dark:border-white/5 relative overflow-hidden"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[10px] font-mono opacity-30 -rotate-90 whitespace-nowrap">SIDEBAR</span>
          </div>
        </motion.div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setLeftOpen(!leftOpen)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
            leftOpen 
              ? 'bg-blue-500 text-white border-blue-500' 
              : 'bg-transparent border-black/10 dark:border-white/10 text-slate-500'
          }`}
        >
          {language === 'zh' ? '编辑器' : 'Editor'}
        </button>
        <button
          onClick={() => setRightOpen(!rightOpen)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
            rightOpen 
              ? 'bg-blue-500 text-white border-blue-500' 
              : 'bg-transparent border-black/10 dark:border-white/10 text-slate-500'
          }`}
        >
          {language === 'zh' ? '侧边栏' : 'Sidebar'}
        </button>
      </div>
    </div>
  );
};

const DemoAutoHeight = () => {
  const { language } = useStore();
  const [mode, setMode] = useState<'portrait' | 'landscape' | 'auto'>('portrait');
  
  const isZh = language === 'zh';
  
  return (
    <div className="w-full flex flex-col items-center gap-6">
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        {isZh ? '长图 vs 固定比例' : 'Long Image vs Fixed Aspect Ratio'}
      </div>

      <div className="flex items-center gap-1 bg-white dark:bg-white/5 p-1 rounded-xl border border-black/5 dark:border-white/10 shadow-sm">
        {[
          { id: 'portrait', label: isZh ? '竖屏' : 'Portrait' },
          { id: 'landscape', label: isZh ? '横屏' : 'Landscape' },
          { id: 'auto', label: isZh ? '长图' : 'Long Image' }
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id as 'portrait' | 'landscape' | 'auto')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === m.id 
                ? 'bg-blue-500 text-white shadow-md' 
                : 'text-slate-500 hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="w-full max-w-lg flex justify-center items-center min-h-[300px] p-8 bg-slate-200/30 dark:bg-white/5 rounded-2xl border border-black/5 relative overflow-hidden">
        <motion.div 
          animate={{ 
            width: mode === 'landscape' ? 240 : 160,
            height: mode === 'auto' ? 'auto' : (mode === 'landscape' ? 150 : 220),
          }}
          transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-2xl border border-black/5 dark:border-white/10 p-5 flex flex-col gap-3 overflow-hidden relative"
        >
          {/* Mock Content */}
          <div className="w-12 h-2 bg-blue-500/40 rounded-full shrink-0" />
          <div className="space-y-2 shrink-0">
            <div className="w-full h-1.5 bg-black/5 dark:bg-white/10 rounded-full" />
            <div className="w-full h-1.5 bg-black/5 dark:bg-white/10 rounded-full" />
            <div className="w-2/3 h-1.5 bg-black/5 dark:bg-white/10 rounded-full" />
          </div>
          
          <AnimatePresence mode="wait">
            {mode === 'auto' ? (
              <motion.div 
                key="auto-content"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3 pt-2"
              >
                <div className="w-full h-1.5 bg-black/5 dark:bg-white/10 rounded-full" />
                <div className="w-full h-1.5 bg-black/5 dark:bg-white/10 rounded-full" />
                <div className="w-full h-1.5 bg-black/5 dark:bg-white/10 rounded-full" />
                <div className="w-5/6 h-1.5 bg-black/5 dark:bg-white/10 rounded-full" />
                <div className="w-4/6 h-1.5 bg-black/5 dark:bg-white/10 rounded-full" />
                <div className="w-full h-1.5 bg-black/5 dark:bg-white/10 rounded-full" />
                <div className="w-3/6 h-1.5 bg-black/5 dark:bg-white/10 rounded-full" />
              </motion.div>
            ) : (
              <motion.div 
                key="fixed-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col justify-end"
              >
                <div className="w-full py-4 border-t border-dashed border-black/10 dark:border-white/10 flex items-center justify-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                    {mode === 'portrait' ? 'Fixed 3:4' : 'Fixed 16:10'}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer */}
          <div className="mt-auto pt-4 flex justify-between items-center opacity-20 shrink-0">
            <div className="w-10 h-1 bg-black/20 dark:bg-white/20 rounded-full" />
            <div className="text-[8px] font-bold">1</div>
          </div>

          {/* Cut-off indicator for fixed modes */}
          {mode !== 'auto' && (
            <div className="absolute bottom-10 left-0 right-0 h-12 bg-linear-to-t from-white dark:from-[#1a1a1a] to-transparent pointer-events-none" />
          )}
        </motion.div>

        {/* Info Label */}
        <div className="absolute bottom-4 right-4 bg-black/80 text-white text-[9px] font-bold px-2 py-1 rounded-md shadow-lg">
           {mode === 'auto' 
             ? (isZh ? '高度随内容自动撑开' : 'Height grows with content')
             : (isZh ? '固定高度 (内容可能被截断)' : 'Fixed Height (Content may be cut off)')}
        </div>
      </div>
    </div>
  );
};

const DemoPreviewZoom = () => {
  const { language } = useStore();
  const [zoom, setZoom] = useState(1);
  
  return (
    <div className="w-full flex flex-col items-center gap-6">
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        {language === 'zh' ? '预览缩放演示 (滑条 & 快捷键)' : 'Preview Zoom Demo (Slider & Shortcuts)'}
      </div>

      <div className="w-full max-w-xs flex items-center gap-4 bg-white dark:bg-white/5 p-3 rounded-xl border border-black/5 dark:border-white/10 shadow-sm">
        <Maximize2 size={14} className="opacity-50" />
        <input 
          type="range" 
          min={0.5} 
          max={1.5} 
          step={0.1}
          value={zoom}
          onChange={(e) => setZoom(parseFloat(e.target.value))}
          className="flex-1 accent-blue-500 h-1.5 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer"
        />
        <span className="text-xs font-mono font-bold min-w-[4ch]">{Math.round(zoom * 100)}%</span>
      </div>

      <div className="w-full max-w-lg aspect-video bg-slate-200/30 dark:bg-white/5 rounded-2xl border border-black/5 overflow-hidden flex items-center justify-center relative">
        <motion.div 
          animate={{ scale: zoom }}
          className="w-40 h-56 bg-white dark:bg-[#1a1a1a] rounded-xl shadow-2xl border border-black/5 dark:border-white/10 p-5 flex flex-col gap-3"
        >
          <div className="w-10 h-2 bg-blue-500/40 rounded-full" />
          <div className="space-y-2 mt-2">
            <div className="w-full h-1.5 bg-black/5 dark:bg-white/10 rounded-full" />
            <div className="w-full h-1.5 bg-black/5 dark:bg-white/10 rounded-full" />
            <div className="w-4/5 h-1.5 bg-black/5 dark:bg-white/10 rounded-full" />
          </div>
        </motion.div>
        
        <div className="absolute bottom-4 left-4 flex gap-2">
          <kbd className="px-2 py-1 bg-white dark:bg-black/40 rounded text-[10px] font-bold shadow-sm border border-black/5">Ctrl</kbd>
          <span className="text-[10px] font-bold">+</span>
          <div className="px-2 py-1 bg-white dark:bg-black/40 rounded text-[10px] font-bold shadow-sm border border-black/5 flex items-center gap-1">
             <div className="w-2 h-3 border border-black/20 dark:border-white/20 rounded-sm relative">
                <motion.div 
                  animate={{ y: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="absolute top-0.5 left-0.5 w-1 h-1 bg-blue-500 rounded-full"
                />
             </div>
             <span>Wheel</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const DemoCardPadding = () => {
  const { language } = useStore();
  const [padding, setPadding] = useState(24);
  
  return (
    <div className="w-full flex flex-col items-center gap-6">
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        {language === 'zh' ? '卡片内边距调整演示' : 'Card Padding Adjustment Demo'}
      </div>

      <div className="w-full max-w-xs flex items-center gap-4 bg-white dark:bg-white/5 p-3 rounded-xl border border-black/5 dark:border-white/10 shadow-sm">
        <Layout size={14} className="opacity-50" />
        <input 
          type="range" 
          min={0} 
          max={60} 
          value={padding}
          onChange={(e) => setPadding(parseInt(e.target.value))}
          className="flex-1 accent-blue-500 h-1.5 bg-black/10 dark:border-white/10 rounded-lg appearance-none cursor-pointer"
        />
        <span className="text-xs font-mono font-bold min-w-[3ch]">{padding}px</span>
      </div>

      <div className="w-full max-w-lg aspect-video bg-slate-200/30 dark:bg-white/5 rounded-2xl border border-black/5 flex items-center justify-center">
        <div className="w-48 h-64 bg-slate-300 dark:bg-slate-800 rounded-xl relative overflow-hidden shadow-lg">
           {/* Inner Card representing content area */}
           <motion.div 
             animate={{ 
               top: padding / 2,
               left: padding / 2,
               right: padding / 2,
               bottom: padding / 2
             }}
             className="absolute bg-white dark:bg-[#1a1a1a] rounded-lg shadow-sm p-4 flex flex-col gap-2"
           >
              <div className="w-8 h-2 bg-blue-500/40 rounded-full" />
              <div className="space-y-1.5">
                <div className="w-full h-1.5 bg-black/5 dark:bg-white/10 rounded-full" />
                <div className="w-full h-1.5 bg-black/5 dark:bg-white/10 rounded-full" />
                <div className="w-3/4 h-1.5 bg-black/5 dark:bg-white/10 rounded-full" />
              </div>
           </motion.div>
        </div>
      </div>
    </div>
  );
};

const DemoSmartPagination = () => {
  const { language } = useStore();
  const [isPaginating, setIsPaginating] = useState(false);
  const [cards, setCards] = useState<string[]>([]);
  
  const handlePaginate = () => {
    setIsPaginating(true);
    setCards([]);
    
    // Simulate pagination process
    setTimeout(() => {
      const splitText = language === 'zh'
        ? ["Page 1", "Page 2", "Page 3"]
        : ["Page 1", "Page 2", "Page 3"];
      setCards(splitText);
      setIsPaginating(false);
    }, 800);
  };

  return (
    <div className="w-full flex flex-col items-center gap-6">
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        {language === 'zh' ? '智能自动分页演示' : 'Smart Auto-Pagination Demo'}
      </div>

      <div className="relative w-full max-w-lg aspect-16/10 bg-slate-200/50 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5 overflow-hidden p-6 flex flex-col gap-4">
        {/* Mock Toolbar */}
        <div className="flex items-center gap-2 p-2 bg-white dark:bg-black/40 rounded-xl shadow-sm border border-black/5 dark:border-white/10">
          <div className="w-4 h-4 rounded bg-slate-200 dark:bg-white/10" />
          <div className="w-4 h-4 rounded bg-slate-200 dark:bg-white/10" />
          <div className="w-px h-4 bg-black/10 dark:bg-white/10 mx-1" />
          <button 
            onClick={handlePaginate}
            disabled={isPaginating}
            className={`p-1.5 rounded-lg transition-all ${isPaginating ? 'bg-blue-500/20' : 'hover:bg-blue-500/10 active:scale-95 group'}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={isPaginating ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'}>
              <path 
                d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z" 
                fill="url(#star-gradient-demo)"
                stroke="url(#star-gradient-demo)"
                strokeWidth="1.5"
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <defs>
                <linearGradient id="star-gradient-demo" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#93C5FD" />
                  <stop offset="0.5" stopColor="#60A5FA" />
                  <stop offset="1" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
            </svg>
          </button>
          <div className="ml-auto text-[10px] font-bold text-blue-500/60 uppercase tracking-tighter">
            {language === 'zh' ? '点击星标体验' : 'Click Star to Start'}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 relative overflow-hidden flex gap-4 justify-center items-center">
          <AnimatePresence mode="wait">
            {!cards.length ? (
              <motion.div 
                key="original"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-48 h-64 bg-white dark:bg-[#1a1a1a] rounded-xl shadow-xl border border-black/5 dark:border-white/10 p-4 flex flex-col gap-2 overflow-hidden"
              >
                <div className="w-12 h-2 bg-blue-500/40 rounded-full" />
                <div className="space-y-1.5 mt-2">
                  <div className="w-full h-1.5 bg-black/5 dark:bg-white/10 rounded-full" />
                  <div className="w-full h-1.5 bg-black/5 dark:bg-white/10 rounded-full" />
                  <div className="w-full h-1.5 bg-black/5 dark:bg-white/10 rounded-full" />
                  <div className="w-full h-1.5 bg-black/5 dark:bg-white/10 rounded-full" />
                  <div className="w-full h-1.5 bg-black/5 dark:bg-white/10 rounded-full" />
                  <div className="w-full h-1.5 bg-black/5 dark:bg-white/10 rounded-full" />
                  <div className="w-5/6 h-1.5 bg-black/5 dark:bg-white/10 rounded-full" />
                </div>
                <div className="w-8 h-2 bg-purple-500/30 rounded-full mt-2" />
                <div className="space-y-1.5">
                  <div className="w-full h-1.5 bg-black/5 dark:bg-white/10 rounded-full" />
                  <div className="w-full h-1.5 bg-black/5 dark:bg-white/10 rounded-full" />
                  <div className="w-2/3 h-1.5 bg-black/5 dark:bg-white/10 rounded-full" />
                </div>
              </motion.div>
            ) : (
              <div className="flex gap-3 h-full items-center">
                {cards.map((_, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: 20, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ delay: i * 0.15, type: "spring", damping: 12 }}
                    className="w-28 h-40 bg-white dark:bg-[#1a1a1a] rounded-lg shadow-lg border border-black/5 dark:border-white/10 p-3 flex flex-col gap-1.5 overflow-hidden"
                  >
                    <div className="w-8 h-1.5 bg-blue-500/40 rounded-full" />
                    <div className="space-y-1 mt-1">
                      <div className="w-full h-1 bg-black/5 dark:bg-white/10 rounded-full" />
                      <div className="w-full h-1 bg-black/5 dark:bg-white/10 rounded-full" />
                      <div className="w-5/6 h-1 bg-black/5 dark:bg-white/10 rounded-full" />
                    </div>
                    {i > 0 && <div className="w-6 h-1.5 bg-purple-500/30 rounded-full mt-1" />}
                    {i > 0 && (
                      <div className="space-y-1">
                        <div className="w-full h-1 bg-black/5 dark:bg-white/10 rounded-full" />
                        <div className="w-2/3 h-1 bg-black/5 dark:bg-white/10 rounded-full" />
                      </div>
                    )}
                    <div className="mt-auto flex justify-center">
                      <div className="text-[6px] font-bold opacity-20">{i + 1}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>

          {isPaginating && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/10 dark:bg-black/10 backdrop-blur-[1px] z-10">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles size={24} className="text-blue-500" />
              </motion.div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 p-4 bg-purple-500/5 rounded-2xl border border-purple-500/10 w-full max-w-md">
         <div className="p-2 bg-purple-500/10 rounded-xl text-purple-500">
           <Layout size={20} />
         </div>
         <div className="flex-1">
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {language === 'zh' ? '语义化智能分页' : 'Semantic Smart Pagination'}
            </div>
            <div className="text-[10px] text-slate-500 leading-relaxed">
              {language === 'zh' 
                ? '基于内容块的智能识别，自动避开标题和列表的中间截断，让卡片排版更美观。' 
                : 'Intelligently identifies content blocks to avoid cutting off headings or lists, making card layouts more beautiful.'}
            </div>
         </div>
      </div>
    </div>
  );
};

const DemoOldLayout = () => {
  const { language } = useStore();
  const [val, setVal] = useState(50);

  return (
    <div className="w-full max-w-xs space-y-4">
       <div className="bg-white/50 dark:bg-white/5 p-4 rounded-xl border border-black/5 dark:border-white/5 opacity-60">
          <div className="text-[10px] font-bold text-slate-400 uppercase mb-4 text-center">
            {language === 'zh' ? '旧版布局 (v1.2.0)' : 'Old Layout (v1.2.0)'}
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-medium opacity-50 block">
              {language === 'zh' ? '参数设置' : 'Parameter Setting'}
            </label>
            <div className="flex items-center gap-3">
              <input 
                type="range" 
                min={0} 
                max={100} 
                value={val}
                onChange={(e) => setVal(parseInt(e.target.value))}
                className="flex-1 accent-slate-400 h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-xs font-mono opacity-40 w-8">{val}</span>
            </div>
            <p className="text-[9px] text-red-400/60 leading-tight">
              {language === 'zh' ? '* 旧版参数显示在进度条右侧，容易被遮挡' : '* Parameters displayed next to slider, easily obscured'}
            </p>
          </div>
       </div>
    </div>
  );
};

const DemoLayoutOpt = () => {
  const { language } = useStore();
  const [val, setVal] = useState(50);

  return (
    <div className="w-full max-w-xs space-y-6">
       <div className="bg-white dark:bg-[#151515] p-4 rounded-xl border border-black/5 dark:border-white/5 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase mb-4 text-center">
            {language === 'zh' ? '新版布局样式' : 'New Layout Style'}
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium opacity-70 block">
                {language === 'zh' ? '参数' : 'Parameter'}
              </label>
              <div className="flex items-center gap-1">
                <span className="text-sm font-bold opacity-90 min-w-[2ch] text-right font-mono">{val}</span>
                <span className="text-[10px] opacity-40 font-mono">px</span>
              </div>
            </div>
            <input 
              type="range" 
              min={0} 
              max={100} 
              value={val}
              onChange={(e) => setVal(parseInt(e.target.value))}
              className="w-full accent-blue-500 h-1.5 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer"
            />
          </div>
       </div>

       <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400">
         <CheckCircle2 size={12} className="text-green-500" />
         <span>
           {language === 'zh' ? '优化空间利用与可读性' : 'Optimized for space & readability'}
         </span>
       </div>
    </div>
  );
};
