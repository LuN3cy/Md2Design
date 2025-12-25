import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Sparkles, RefreshCcw, Monitor, Smartphone, ChevronRight, RotateCcw, Plus, RotateCw, Image as ImageIcon } from 'lucide-react';
import { useTranslation } from '../i18n';
import { useStore } from '../store';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { useState, useEffect } from 'react';

interface ChangelogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangelogModal = ({ isOpen, onClose }: ChangelogModalProps) => {
  const t = useTranslation();
  const { language } = useStore();
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);

  // Update data
  const updates = [
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
  ];

  useEffect(() => {
    if (isOpen && !selectedVersion) {
      setSelectedVersion(updates[0].version);
    }
  }, [isOpen]);

  const currentUpdate = updates.find(u => u.version === selectedVersion) || updates[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
        >
          {/* Backdrop with heavy blur */}
          <div 
            className="absolute inset-0 bg-black/30 dark:bg-black/60 backdrop-blur-md transition-all"
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl h-[80vh] overflow-hidden rounded-3xl shadow-2xl border border-white/20 dark:border-white/10 flex flex-col md:flex-row"
            style={{
              background: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(30px) saturate(180%)',
              WebkitBackdropFilter: 'blur(30px) saturate(180%)',
            }}
          >
             {/* Dark mode override for background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 dark:from-black/80 dark:to-black/90 -z-10" />
            
            {/* Left Sidebar: Version List */}
            <div className="w-full md:w-64 flex-shrink-0 bg-black/5 dark:bg-white/5 border-b md:border-b-0 md:border-r border-black/5 dark:border-white/5 flex flex-col">
               <div className="p-6 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles size={20} className="text-blue-500" />
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t.changelogTitle || "Updates"}</h2>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 opacity-80">Md2Card History</p>
               </div>
               
               <div className="flex-1 overflow-y-auto custom-scrollbar px-3 pb-4 space-y-1">
                  {updates.map((update) => (
                    <button
                      key={update.version}
                      onClick={() => setSelectedVersion(update.version)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center justify-between group ${
                        selectedVersion === update.version 
                          ? 'bg-white dark:bg-white/10 shadow-lg shadow-black/5 dark:shadow-black/20' 
                          : 'hover:bg-black/5 dark:hover:bg-white/5'
                      }`}
                    >
                      <div>
                        <div className={`text-sm font-bold ${selectedVersion === update.version ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}>
                          {update.version}
                        </div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                          {update.date}
                        </div>
                      </div>
                      {selectedVersion === update.version && (
                        <ChevronRight size={14} className="text-blue-500 opacity-100" />
                      )}
                    </button>
                  ))}
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

                    <div className="space-y-3 mb-10">
                      {(language === 'zh' ? currentUpdate.changes.zh : currentUpdate.changes.en).map((change, i) => (
                        <div key={i} className="flex items-start gap-3 text-slate-600 dark:text-slate-300 leading-relaxed group">
                          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500/40 group-hover:bg-blue-500 transition-colors shrink-0" />
                          <span>{change}</span>
                        </div>
                      ))}
                    </div>

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

                         {currentUpdate.demo === 'markdown-breaks' && (
                           <div className="bg-slate-100 dark:bg-[#0a0a0a] rounded-2xl p-4 md:p-6 border border-black/5 dark:border-white/5 shadow-inner">
                             <DemoMarkdown />
                           </div>
                         )}
                         
                         {currentUpdate.demo === 'reset-undo' && (
                           <div className="bg-slate-100 dark:bg-[#0a0a0a] rounded-2xl p-8 border border-black/5 dark:border-white/5 shadow-inner flex items-center justify-center min-h-[200px] overflow-hidden relative">
                              <DemoResetUndo />
                           </div>
                         )}

                         {currentUpdate.demo === 'bg-layout' && (
                           <div className="bg-slate-100 dark:bg-[#0a0a0a] rounded-2xl p-8 border border-black/5 dark:border-white/5 shadow-inner flex flex-col md:flex-row items-center gap-8 justify-center min-h-[200px]">
                              <DemoBgImage />
                              <div className="h-px w-full md:w-px md:h-24 bg-black/10 dark:bg-white/10" />
                              <DemoLayoutOpt />
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

const DemoMarkdown = () => {
  const { language } = useStore();
  const [text, setText] = useState(language === 'zh' ? "在此输入...\n按回车换行。" : "Type here...\nPress Enter to break line.");
  
  return (
    <div className="flex flex-col md:flex-row gap-6 h-[320px]">
      {/* Editor Side */}
      <div className="flex-1 flex flex-col gap-2">
        <div className="text-xs font-bold text-slate-500 uppercase">{language === 'zh' ? '编辑器' : 'Editor'}</div>
        <textarea
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
          <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900" />
          
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
      setIsActive(false);
      setShowToast(false);
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
            <div className="relative w-12 h-12 flex-shrink-0 flex items-center justify-center">
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
                className="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors text-black dark:text-white opacity-40 hover:opacity-100 flex-shrink-0"
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
         
         <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-400">
            <ImageIcon size={24} />
            <span className="text-[10px] font-medium opacity-60">
              {language === 'zh' ? '背景展示区域' : 'Background Area'}
            </span>
         </div>
      </div>
      
      <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400">
         <CheckCircle2 size={12} className="text-green-500" />
         <span>{language === 'zh' ? '支持动态调整' : 'Supports continuous adjustment'}</span>
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
