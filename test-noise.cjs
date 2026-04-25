const val = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E"), radial-gradient(at 80% 0%, hsla(289,100%,56%,1) 0px, transparent 50%)`;

const stripNoise = (str) => {
  return str.replace(/url\("data:image\/svg\+xml,[^"]*"\)(,\s*)?/, '');
};

console.log(stripNoise(val));

const applyNoise = (str, enable, opacity, size) => {
  const stripped = stripNoise(str);
  if (!enable) return stripped;
  
  // size maps to baseFrequency, opacity maps to opacity
  const noiseSVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='${size}' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='${opacity}'/%3E%3C/svg%3E")`;
  
  return `${noiseSVG}, ${stripped}`;
};

console.log(applyNoise(val, true, 0.5, 1.2));
console.log(applyNoise(val, false, 0.5, 1.2));
