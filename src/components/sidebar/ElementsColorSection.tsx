import { useStore, type CardStyle } from '../../store';
import { useTranslation } from '../../i18n';
import { AdvancedToggle } from './SidebarSection';
import { ColorPicker, ColorSectionWrapper } from './SidebarControls';

export const ElementsColorSection = () => {
  const { cardStyle, updateCardStyle } = useStore();
  const t = useTranslation();

  const handleColorChange = (key: keyof CardStyle, value: string) => {
    updateCardStyle({ [key]: value });
  };

  return (
    <div className="mt-4">
      <ColorPicker 
        label={t.text}
        color={cardStyle.textColor}
        onChange={(val) => handleColorChange('textColor', val)}
      />

      <AdvancedToggle label={t.elementColors}>
        <ColorSectionWrapper>
          <div className="grid grid-cols-2 gap-3">
            <ColorPicker 
              label={t.underlineColor}
              color={cardStyle.underlineColor || '#3b82f6'}
              onChange={(val) => handleColorChange('underlineColor', val)}
            />
            <ColorPicker 
              label={t.strikethroughColor}
              color={cardStyle.strikethroughColor || '#000000'}
              onChange={(val) => handleColorChange('strikethroughColor', val)}
            />
          </div>
        </ColorSectionWrapper>

        <ColorSectionWrapper>
          <div className="grid grid-cols-2 gap-3">
            <ColorPicker 
              label={t.blockquoteBackground}
              color={cardStyle.blockquoteBackgroundColor.substring(0, 7)}
              onChange={(val) => handleColorChange('blockquoteBackgroundColor', val + '20')}
            />
            <ColorPicker 
              label={t.blockquoteBorder}
              color={cardStyle.blockquoteBorderColor}
              onChange={(val) => handleColorChange('blockquoteBorderColor', val)}
            />
          </div>
        </ColorSectionWrapper>

        <ColorSectionWrapper>
          <ColorPicker 
            label={t.codeBackground}
            color={cardStyle.codeBackgroundColor.substring(0, 7)}
            onChange={(val) => handleColorChange('codeBackgroundColor', val + '20')}
          />
        </ColorSectionWrapper>

        <ColorSectionWrapper>
          <div className="grid grid-cols-2 gap-3">
            <ColorPicker 
              label={t.h1Color}
              color={cardStyle.h1Color || '#000000'}
              onChange={(val) => handleColorChange('h1Color', val)}
            />
            <ColorPicker 
              label={t.h1LineColor}
              color={cardStyle.h1LineColor || '#3b82f6'}
              onChange={(val) => handleColorChange('h1LineColor', val)}
            />
          </div>
        </ColorSectionWrapper>

        <ColorSectionWrapper>
          <div className="grid grid-cols-2 gap-3">
            <ColorPicker 
              label={t.h2Color}
              color={cardStyle.h2Color || '#ffffff'}
              onChange={(val) => handleColorChange('h2Color', val)}
            />
            <ColorPicker 
              label={t.h2BgColor}
              color={cardStyle.h2BackgroundColor || '#3b82f6'}
              onChange={(val) => handleColorChange('h2BackgroundColor', val)}
            />
          </div>
        </ColorSectionWrapper>

        <ColorSectionWrapper>
          <div className="grid grid-cols-2 gap-3">
            <ColorPicker 
              label={t.h3Color}
              color={cardStyle.h3Color || '#000000'}
              onChange={(val) => handleColorChange('h3Color', val)}
            />
            <ColorPicker 
              label={t.h3LineColor}
              color={cardStyle.h3LineColor || '#3b82f6'}
              onChange={(val) => handleColorChange('h3LineColor', val)}
            />
          </div>
        </ColorSectionWrapper>
      </AdvancedToggle>
    </div>
  );
};
