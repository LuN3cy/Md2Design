const fs = require('fs');

let code = fs.readFileSync('src/components/sidebar/SidebarControls.tsx', 'utf-8');

code = code.replace(
  /RotateCcw, Shuffle/,
  `Shuffle`
);

fs.writeFileSync('src/components/sidebar/SidebarControls.tsx', code);
