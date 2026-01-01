import React, { useState, useRef, useEffect, useLayoutEffect, useId } from 'react';
import { createPortal } from 'react-dom';
import { HexColorPicker } from 'react-colorful';
import { PRESET_GRADIENTS } from '../../store';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

export const CustomSelect = ({ 
  value, 
  options, 
  onChange, 
  placeholder 
}: { 
  value: string, 
  options: { name: string, value: string }[], 
  onChange: (val: string) => void,
  placeholder: string
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // If clicking the button itself, let the button's onClick handler handle it
      if (buttonRef.current && buttonRef.current.contains(target)) {
        return;
      }

      // If clicking inside the dropdown menu, don't close
      if (dropdownRef.current && dropdownRef.current.contains(target)) {
        return;
      }

      setIsOpen(false);
    };

    if (isOpen) {
      // Use capture phase to handle events before they might be stopped
      document.addEventListener('mousedown', handleClickOutside, true);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, [isOpen]);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative" ref={containerRef}>
      <button
        ref={buttonRef}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg p-2.5 text-xs flex items-center justify-between hover:bg-black/10 dark:hover:bg-white/10 transition-all cursor-pointer group"
      >
        <span className={`truncate transition-opacity ${value ? "opacity-100 font-medium" : "opacity-40"}`}>
          {selectedOption ? selectedOption.name : placeholder}
        </span>
        <ChevronDown size={14} className={`opacity-40 transition-transform duration-200 group-hover:opacity-60 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <AnimatePresence>
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.1 }}
            className="absolute left-0 right-0 mt-1 bg-white dark:bg-[#2a2a2a] border border-black/10 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden py-1.5 backdrop-blur-xl z-100"
            style={{ 
              maxHeight: '240px'
            }}
          >
            <div className="max-h-[230px] overflow-y-auto custom-scrollbar overflow-x-hidden">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 text-xs transition-colors hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-between group ${
                    value === opt.value ? 'bg-black/5 dark:bg-white/10 font-semibold text-blue-500' : 'opacity-100'
                  }`}
                  style={{ fontFamily: opt.value }}
                >
                  <span className="truncate">{opt.name}</span>
                  {value === opt.value && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      <Check size={14} />
                    </motion.div>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export const MarginIcon = ({ side }: { side: 'top' | 'right' | 'bottom' | 'left' | 'all' }) => {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-70">
      <rect x="2.5" y="2.5" width="9" height="9" rx="1" stroke="currentColor" strokeOpacity="0.3" strokeDasharray="2 2" />
      {side === 'top' && <path d="M3 2H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
      {side === 'bottom' && <path d="M3 12H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
      {side === 'left' && <path d="M2 3V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
      {side === 'right' && <path d="M12 3V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
      {side === 'all' && <rect x="2.5" y="2.5" width="9" height="9" rx="1" stroke="currentColor" strokeWidth="1.5" />}
    </svg>
  );
};

export const ParameterIcon = ({ type }: { type: 'radius' | 'width' | 'border' | 'x' | 'y' | 'blur' | 'spread' | 'opacity' | 'angle' | 'scale' | 'fontSize' }) => {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-70">
      <rect x="0.5" y="0.5" width="13" height="13" rx="2" stroke="currentColor" strokeOpacity="0.5" />
      {type === 'radius' && <path d="M4 4H7C8.65685 4 10 5.34315 10 7V10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />}
      
      {type === 'width' && <path d="M3 7H11M3 7L5 5M3 7L5 9M11 7L9 5M11 7L9 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />}
      
      {type === 'border' && <rect x="3" y="3" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" />}
      
      {type === 'x' && <path d="M3 7H11M11 7L9 5M11 7L9 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />}
      {type === 'y' && <path d="M7 3V11M7 11L5 9M7 11L9 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />}
      
      {type === 'blur' && <circle cx="7" cy="7" r="3" fill="currentColor" fillOpacity="0.5" style={{ filter: 'blur(1px)' }} />}
      
      {type === 'spread' && <rect x="3" y="3" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />}
      
      {type === 'opacity' && <path d="M7 1V13M7 13C3.68629 13 1 10.3137 1 7C1 3.68629 3.68629 1 7 1V13Z" fill="currentColor" fillOpacity="0.5" />}
      
      {type === 'angle' && <path d="M7 3C9.20914 3 11 4.79086 11 7C11 9.20914 9.20914 11 7 11M7 3V7H11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />}
      
      {type === 'scale' && <path d="M4 10L10 4M10 4H7M10 4V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />}
      
      {type === 'fontSize' && <path d="M4 10L7 4L10 10M5.5 8H8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />}
    </svg>
  );
};

export const DraggableNumberInput = ({ 
  value, 
  onChange, 
  min = 0, 
  max = 200, 
  step = 1,
  icon,
  label
}: { 
  value: number, 
  onChange: (val: number) => void, 
  min?: number, 
  max?: number, 
  step?: number,
  icon: React.ReactNode,
  label?: string
}) => {
  const inputId = useId();
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value.toString());
  const startX = useRef(0);
  const startValue = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const delta = e.clientX - startX.current;
      const sensitivity = step < 1 ? 0.01 : 0.5;
      const change = delta * sensitivity;
      const rawValue = startValue.current + change;
      
      const steppedValue = Math.round(rawValue / step) * step;
      const newValue = Math.max(min, Math.min(max, steppedValue));
      
      const finalValue = parseFloat(newValue.toFixed(step < 1 ? 2 : 0));
      onChange(finalValue);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.cursor = '';
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'ew-resize';
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
    };
  }, [isDragging, min, max, step, onChange]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isEditing) return;
    e.preventDefault();
    setIsDragging(true);
    startX.current = e.clientX;
    startValue.current = value;
  };

  const handleInputBlur = () => {
    setIsEditing(false);
    let newValue = parseFloat(inputValue);
    if (isNaN(newValue)) {
      setInputValue(value.toString());
      return;
    }
    newValue = Math.max(min, Math.min(max, newValue));
    const finalValue = parseFloat(newValue.toFixed(step < 1 ? 2 : 0));
    onChange(finalValue);
    setInputValue(finalValue.toString());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleInputBlur();
      inputRef.current?.blur();
    } else if (e.key === 'Escape') {
      setInputValue(value.toString());
      setIsEditing(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div className="space-y-1.5 flex-1">
      {label && (
        <div className="flex items-center justify-between px-0.5">
          <span className="text-[10px] font-bold opacity-40 uppercase tracking-wider">{label}</span>
        </div>
      )}
      <div 
        className={`relative group flex items-center bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg overflow-hidden transition-colors hover:bg-black/10 dark:hover:bg-white/10 ${isDragging ? 'bg-black/10 dark:bg-white/10 ring-1 ring-blue-500/50' : ''} ${isEditing ? 'ring-1 ring-blue-500 bg-white dark:bg-black/20' : ''} cursor-ew-resize h-9`}
        onMouseDown={handleMouseDown}
        title="Drag anywhere to adjust, Click value to type"
      >
        <div className="pl-3 pr-2 text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors pointer-events-none flex items-center h-full">
          {icon}
        </div>
        <div className="flex-1 relative h-full flex items-center justify-end pr-2">
          {isEditing ? (
            <input
              id={inputId}
              name={label || 'number-input'}
              aria-label={label || 'Number Input'}
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onBlur={handleInputBlur}
              onKeyDown={handleKeyDown}
              className="w-12 py-1 text-center font-mono text-xs font-medium bg-white dark:bg-black/40 rounded border border-blue-500 outline-none text-slate-800 dark:text-slate-100 cursor-text shadow-sm"
            />
          ) : (
            <div 
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
                setTimeout(() => {
                  inputRef.current?.focus();
                  inputRef.current?.select();
                }, 0);
              }}
              className="min-w-[32px] px-1 py-1 text-center font-mono text-xs font-medium select-none text-slate-700 dark:text-slate-300 cursor-text transition-colors flex items-center justify-center h-full"
            >
              {value}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const ColorPicker = ({ color, onChange, label }: { color: string, onChange: (color: string) => void, label?: string }) => {
  const inputId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  const updatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const popoverWidth = 240; // Approx width of our popover
      const popoverHeight = 240; // Approx height
      
      let top = rect.bottom + 8;
      let left = rect.right - popoverWidth;

      // Check if it goes off screen bottom
      if (top + popoverHeight > window.innerHeight) {
        top = rect.top - popoverHeight - 8;
      }

      // Check if it goes off screen left
      if (left < 10) {
        left = 10;
      }

      setCoords({ top, left });
    }
  };

  useLayoutEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line
      updatePosition();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => {
      if (isOpen) {
        // If the scroll happened in a parent of the button, update position
        updatePosition();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', updatePosition);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen]);

  return (
    <div className="relative">
      <div className="flex flex-col gap-2">
        {label && <span className="text-xs opacity-70">{label}</span>}
        <div className="flex items-center gap-2 w-full">
          <div className="relative flex-1">
            <input 
              id={inputId}
              name={label || 'color-input'}
              aria-label={label || 'Color Input'}
              type="text" 
              value={color.toUpperCase()} 
              onChange={(e) => onChange(e.target.value)}
              className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded px-2 py-2 text-[10px] font-mono focus:outline-none focus:border-black/30 dark:focus:border-white/30 text-center"
            />
          </div>
          <button 
            ref={buttonRef}
            onClick={() => setIsOpen(!isOpen)}
            className="w-8 h-8 rounded-full border border-black/20 dark:border-white/20 shadow-sm relative overflow-hidden transition-transform active:scale-95 shrink-0"
            style={{ backgroundColor: color }}
          />
        </div>
      </div>
      
      {isOpen && createPortal(
        <div 
          ref={popoverRef} 
          className="fixed z-9999 p-3 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-black/10 dark:border-white/10"
          style={{ 
            top: coords.top, 
            left: coords.left,
            width: 'fit-content'
          }}
        >
          <HexColorPicker color={color} onChange={onChange} />
        </div>,
        document.body
      )}
    </div>
  );
};

export const GradientPresets = ({ onSelect }: { onSelect: (start: string, end: string) => void }) => {
  return (
    <div className="grid grid-cols-4 gap-2 mt-2">
      {PRESET_GRADIENTS.map((g, i) => (
        <button
          key={i}
          onClick={() => onSelect(g.start, g.end)}
          className="w-full aspect-square rounded-md border border-black/10 dark:border-white/10 transition-transform active:scale-95 hover:scale-105"
          style={{ background: `linear-gradient(135deg, ${g.start} 0%, ${g.end} 100%)` }}
          title={g.name}
        />
      ))}
    </div>
  );
};
