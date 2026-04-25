const noiseSVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E")`;

const presets = [
  {
    name: 'Cosmic Magic',
    color: '#341d65',
    radials: [
      'at 80% 0%, hsla(289,100%,56%,1) 0px, transparent 50%',
      'at 0% 50%, hsla(335,100%,53%,1) 0px, transparent 50%',
      'at 80% 50%, hsla(240,100%,56%,1) 0px, transparent 50%',
      'at 0% 100%, hsla(22,100%,77%,1) 0px, transparent 50%'
    ]
  },
  {
    name: 'Sunset Vibes',
    color: '#ff9a9e',
    radials: [
      'at 40% 20%, hsla(28,100%,74%,1) 0px, transparent 50%',
      'at 80% 0%, hsla(355,100%,76%,1) 0px, transparent 50%',
      'at 0% 50%, hsla(355,100%,93%,1) 0px, transparent 50%',
      'at 80% 100%, hsla(22,100%,77%,1) 0px, transparent 50%'
    ]
  },
  {
    name: 'Ocean Depths',
    color: '#09203f',
    radials: [
      'at 40% 20%, hsla(210,100%,44%,1) 0px, transparent 50%',
      'at 80% 0%, hsla(189,100%,56%,1) 0px, transparent 50%',
      'at 0% 50%, hsla(230,100%,63%,1) 0px, transparent 50%',
      'at 80% 100%, hsla(180,100%,70%,1) 0px, transparent 50%'
    ]
  },
  {
    name: 'Minty Dream',
    color: '#a8ff78',
    radials: [
      'at 20% 20%, hsla(140,100%,74%,1) 0px, transparent 50%',
      'at 80% 10%, hsla(160,100%,56%,1) 0px, transparent 50%',
      'at 10% 80%, hsla(180,100%,63%,1) 0px, transparent 50%',
      'at 80% 90%, hsla(120,100%,70%,1) 0px, transparent 50%'
    ]
  },
  {
    name: 'Peach Sorbet',
    color: '#ffecd2',
    radials: [
      'at 10% 10%, hsla(350,100%,84%,1) 0px, transparent 50%',
      'at 90% 20%, hsla(20,100%,76%,1) 0px, transparent 50%',
      'at 30% 80%, hsla(40,100%,83%,1) 0px, transparent 50%',
      'at 80% 90%, hsla(330,100%,70%,1) 0px, transparent 50%'
    ]
  },
  {
    name: 'Neon Glow',
    color: '#ff0844',
    radials: [
      'at 20% 20%, hsla(290,100%,54%,1) 0px, transparent 50%',
      'at 80% 10%, hsla(220,100%,56%,1) 0px, transparent 50%',
      'at 10% 80%, hsla(330,100%,63%,1) 0px, transparent 50%',
      'at 80% 90%, hsla(260,100%,70%,1) 0px, transparent 50%'
    ]
  },
  {
    name: 'Soft Lavender',
    color: '#e0c3fc',
    radials: [
      'at 10% 20%, hsla(260,100%,84%,1) 0px, transparent 50%',
      'at 80% 10%, hsla(280,100%,76%,1) 0px, transparent 50%',
      'at 20% 80%, hsla(240,100%,83%,1) 0px, transparent 50%',
      'at 90% 90%, hsla(300,100%,70%,1) 0px, transparent 50%'
    ]
  },
  {
    name: 'Golden Hour',
    color: '#f6d365',
    radials: [
      'at 20% 10%, hsla(30,100%,64%,1) 0px, transparent 50%',
      'at 80% 20%, hsla(10,100%,56%,1) 0px, transparent 50%',
      'at 10% 90%, hsla(50,100%,63%,1) 0px, transparent 50%',
      'at 90% 80%, hsla(340,100%,70%,1) 0px, transparent 50%'
    ]
  }
];

const generated = presets.map(p => {
  const value = `${noiseSVG}, ${p.radials.map(r => `radial-gradient(${r})`).join(', ')}`;
  return {
    name: p.name,
    value,
    backgroundColor: p.color
  };
});

console.log(JSON.stringify(generated, null, 2));
