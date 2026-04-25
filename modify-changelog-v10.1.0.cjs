const fs = require('fs');

let code = fs.readFileSync('src/components/ChangelogModal.tsx', 'utf-8');

const newChangelog = `
    {
      version: 'v10.1.0',
      date: '2026-05-15',
      title: {
        en: 'Mesh Gradients & Customization',
        zh: '弥散渐变与自由定制'
      },
      changes: {
        en: [
          '1. New Background: Added beautiful Mesh Gradients with a frosted glass noise texture.',
          '2. Presets: Included 8 professionally designed mesh gradient presets (e.g., Cosmic Magic, Sunset Vibes).',
          '3. Customization: Support for creating custom mesh gradients by selecting 2-5 base colors.',
          '4. Randomize: Added a "Randomize" button to generate infinite variations of your selected colors.',
        ],
        zh: [
          '1. 全新背景：新增“弥散渐变 (Mesh Gradient)”模式，自带高级的磨砂玻璃噪点质感；',
          '2. 精美预设：内置 8 款专业调色的弥散渐变预设（如星空魔法、晚霞氛围等）；',
          '3. 自由定制：支持自由选择 2-5 组颜色，算法将自动为您生成柔和的弥散渐变背景；',
          '4. 随机生成：新增一键“随机生成”功能，基于您选择的颜色无限生成全新的排版与混合效果。',
        ]
      },
      demo: 'v1010-mesh-gradient'
    },
`;

code = code.replace(
  /const updates = \[/,
  `const updates = [${newChangelog}`
);

fs.writeFileSync('src/components/ChangelogModal.tsx', code);

let pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
pkg.version = '10.1.0';
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\\n');

let pkgLock = JSON.parse(fs.readFileSync('package-lock.json', 'utf-8'));
pkgLock.version = '10.1.0';
pkgLock.packages[''].version = '10.1.0';
fs.writeFileSync('package-lock.json', JSON.stringify(pkgLock, null, 2) + '\\n');
