const fs = require('fs');

let code = fs.readFileSync('src/components/ChangelogModal.tsx', 'utf-8');

const meshDemoDiv = `
                         {currentUpdate.demo === 'v1010-mesh-gradient' && (
                           <div className="bg-slate-100 dark:bg-[#0a0a0a] rounded-2xl p-6 md:p-8 border border-black/5 dark:border-white/10 shadow-inner min-h-[300px] flex flex-col items-center justify-center">
                              <DemoMeshGradient />
                           </div>
                         )}
`;

code = code.replace(
  /\{currentUpdate\.demo === 'v190-features' && \(/,
  `${meshDemoDiv.trim()}\n\n                         {currentUpdate.demo === 'v190-features' && (`
);

const meshDemoComp = `
const DemoMeshGradient = () => {
  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black flex flex-col items-center justify-center border border-white/10 group">
        <div className="absolute inset-0" style={{
          background: \`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E"), radial-gradient(at 80% 0%, hsla(289,100%,56%,1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(335,100%,53%,1) 0px, transparent 50%), radial-gradient(at 80% 50%, hsla(240,100%,56%,1) 0px, transparent 50%), radial-gradient(at 0% 100%, hsla(22,100%,77%,1) 0px, transparent 50%), #341d65\`
        }} />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="relative z-10 w-24 h-24 rounded-full blur-2xl opacity-60 bg-gradient-to-r from-[#ff9a9e] to-[#fecfef]"
        />
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-black/20 backdrop-blur-md border border-white/20 shadow-xl">
             <div className="w-6 h-6 rounded-full bg-[#ff9a9e] shadow-md border border-white/20" />
             <div className="w-6 h-6 rounded-full bg-[#fecfef] shadow-md border border-white/20" />
             <div className="w-6 h-6 rounded-full bg-[#a1c4fd] shadow-md border border-white/20" />
             <Shuffle className="text-white opacity-80 ml-2" size={18} />
          </div>
        </div>
      </div>
    </div>
  );
};
`;

code = code.replace(/const DemoFlexibleLayout = \(\) => \{/, `${meshDemoComp}\n\nconst DemoFlexibleLayout = () => {`);

fs.writeFileSync('src/components/ChangelogModal.tsx', code);
