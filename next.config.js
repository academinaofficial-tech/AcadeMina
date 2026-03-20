/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // ✅ まだ準備中の機能（これらは引き続きComing Soonへ）
      { source: '/lab', destination: '/coming-soon', permanent: false },
      { source: '/mentors', destination: '/coming-soon', permanent: false }, // メンター
      { source: '/qa', destination: '/coming-soon', permanent: false },      // 掲示板

      // 💡 【重要】ここにあった '/exam-store' などのリダイレクト行は削除しました！
      // これで教材ストアにはアクセスできるようになります。

      // 👇 以下、古い.htmlファイルからの転送設定（そのまま）
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/about.html', destination: '/about', permanent: true },
      { source: '/exam.html', destination: '/exam', permanent: true },
      
      // ストア系の.htmlは、正しいページ（/exam-store など）に飛ばすように修正
      { source: '/exam-store.html', destination: '/exam-store', permanent: false },
      { source: '/exam-detail.html', destination: '/exam-detail', permanent: false },
      
      // ラボなどは引き続きComing Soon
      { source: '/lab.html', destination: '/coming-soon', permanent: false },

      { source: '/signup.html', destination: '/signup', permanent: true },
      { source: '/contact.html', destination: '/contact', permanent: true },
      { source: '/mypage.html', destination: '/mypage', permanent: true },
      { source: '/legal.html', destination: '/legal', permanent: true }
    ];
  },
};

module.exports = nextConfig;