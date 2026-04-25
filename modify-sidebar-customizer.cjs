const fs = require('fs');

let sidebar = fs.readFileSync('src/components/Sidebar.tsx', 'utf-8');

sidebar = sidebar.replace(
  /MeshGradientPresets, CustomSelect/,
  `MeshGradientPresets, MeshColorCustomizer, generateMeshGradient, CustomSelect`
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
                        <MeshColorCustomizer
                          colors={cardStyle.meshColors || ['#ff9a9e', '#fecfef', '#a1c4fd']}
                          onChange={(newColors) => {
                            updateCardStyle({
                              meshColors: newColors,
                              backgroundValue: generateMeshGradient(newColors)
                            });
                          }}
                          onRandomize={() => {
                            const currentColors = cardStyle.meshColors || ['#ff9a9e', '#fecfef', '#a1c4fd'];
                            updateCardStyle({
                              backgroundValue: generateMeshGradient(currentColors)
                            });
                          }}
                        />
                      </div>
                    )}
`;

sidebar = sidebar.replace(
  /\{cardStyle\.backgroundType === 'mesh' && \([\s\S]*?<\/div>\s*\)\}/,
  outerMeshStr.trim()
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
                    <MeshColorCustomizer
                      colors={cardStyle.cardMeshColors || ['#ff9a9e', '#fecfef', '#a1c4fd']}
                      onChange={(newColors) => {
                        updateCardStyle({
                          cardMeshColors: newColors,
                          cardGradientValue: generateMeshGradient(newColors)
                        });
                      }}
                      onRandomize={() => {
                        const currentColors = cardStyle.cardMeshColors || ['#ff9a9e', '#fecfef', '#a1c4fd'];
                        updateCardStyle({
                          cardGradientValue: generateMeshGradient(currentColors)
                        });
                      }}
                    />
                  </div>
                )}
`;

sidebar = sidebar.replace(
  /\{cardStyle\.cardBackgroundType === 'mesh' && \([\s\S]*?<\/div>\s*\)\}/,
  innerMeshStr.trim()
);

fs.writeFileSync('src/components/Sidebar.tsx', sidebar);
