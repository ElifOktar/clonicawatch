/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  // 2026-08-07: Eski /ladies/{marka}-ladies URL'leri (GSC 404 listesi) gercek
  // marka sayfalarina kalici yonlendirildi.
  // 2026-08-07 (2): Silinen 2 blog yazisinin URL'leri en yakin canli icerige
  // yonlendirildi — ChatGPT trafiginin %100'u factories-guide'a iniyordu,
  // 404 yerine buyer's guide sayfasini gorsunler.
  async redirects() {
    return [
      { source: "/ladies/rolex-ladies", destination: "/brand/rolex-ladies", permanent: true },
      { source: "/ladies/cartier-ladies", destination: "/brand/cartier-ladies", permanent: true },
      { source: "/ladies/patek-philippe-ladies", destination: "/brand/patek-philippe-ladies", permanent: true },
      { source: "/ladies/audemars-piguet-ladies", destination: "/brand/audemars-piguet-ladies", permanent: true },
      { source: "/blog/super-clone-factories-guide", destination: "/best-super-clone-watch-sites", permanent: true },
      { source: "/blog/clean-vs-vs-factory", destination: "/blog/best-rolex-super-clone", permanent: true },
    ];
  },
};

export default nextConfig;

