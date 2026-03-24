import { MetadataRoute } from 'next';
import { getArticles } from '@/lib/cms';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // 💡 本番環境の正しいドメイン
    const baseUrl = 'https://www.academina.com';

    // ==========================================
    // 1. 固定ページ（ログイン不要で誰でも見れるページ）
    // ※マイページ(/mypage)やカート(/cart)は検索に載せないため除外します
    // ==========================================
    const staticPaths = [
        '',             // トップページ
        '/about',       // AcadeMinaとは
        '/lab',         // 研究室検索
        '/exam',        // 院試サポート
        '/exam-store',  // 教材ストア
        '/column',      // コラム一覧
        '/news',        // ニュース一覧
        '/story',       // 体験記一覧（※もしあれば）
        '/contact',     // お問い合わせ
        '/legal',       // 利用規約・プライバシーポリシー
    ];

    const staticPages = staticPaths.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1.0 : 0.8, // トップページを最重要(1.0)に設定
    }));

    // ==========================================
    // 2. 動的ページ（microCMSから取得する記事ページ）
    // ==========================================
    let dynamicPages: MetadataRoute.Sitemap = [];

    try {
        // microCMSから全記事を取得（※記事が多い場合は limit: 1000 などに設定）
        const { contents: allArticles } = await getArticles({ limit: 1000 });

        dynamicPages = allArticles.map((article: any) => {
            // 💡 記事の種類（column, news, story）を判定
            // ※microCMSの設定に合わせて適宜調整してください
            let type = 'column'; 
            if (article.category?.name === 'News' || article.subcategory === 'NEWS') {
                type = 'news';
            } else if (article.category?.name === 'Story') {
                type = 'story';
            }

            // スラッグ化に対応！（slugがあれば優先、なければid）
            const slug = article.slug || article.id;

            return {
                url: `${baseUrl}/${type}/${slug}`,
                lastModified: new Date(article.updatedAt || article.publishedAt),
                changeFrequency: 'monthly' as const,
                priority: 0.6, // 個別記事は標準的な優先度
            };
        });
    } catch (error) {
        console.error('Sitemap generation error:', error);
        // エラー時でも固定ページだけは出力してサイトマップ自体が壊れるのを防ぐ
    }

    // 固定ページと動的ページを合体させて返す！
    return [...staticPages, ...dynamicPages];
}