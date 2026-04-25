const fs = require('fs');
const content = fs.readFileSync('src/components/Preview.tsx', 'utf-8');

const mOuter = content.match(/const renderOuterBackground = \(\) => \{[\s\S]*?return \(\s*<div\s*className="absolute inset-0 transition-colors duration-200"[\s\S]*?\);\s*\};/);
if (mOuter) console.log(mOuter[0]);

const mInner = content.match(/const renderInnerBackground = \(\) => \{[\s\S]*?return \(\s*<div\s*className="absolute inset-0 transition-colors duration-200 pointer-events-none"[\s\S]*?\);\s*\};/);
if (mInner) console.log(mInner[0]);
