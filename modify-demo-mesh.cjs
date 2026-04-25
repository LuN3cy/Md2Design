const fs = require('fs');

let code = fs.readFileSync('src/components/ChangelogModal.tsx', 'utf-8');

const newDemo = `
const DemoMeshGradient = () => {
  const [key, setKey] = useState(0);
  
  const colors = ['#ff9a9e', '#fecfef', '#a1c4fd'];
  const baseColor = colors[2];
  const noiseSVG = \`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E")\`;
  
  // Use useMemo with key as dependency to trigger re-generation
  const background = useMemo(() => {
    const radials = colors.slice(0, 2).map((col) => {
      const x = Math.floor(Math.random() * 100);
      const y = Math.floor(Math.random() * 100);
      const spread = Math.floor(Math.random() * 40) + 40;
      return \`radial-gradient(at \${x}% \${y}%, \${col} 0px, transparent \${spread}%)\`;
    });
    return \`\${noiseSVG}, \${radials.join(', ')}, \${baseColor}\`;
  }, [key]);

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black flex flex-col items-center justify-center border border-white/10 group shadow-lg">
        <div 
          className="absolute inset-0 transition-all duration-1000 ease-in-out" 
          style={{ background }} 
        />
        
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-black/20 backdrop-blur-md border border-white/20 shadow-xl">
             <div className="w-6 h-6 rounded-full bg-[#ff9a9e] shadow-md border border-white/20" />
             <div className="w-6 h-6 rounded-full bg-[#fecfef] shadow-md border border-white/20" />
             <div className="w-6 h-6 rounded-full bg-[#a1c4fd] shadow-md border border-white/20" />
             
             <button 
               onClick={() => setKey(k => k + 1)}
               className="ml-2 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors active:scale-95 group/btn cursor-pointer"
             >
               <Shuffle className="text-white opacity-90 group-hover/btn:rotate-180 transition-transform duration-500" size={16} />
             </button>
          </div>
        </div>
      </div>
      <div className="text-[10px] text-slate-400 text-center font-medium opacity-70">
        Try clicking the shuffle button to generate new patterns!
      </div>
    </div>
  );
};
`;

code = code.replace(/const DemoMeshGradient = \(\) => \{[\s\S]*?<\/div>\s*<\/div>\s*\);\s*\};/, newDemo.trim());

// Add useMemo to imports if not there
if (!code.includes('useMemo')) {
  code = code.replace(/import \{ useState, useEffect, useRef \} from 'react';/, "import { useState, useEffect, useRef, useMemo } from 'react';");
}

fs.writeFileSync('src/components/ChangelogModal.tsx', code);
