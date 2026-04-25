const fs = require('fs');

let sidebar = fs.readFileSync('src/components/Sidebar.tsx', 'utf-8');

sidebar = sidebar.replace(
  /generateMeshGradient, CustomSelect/,
  `generateMeshGradient, applyNoise, CustomSelect`
);

const outerMeshControls = `
                    {cardStyle.backgroundType === 'mesh' && (
                      <div className="space-y-3">
                        <MeshGradientPresets
                          onSelect={(value) => {
                            updateCardStyle({
                              backgroundValue: applyNoise(value, cardStyle.meshNoiseEnable, cardStyle.meshNoiseOpacity, cardStyle.meshNoiseSize)
                            });
                          }}
                        />
                        <MeshColorCustomizer
                          colors={cardStyle.meshColors || ['#ff9a9e', '#fecfef', '#a1c4fd']}
                          onChange={(newColors) => {
                            updateCardStyle({
                              meshColors: newColors,
                              backgroundValue: generateMeshGradient(newColors, cardStyle.meshNoiseEnable, cardStyle.meshNoiseOpacity, cardStyle.meshNoiseSize)
                            });
                          }}
                          onRandomize={() => {
                            const currentColors = cardStyle.meshColors || ['#ff9a9e', '#fecfef', '#a1c4fd'];
                            updateCardStyle({
                              backgroundValue: generateMeshGradient(currentColors, cardStyle.meshNoiseEnable, cardStyle.meshNoiseOpacity, cardStyle.meshNoiseSize)
                            });
                          }}
                        />
                        
                        <AdvancedToggle title={t.noiseControls}>
                          <div className="space-y-4 pt-2">
                            <label className="flex items-center gap-2 cursor-pointer group">
                              <div className={\`w-10 h-5 rounded-full p-1 transition-colors \${cardStyle.meshNoiseEnable ? 'bg-blue-500' : 'bg-black/10 dark:bg-white/10'}\`}>
                                <div className={\`w-3 h-3 bg-white rounded-full transition-transform \${cardStyle.meshNoiseEnable ? 'translate-x-5' : 'translate-x-0'}\`} />
                              </div>
                              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-black dark:group-hover:text-white transition-colors">{t.enableNoise}</span>
                            </label>
                            
                            <div className={\`space-y-4 transition-opacity \${cardStyle.meshNoiseEnable ? 'opacity-100' : 'opacity-50 pointer-events-none'}\`}>
                              <div className="flex gap-4">
                                <DraggableNumberInput 
                                  value={cardStyle.meshNoiseOpacity} 
                                  min={0.01} max={1} step={0.01} 
                                  label={t.noiseDensity}
                                  icon={<ParameterIcon type="opacity" />}
                                  onChange={(val) => updateCardStyle({ 
                                    meshNoiseOpacity: val,
                                    backgroundValue: applyNoise(cardStyle.backgroundValue, cardStyle.meshNoiseEnable, val, cardStyle.meshNoiseSize)
                                  })} 
                                />
                                <DraggableNumberInput 
                                  value={cardStyle.meshNoiseSize} 
                                  min={0.1} max={5} step={0.1} 
                                  label={t.noiseSize}
                                  icon={<ParameterIcon type="scale" />}
                                  onChange={(val) => updateCardStyle({ 
                                    meshNoiseSize: val,
                                    backgroundValue: applyNoise(cardStyle.backgroundValue, cardStyle.meshNoiseEnable, cardStyle.meshNoiseOpacity, val)
                                  })} 
                                />
                              </div>
                            </div>
                          </div>
                        </AdvancedToggle>
                      </div>
                    )}
`;

sidebar = sidebar.replace(
  /\{cardStyle\.backgroundType === 'mesh' && \([\s\S]*?<\/div>\s*\)\}/,
  outerMeshControls.trim()
);

const innerMeshControls = `
                {cardStyle.cardBackgroundType === 'mesh' && (
                  <div className="space-y-3">
                    <MeshGradientPresets
                      onSelect={(value) => {
                        updateCardStyle({
                          cardGradientValue: applyNoise(value, cardStyle.cardMeshNoiseEnable, cardStyle.cardMeshNoiseOpacity, cardStyle.cardMeshNoiseSize)
                        });
                      }}
                    />
                    <MeshColorCustomizer
                      colors={cardStyle.cardMeshColors || ['#ff9a9e', '#fecfef', '#a1c4fd']}
                      onChange={(newColors) => {
                        updateCardStyle({
                          cardMeshColors: newColors,
                          cardGradientValue: generateMeshGradient(newColors, cardStyle.cardMeshNoiseEnable, cardStyle.cardMeshNoiseOpacity, cardStyle.cardMeshNoiseSize)
                        });
                      }}
                      onRandomize={() => {
                        const currentColors = cardStyle.cardMeshColors || ['#ff9a9e', '#fecfef', '#a1c4fd'];
                        updateCardStyle({
                          cardGradientValue: generateMeshGradient(currentColors, cardStyle.cardMeshNoiseEnable, cardStyle.cardMeshNoiseOpacity, cardStyle.cardMeshNoiseSize)
                        });
                      }}
                    />
                    
                    <AdvancedToggle title={t.noiseControls}>
                      <div className="space-y-4 pt-2">
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <div className={\`w-10 h-5 rounded-full p-1 transition-colors \${cardStyle.cardMeshNoiseEnable ? 'bg-blue-500' : 'bg-black/10 dark:bg-white/10'}\`}>
                            <div className={\`w-3 h-3 bg-white rounded-full transition-transform \${cardStyle.cardMeshNoiseEnable ? 'translate-x-5' : 'translate-x-0'}\`} />
                          </div>
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-black dark:group-hover:text-white transition-colors">{t.enableNoise}</span>
                        </label>
                        
                        <div className={\`space-y-4 transition-opacity \${cardStyle.cardMeshNoiseEnable ? 'opacity-100' : 'opacity-50 pointer-events-none'}\`}>
                          <div className="flex gap-4">
                            <DraggableNumberInput 
                              value={cardStyle.cardMeshNoiseOpacity} 
                              min={0.01} max={1} step={0.01} 
                              label={t.noiseDensity}
                              icon={<ParameterIcon type="opacity" />}
                              onChange={(val) => updateCardStyle({ 
                                cardMeshNoiseOpacity: val,
                                cardGradientValue: applyNoise(cardStyle.cardGradientValue, cardStyle.cardMeshNoiseEnable, val, cardStyle.cardMeshNoiseSize)
                              })} 
                            />
                            <DraggableNumberInput 
                              value={cardStyle.cardMeshNoiseSize} 
                              min={0.1} max={5} step={0.1} 
                              label={t.noiseSize}
                              icon={<ParameterIcon type="scale" />}
                              onChange={(val) => updateCardStyle({ 
                                cardMeshNoiseSize: val,
                                cardGradientValue: applyNoise(cardStyle.cardGradientValue, cardStyle.cardMeshNoiseEnable, cardStyle.cardMeshNoiseOpacity, val)
                              })} 
                            />
                          </div>
                        </div>
                      </div>
                    </AdvancedToggle>
                  </div>
                )}
`;

sidebar = sidebar.replace(
  /\{cardStyle\.cardBackgroundType === 'mesh' && \([\s\S]*?<\/div>\s*\)\}/,
  innerMeshControls.trim()
);

sidebar = sidebar.replace(/onClick=\{\(\) => updateCardStyle\(\{ \n\s*meshNoiseEnable/g, "onChange={(e) => updateCardStyle({ meshNoiseEnable: e.target.checked })}");

// For the toggles, they are labels wrapping div, let's fix them to work correctly.
sidebar = sidebar.replace(/<label className="flex items-center gap-2 cursor-pointer group">([\s\S]*?)<\/label>/g, (match) => {
  if (match.includes('meshNoiseEnable')) {
    return match.replace(/<label /, '<label onClick={() => updateCardStyle({ meshNoiseEnable: !cardStyle.meshNoiseEnable, backgroundValue: applyNoise(cardStyle.backgroundValue, !cardStyle.meshNoiseEnable, cardStyle.meshNoiseOpacity, cardStyle.meshNoiseSize) })} ');
  } else if (match.includes('cardMeshNoiseEnable')) {
    return match.replace(/<label /, '<label onClick={() => updateCardStyle({ cardMeshNoiseEnable: !cardStyle.cardMeshNoiseEnable, cardGradientValue: applyNoise(cardStyle.cardGradientValue, !cardStyle.cardMeshNoiseEnable, cardStyle.cardMeshNoiseOpacity, cardStyle.cardMeshNoiseSize) })} ');
  }
  return match;
});

fs.writeFileSync('src/components/Sidebar.tsx', sidebar);
