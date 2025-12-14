import fs from 'fs';
import path from 'path';

const sourceIcon = path.resolve('app-icon.png');
const targetIcon = path.resolve('public', 'logo.png');

if (fs.existsSync(sourceIcon)) {
    fs.copyFileSync(sourceIcon, targetIcon);
    console.log('✅ Updated web icon: public/logo.png');
} else {
    console.warn('⚠️  app-icon.png not found in root directory.');
    console.log('Please place your icon at: ' + sourceIcon);
}
