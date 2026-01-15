import { Monitor } from 'lucide-react';
import { useStore } from '../../store';
import { useTranslation } from '../../i18n';
import { SidebarSection } from './SidebarSection';

export const CustomCssSection = () => {
  const { cardStyle, updateCardStyle } = useStore();
  const t = useTranslation();

  return (
    <SidebarSection title={t.customCSS} icon={<Monitor size={16} />}>
      <textarea
        id="custom-css-input"
        name="customCSS"
        aria-label={t.customCSS}
        value={cardStyle.customCSS}
        onChange={(e) => updateCardStyle({ customCSS: e.target.value })}
        placeholder=".card { ... }"
        className="w-full h-32 bg-black/5 dark:bg-white/5 p-3 rounded text-xs font-mono resize-none focus:outline-none focus:ring-1 ring-black/20 dark:ring-white/20 border border-black/10 dark:border-white/10 placeholder-black/30 dark:placeholder-white/20"
      />
    </SidebarSection>
  );
};
