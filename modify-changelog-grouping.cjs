const fs = require('fs');

let code = fs.readFileSync('src/components/ChangelogModal.tsx', 'utf-8');

const newGrouping = `
  const groupedUpdates = updates.reduce((acc, update) => {
    const versionParts = update.version.split('.');
    const minorVersion = \`\${versionParts[0]}\`; // Group by major version (v10, v1, etc.)
    if (!acc[minorVersion]) acc[minorVersion] = [];
    acc[minorVersion].push(update);
    return acc;
  }, {} as Record<string, typeof updates>);

  const minorVersions = Object.keys(groupedUpdates).sort((a, b) => {
    const aParts = a.slice(1).split('.').map(Number);
    const bParts = b.slice(1).split('.').map(Number);
    return bParts[0] - aParts[0];
  });
`;

code = code.replace(
  /const groupedUpdates = updates\.reduce\(\(acc, update\) => \{[\s\S]*?return bParts\[1\] - aParts\[1\];\n  \}\);/,
  newGrouping.trim()
);

const newAutoExpand = `
  // Auto-expand group of selected version
  useEffect(() => {
    if (selectedVersion) {
      const versionParts = selectedVersion.split('.');
      const minorVersion = \`\${versionParts[0]}\`;
      setExpandedGroups(prev => ({ ...prev, [minorVersion]: true }));
    }
  }, [selectedVersion]);
`;

code = code.replace(
  /\/\/ Auto-expand group of selected version[\s\S]*?\}, \[selectedVersion\]\);/,
  newAutoExpand.trim()
);

const newTitle = `
                      {minorVersions.map(group => (
                        <div key={group} className="space-y-1">
                          <button
                            onClick={() => setExpandedGroups(prev => ({ ...prev, [group]: !prev[group] }))}
                            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                          >
                            <span className="text-xs font-bold text-slate-400">{group}.x</span>
                            <ChevronDown
                              size={14}
                              className={\`text-slate-400 transition-transform duration-200 \${expandedGroups[group] ? 'rotate-180' : ''}\`}
                            />
                          </button>
`;

code = code.replace(
  /\{minorVersions\.map\(group => \([\s\S]*?<span className="text-xs font-bold text-slate-400">\{group\}\.x<\/span>/,
  newTitle.trim()
);


fs.writeFileSync('src/components/ChangelogModal.tsx', code);
