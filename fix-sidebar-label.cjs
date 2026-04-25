const fs = require('fs');
let sidebar = fs.readFileSync('src/components/Sidebar.tsx', 'utf-8');

sidebar = sidebar.replace(/<AdvancedToggle title=\{t\.noiseControls\}>/g, '<AdvancedToggle label={t.noiseControls}>');

fs.writeFileSync('src/components/Sidebar.tsx', sidebar);
