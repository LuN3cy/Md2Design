import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';
import path from 'path';

// Custom plugin to generate fonts.json
function generateFontsJson() {
  return {
    name: 'generate-fonts-json',
    buildStart() {
      const fontsDir = path.resolve(__dirname, 'public/fonts');
      if (fs.existsSync(fontsDir)) {
        const files = fs.readdirSync(fontsDir);
        const fontFiles = files.filter(file => /\.(ttf|otf|woff2?)$/i.test(file));
        const fonts = fontFiles.map(file => ({
          name: path.parse(file).name,
          filename: file
        }));
        fs.writeFileSync(
          path.resolve(__dirname, 'public/fonts.json'),
          JSON.stringify(fonts, null, 2)
        );
      }
    },
    handleHotUpdate({ file, server }: { file: string; server: any }) {
      if (file.includes('public/fonts')) {
        const fontsDir = path.resolve(__dirname, 'public/fonts');
        const files = fs.readdirSync(fontsDir);
        const fontFiles = files.filter(file => /\.(ttf|otf|woff2?)$/i.test(file));
        const fonts = fontFiles.map(f => ({
          name: path.parse(f).name,
          filename: f
        }));
        fs.writeFileSync(
          path.resolve(__dirname, 'public/fonts.json'),
          JSON.stringify(fonts, null, 2)
        );
        server.ws.send({
          type: 'full-reload',
          path: '*'
        });
      }
    }
  };
}

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), generateFontsJson()],
  server: {
    host: true,
  }
});
