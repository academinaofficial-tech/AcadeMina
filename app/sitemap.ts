import { MetadataRoute } from 'next';
import { getArticles } from '@/lib/cms';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://www.academina.com';

    // ==========================================
    // 1. 固定ページ（ログイン不要で誰でも見れるページ）
    //    ※ /lab はcoming-soonリダイレクト中のため除外
    // ==========================================
    const staticPaths = [
        '',
        '/about',
        '/exam',
        '/exam-store',
        '/column',
        '/news',
        '/story',
        '/contact',
        '/legal',
    ];

    const staticPages = staticPaths.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1.0 : 0.8,
    }));

    // ==========================================
    // 2. 動的ページ（microCMSから取得する記事ページ）
    // ==========================================
    let dynamicPages: MetadataRoute.Sitemap = [];

    try {
        const { contents: allArticles } = await getArticles({ limit: 1000 });

        dynamicPages = allArticles.map((article: any) => {
            let type = 'column';
            if (article.category?.name === 'News' || article.subcategory === 'NEWS') {
                type = 'news';
            } else if (article.category?.name === 'Story') {
                type = 'story';
            }

            const slug = article.slug || article.id;

            return {
                url: `${baseUrl}/${type}/${slug}`,
                lastModified: new Date(article.updatedAt || article.publishedAt),
                changeFrequency: 'monthly' as const,
                priority: 0.6,
            };
        });
    } catch (error) {
        console.error('Sitemap generation error:', error);
    }

    return [...staticPages, ...dynamicPages];
}