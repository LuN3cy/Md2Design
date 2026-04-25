const fs = require('fs');
let code = fs.readFileSync('src/components/ChangelogModal.tsx', 'utf-8');

code = code.replace(
  /'4\. Randomize: Added a "Randomize" button to generate infinite variations of your selected colors\.',/,
  `'4. Randomize: Added a "Randomize" button to generate infinite variations of your selected colors.',\n          '5. Noise Controls: Adjust the density, size, or completely disable the frosted glass noise effect.',`
);

code = code.replace(
  /'4\. 随机生成：新增一键“随机生成”功能，基于您选择的颜色无限生成全新的排版与混合效果。',/,
  `'4. 随机生成：新增一键“随机生成”功能，基于您选择的颜色无限生成全新的排版与混合效果。',\n          '5. 噪点控制：新增对噪点材质的独立控制选项，支持自定义噪点密度、尺寸，甚至完全关闭噪点。',`
);

fs.writeFileSync('src/components/ChangelogModal.tsx', code);
