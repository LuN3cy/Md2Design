const fs = require('fs');
let sidebar = fs.readFileSync('src/components/Sidebar.tsx', 'utf-8');

sidebar = sidebar.replace(/<label onClick=\{[\s\S]*?<\/label>/g, (match) => {
  return match.replace(/label/g, 'div');
});

fs.writeFileSync('src/components/Sidebar.tsx', sidebar);
