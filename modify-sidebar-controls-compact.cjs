const fs = require('fs');
let code = fs.readFileSync('src/components/sidebar/SidebarControls.tsx', 'utf-8');

const compactPicker = `
export const CompactColorPicker = ({ color = '#000000', onChange }: { color: string, onChange: (color: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  const safeColor = typeof color === 'string' ? color : '#000000';

  const updatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const popoverWidth = 240;
      const popoverHeight = 240;
      let top = rect.bottom + 8;
      let left = rect.left;
      if (top + popoverHeight > window.innerHeight) top = rect.top - popoverHeight - 8;
      if (left + popoverWidth > window.innerWidth) left = window.innerWidth - popoverWidth - 10;
      if (left < 10) left = 10;
      setCoords({ top, left });
    }
  };

  useLayoutEffect(() => { if (isOpen) updatePosition(); }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleScroll = () => { if (isOpen) updatePosition(); };
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
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 rounded-full border border-black/20 dark:border-white/20 shadow-sm relative overflow-hidden transition-transform active:scale-95 flex-shrink-0"
        style={{ backgroundColor: safeColor }}
      />
      {isOpen && createPortal(
        <div
          ref={popoverRef}
          className="fixed z-[9999] p-3 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-black/10 dark:border-white/10"
          style={{ top: coords.top, left: coords.left, width: 'fit-content' }}
        >
          <HexAlphaColorPicker color={safeColor} onChange={onChange} />
        </div>,
        document.body
      )}
    </div>
  );
};
`;

code = code.replace(/<ColorPicker color=\{c\}/g, '<CompactColorPicker color={c}');
code += '\n' + compactPicker;

fs.writeFileSync('src/components/sidebar/SidebarControls.tsx', code);
