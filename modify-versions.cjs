const fs = require('fs');

let code = fs.readFileSync('src/components/ChangelogModal.tsx', 'utf-8');

// Fix version numbers in Changelog
code = code.replace(/version: 'v10\.1\.0'/g, "version: 'v1.11.0'");
code = code.replace(/demo: 'v1010-mesh-gradient'/g, "demo: 'v1110-mesh-gradient'");
code = code.replace(/currentUpdate\.demo === 'v1010-mesh-gradient'/g, "currentUpdate.demo === 'v1110-mesh-gradient'");

code = code.replace(/version: 'v10\.0\.3'/g, "version: 'v1.10.3'");
code = code.replace(/version: 'v10\.0\.2'/g, "version: 'v1.10.2'");
code = code.replace(/version: 'v10\.0\.1'/g, "version: 'v1.10.1'");
code = code.replace(/version: 'v10\.0\.0'/g, "version: 'v1.10.0'");

// Revert the grouping logic back to minor version
const newGrouping = `
  const groupedUpdates = updates.reduce((acc, update) => {
    const versionParts = update.version.split('.');
    const minorVersion = \`\${versionParts[0]}.\${versionParts[1]}\`; // Group by minor version (v1.11, v1.10, etc.)
    if (!acc[minorVersion]) acc[minorVersion] = [];
    acc[minorVersion].push(update);
    return acc;
  }, {} as Record<string, typeof updates>);

  const minorVersions = Object.keys(groupedUpdates).sort((a, b) => {
    const aParts = a.slice(1).split('.').map(Number);
    const bParts = b.slice(1).split('.').map(Number);
    if (aParts[0] !== bParts[0]) return bParts[0] - aParts[0];
    return bParts[1] - aParts[1];
  });
`;

code = code.replace(
  /const groupedUpdates = updates\.reduce\(\(acc, update\) => \{[\s\S]*?return bParts\[0\] - aParts\[0\];\n  \}\);/,
  newGrouping.trim()
);

const newAutoExpand = `
  // Auto-expand group of selected version
  useEffect(() => {
    if (selectedVersion) {
      const versionParts = selectedVersion.split('.');
      const minorVersion = \`\${versionParts[0]}.\${versionParts[1]}\`;
      setExpandedGroups(prev => ({ ...prev, [minorVersion]: true }));
    }
  }, [selectedVersion]);
`;

code = code.replace(
  /\/\/ Auto-expand group of selected version[\s\S]*?\}, \[selectedVersion\]\);/,
  newAutoExpand.trim()
);


fs.writeFileSync('src/components/ChangelogModal.tsx', code);

// Fix package.json
let pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
pkg.version = '1.11.0';
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\\n');

// Fix package-lock.json
let pkgLock = JSON.parse(fs.readFileSync('package-lock.json', 'utf-8'));
pkgLock.version = '1.11.0';
if (pkgLock.packages && pkgLock.packages['']) {
  pkgLock.packages[''].version = '1.11.0';
}
fs.writeFileSync('package-lock.json', JSON.stringify(pkgLock, null, 2) + '\\n');
