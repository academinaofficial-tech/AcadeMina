import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://academina.com';

  // ==========================================
  // Googleにインデックス（登録）させたい公開ページ一覧
  // ==========================================
  const staticRoutes = [
    '',             // トップページ (app/page.tsx)
    '/about',       // AcadeMinaについて
    '/column',      // コラム一覧
    '/contact',     // お問い合わせ
    '/exam',        // 院試情報
    '/exam-store',  // 教材ストア
    '/legal',       // 特定商取引法など
    '/news',        // ニュース一覧
    '/story',       // 合格体験記一覧
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(), // 「今日更新されたよ」とアピール
    changeFrequency: 'daily' as const, // 毎日更新されるかも、とロボットに伝える
    priority: route === '' ? 1.0 : 0.8, // トップページを最優先（1.0）、他を0.8に設定
  }));

  // 将来的には、ここにPrismaやmicroCMSから「記事一覧」や「教材一覧」を
  // 取得して、動的ページ（/story-detail/〇〇など）のURLを追加する処理を書きます。
  // 今はまず、固定ページだけで完璧な地図を提出します！

  return [
    ...staticRoutes,
  ];
}