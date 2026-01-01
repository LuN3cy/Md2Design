import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';

export const NewYearEffect = () => {
  const [isVisible, setIsVisible] = useState(false);

  const fireworks = () => {
    const duration = 10 * 1000; // 烟花持续时间也改为10s
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: ReturnType<typeof setInterval> = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  useEffect(() => {
    // 每次刷新页面都弹出
    const startTimer = setTimeout(() => {
      setIsVisible(true);
      fireworks();
    }, 1000);

    // 10秒后自动关闭
    const autoCloseTimer = setTimeout(() => {
      setIsVisible(false);
    }, 11000); // 1s 延迟 + 10s 展示

    return () => {
      clearTimeout(startTimer);
      clearTimeout(autoCloseTimer);
    };
  }, []);


  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-100 pointer-events-auto"
        >
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-yellow-500/30 shadow-2xl rounded-2xl px-6 py-4 flex items-center gap-4 relative overflow-hidden group">
            {/* Background Sparkle Effect */}
            <div className="absolute inset-0 bg-linear-to-r from-yellow-500/10 via-transparent to-red-500/10 opacity-50 pointer-events-none" />
            
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-white shadow-lg animate-bounce">
                <Sparkles size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  新年快乐 2026! 🎊
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  愿新的一年，灵感如泉涌。
                </span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 relative z-10"
              title="不再显示"
            >
              <X size={16} />
            </button>

            {/* Shine effect */}
            <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-linear-to-r from-transparent via-white/20 to-transparent group-hover:animate-shine" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
