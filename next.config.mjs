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
  async redirects() {
    return [
      { source: "/ladies/rolex-ladies", destination: "/brand/rolex-ladies", permanent: true },
      { source: "/ladies/cartier-ladies", destination: "/brand/cartier-ladies", permanent: true },
      { source: "/ladies/patek-philippe-ladies", destination: "/brand/patek-philippe-ladies", permanent: true },
      { source: "/ladies/audemars-piguet-ladies", destination: "/brand/audemars-piguet-ladies", permanent: true },
    ];
  },
};

export default nextConfig;

