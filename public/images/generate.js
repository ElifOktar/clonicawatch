// Generate elegant SVG blog covers matching the site's dark+gold palette
const fs = require('fs');
const path = require('path');

const posts = [
  { file: "super-clone-guide.svg", icon: "⚙️", title: "BUYER'S GUIDE", subtitle: "Super Clone" },
  { file: "clean-vs-vs.svg", icon: "⚔️", title: "FACTORY BATTLE", subtitle: "Clean vs VS" },
  { file: "spot-fake.svg", icon: "🔍", title: "RED FLAGS", subtitle: "Quality Check" },
  { file: "history-rolex.svg", icon: "👑", title: "BRAND LEGACY", subtitle: "Rolex" },
  { file: "royal-oak-legend.svg", icon: "🔷", title: "ICON STORY", subtitle: "Royal Oak" },
  { file: "swiss-movement.svg", icon: "🔧", title: "TECHNICAL", subtitle: "Movements" },
  { file: "sapphire-crystal.svg", icon: "💎", title: "MATERIALS", subtitle: "Sapphire vs Mineral" },
  { file: "water-resistance.svg", icon: "🌊", title: "GUIDE", subtitle: "Water Resistance" },
  { file: "popular-2026.svg", icon: "🔥", title: "TRENDING 2026", subtitle: "Top 10 Watches" },
  { file: "style-guide.svg", icon: "👔", title: "STYLE MATCH", subtitle: "Find Your Watch" },
  { file: "watch-care.svg", icon: "🛡️", title: "MAINTENANCE", subtitle: "Watch Care" },
  { file: "rolex-omega-ap.svg", icon: "🏆", title: "HEAD TO HEAD", subtitle: "Rolex vs Omega vs AP" },
];

const gradients = [
  ["#0a0e17", "#1a1a2e", "#16213e"],
  ["#0a0e17", "#1b1425", "#251636"],
  ["#0a0e17", "#1a2020", "#0f2a1f"],
  ["#0a0e17", "#201a14", "#2a1f0f"],
  ["#0a0e17", "#141a25", "#0f1a36"],
  ["#0a0e17", "#1a1520", "#2a1025"],
  ["#0a0e17", "#14201a", "#0f3620"],
  ["#0a0e17", "#141825", "#0f1636"],
  ["#0a0e17", "#201814", "#361f0f"],
  ["#0a0e17", "#1a1425", "#250f36"],
  ["#0a0e17", "#181a14", "#1f2a0f"],
  ["#0a0e17", "#1a1a20", "#16162e"],
];

posts.forEach((post, i) => {
  const [c1, c2, c3] = gradients[i % gradients.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="50%" stop-color="${c2}"/>
      <stop offset="100%" stop-color="${c3}"/>
    </linearGradient>
    <linearGradient id="gold-line" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="transparent"/>
      <stop offset="50%" stop-color="#c9a84c" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="transparent"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="50%">
      <stop offset="0%" stop-color="#c9a84c" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="transparent"/>
    </radialGradient>
  </defs>
  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>
  <!-- Radial glow -->
  <ellipse cx="600" cy="315" rx="400" ry="300" fill="url(#glow)"/>
  <!-- Decorative lines -->
  <line x1="0" y1="315" x2="1200" y2="315" stroke="url(#gold-line)" stroke-width="1"/>
  <line x1="600" y1="0" x2="600" y2="630" stroke="url(#gold-line)" stroke-width="1"/>
  <!-- Corner accents -->
  <path d="M40,40 L100,40 M40,40 L40,100" stroke="#c9a84c" stroke-width="1.5" fill="none" opacity="0.4"/>
  <path d="M1160,40 L1100,40 M1160,40 L1160,100" stroke="#c9a84c" stroke-width="1.5" fill="none" opacity="0.4"/>
  <path d="M40,590 L100,590 M40,590 L40,530" stroke="#c9a84c" stroke-width="1.5" fill="none" opacity="0.4"/>
  <path d="M1160,590 L1100,590 M1160,590 L1160,530" stroke="#c9a84c" stroke-width="1.5" fill="none" opacity="0.4"/>
  <!-- Diamond separator -->
  <rect x="592" y="200" width="16" height="16" rx="2" transform="rotate(45,600,208)" fill="none" stroke="#c9a84c" stroke-width="1.5" opacity="0.6"/>
  <!-- Category label -->
  <text x="600" y="270" text-anchor="middle" font-family="system-ui,sans-serif" font-size="14" letter-spacing="6" fill="#c9a84c" font-weight="500">${post.title}</text>
  <!-- Main title -->
  <text x="600" y="340" text-anchor="middle" font-family="Georgia,serif" font-size="52" fill="#f0f2f5" font-weight="400">${post.subtitle}</text>
  <!-- Bottom line -->
  <line x1="540" y1="390" x2="660" y2="390" stroke="#c9a84c" stroke-width="2" opacity="0.5"/>
  <!-- Brand watermark -->
  <text x="600" y="440" text-anchor="middle" font-family="system-ui,sans-serif" font-size="12" letter-spacing="4" fill="#8b95a5" font-weight="400">CLONICAWATCH</text>
</svg>`;
  
  fs.writeFileSync(path.join(__dirname, post.file), svg);
  console.log(`✓ ${post.file}`);
});

console.log(`\nDone — ${posts.length} covers generated.`);
