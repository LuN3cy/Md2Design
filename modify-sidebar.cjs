const fs = require('fs');

let sidebar = fs.readFileSync('src/components/Sidebar.tsx', 'utf-8');

sidebar = sidebar.replace(
  /GradientPresets, CustomSelect/,
  `GradientPresets, MeshGradientPresets, CustomSelect`
);

sidebar = sidebar.replace(
  /\['solid', 'gradient', 'image'\]\.map\(\(type\)/,
  `['solid', 'gradient', 'mesh', 'image'].map((type)`
);

sidebar = sidebar.replace(
  /\['solid', 'gradient', 'image'\]\.map\(\(type\)/,
  `['solid', 'gradient', 'mesh', 'image'].map((type)`
);

const outerMeshStr = `
                    {cardStyle.backgroundType === 'mesh' && (
                      <div className="space-y-3">
                        <MeshGradientPresets
                          onSelect={(value) => {
                            updateCardStyle({
                              backgroundValue: value
                            });
                          }}
                        />
                      </div>
                    )}
`;
sidebar = sidebar.replace(
  /\{cardStyle.backgroundType === 'gradient' && \(/,
  outerMeshStr + "\n                    {cardStyle.backgroundType === 'gradient' && ("
);


const innerMeshStr = `
                {cardStyle.cardBackgroundType === 'mesh' && (
                  <div className="space-y-3">
                    <MeshGradientPresets
                      onSelect={(value) => {
                        updateCardStyle({
                          cardGradientValue: value
                        });
                      }}
                    />
                  </div>
                )}
`;
sidebar = sidebar.replace(
  /\{cardStyle.cardBackgroundType === 'gradient' && \(/,
  innerMeshStr + "\n                {cardStyle.cardBackgroundType === 'gradient' && ("
);

fs.writeFileSync('src/components/Sidebar.tsx', sidebar);
