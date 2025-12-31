export interface LocalFont {
  name: string;
  filename: string;
}

export const injectLocalFontFace = (name: string, filename: string) => {
  const fontId = `font-${name.replace(/\s+/g, '-').toLowerCase()}`;
  if (document.getElementById(fontId)) return;

  const extension = filename.split('.').pop()?.toLowerCase();
  const format = extension === 'otf' ? 'opentype' : 
                 extension === 'woff' ? 'woff' :
                 extension === 'woff2' ? 'woff2' : 'truetype';

  const style = document.createElement('style');
  style.id = fontId;
  style.innerHTML = `
    @font-face {
      font-family: "${name}";
      src: url("fonts/${filename}") format("${format}");
      font-weight: 400;
      font-style: normal;
      font-display: swap;
    }
  `;
  document.head.appendChild(style);
  console.log(`Injected font: ${name} from /fonts/${filename}`);
};

export const injectAllLocalFonts = (fonts: LocalFont[]) => {
  fonts.forEach(font => {
    injectLocalFontFace(font.name, font.filename);
  });
};
