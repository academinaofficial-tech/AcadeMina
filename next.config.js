/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/about.html', destination: '/about', permanent: true },
      { source: '/exam.html', destination: '/exam', permanent: true },
      { source: '/exam-store.html', destination: '/exam-store', permanent: true },
      { source: '/exam-detail.html', destination: '/exam-detail', permanent: true },
      { source: '/product.html', destination: '/product', permanent: true },
      { source: '/cart.html', destination: '/cart', permanent: true },
      { source: '/checkout.html', destination: '/checkout', permanent: true },
      { source: '/order-complete.html', destination: '/order-complete', permanent: true },
      { source: '/signup.html', destination: '/signup', permanent: true },
      { source: '/contact.html', destination: '/contact', permanent: true },
      { source: '/column.html', destination: '/column', permanent: true },
      { source: '/column-detail.html', destination: '/column-detail', permanent: true },
      { source: '/news-detail.html', destination: '/news-detail', permanent: true },
      { source: '/detail.html', destination: '/detail', permanent: true },
      { source: '/lab.html', destination: '/lab', permanent: true },
      { source: '/mypage.html', destination: '/mypage', permanent: true },
      { source: '/legal.html', destination: '/legal', permanent: true }
    ];
  },
};

module.exports = nextConfig;
