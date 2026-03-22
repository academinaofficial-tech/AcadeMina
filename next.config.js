/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // 🚨 今回追加する「近日公開」への強制リダイレクト（一時的なので permanent: false）🚨
      { source: '/lab', destination: '/coming-soon', permanent: false },
      { source: '/exam-store', destination: '/coming-soon', permanent: false },
      { source: '/exam-detail', destination: '/coming-soon', permanent: false },
      { source: '/product', destination: '/coming-soon', permanent: false },
      { source: '/cart', destination: '/coming-soon', permanent: false },
      { source: '/checkout', destination: '/coming-soon', permanent: false },

      // 👇 以下、もともとあった設定（そのまま残します）
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/about.html', destination: '/about', permanent: true },
      { source: '/exam.html', destination: '/exam', permanent: true },
      // ※教材ストア関連の.htmlも一旦coming-soonへ
      { source: '/exam-store.html', destination: '/coming-soon', permanent: false },
      { source: '/exam-detail.html', destination: '/coming-soon', permanent: false },
      { source: '/product.html', destination: '/coming-soon', permanent: false },
      { source: '/cart.html', destination: '/coming-soon', permanent: false },
      { source: '/checkout.html', destination: '/coming-soon', permanent: false },
      { source: '/order-complete.html', destination: '/coming-soon', permanent: false },
      { source: '/lab.html', destination: '/coming-soon', permanent: false },

      { source: '/signup.html', destination: '/signup', permanent: true },
      { source: '/contact.html', destination: '/contact', permanent: true },
      { source: '/column.html', destination: '/column', permanent: true },
      { source: '/column-detail.html', destination: '/column-detail', permanent: true },
      { source: '/news-detail.html', destination: '/news-detail', permanent: true },
      { source: '/detail.html', destination: '/detail', permanent: true },
      { source: '/mypage.html', destination: '/mypage', permanent: true },
      { source: '/legal.html', destination: '/legal', permanent: true }
    ];
  },
};

module.exports = nextConfig;