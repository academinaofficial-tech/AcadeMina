/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.microcms-assets.io",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        source: "/images/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // ✅ www統一：academina.com → www.academina.com（最優先）
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'academina.com' }],
        destination: 'https://www.academina.com/:path*',
        permanent: true,
      },

      // ✅ 古いURL構造からの転送
      {
        source: '/column-detail',
        destination: '/column',
        permanent: true,
      },

      // ✅ まだ準備中の機能（coming-soonへ）
      { source: '/lab', destination: '/coming-soon', permanent: false },
      { source: '/mentors', destination: '/coming-soon', permanent: false },
      { source: '/qa', destination: '/coming-soon', permanent: false },

      // ✅ 古い.htmlファイルからの転送
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/about.html', destination: '/about', permanent: true },
      { source: '/exam.html', destination: '/exam', permanent: true },
      { source: '/exam-store.html', destination: '/exam-store', permanent: false },
      { source: '/exam-detail.html', destination: '/exam-detail', permanent: false },
      { source: '/lab.html', destination: '/coming-soon', permanent: false },
      { source: '/signup.html', destination: '/signup', permanent: true },
      { source: '/contact.html', destination: '/contact', permanent: true },
      { source: '/mypage.html', destination: '/mypage', permanent: true },
      { source: '/legal.html', destination: '/legal', permanent: true },
    ];
  },
};

module.exports = nextConfig;