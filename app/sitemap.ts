import { MetadataRoute } from 'next';
import { getArticles } from '@/lib/cms';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://www.academina.com';

    // ==========================================
    // 1. 固定ページ
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
        lastModified: new Date("2026-04-02"),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1.0 : 0.8,
    }));

    // ==========================================
    // 2. 動的ページ（microCMSから取得する記事ページ）
    // ==========================================
    let dynamicPages: MetadataRoute.Sitemap = [];

    // 🚨 修正1: try-catchを外し、エラー時はVercelのビルドを確実に止める

    // 🚨 修正2: limit上限(100)に対応するため、全件取得できるまでループする
    let allArticles: any[] = [];
    let offset = 0;
    const limit = 100;
    let totalCount = 0;

    do {
        const data = await getArticles({ limit, offset });
        allArticles = [...allArticles, ...data.contents];
        totalCount = data.totalCount || 0;
        offset += limit;
    } while (allArticles.length < totalCount);

    dynamicPages = allArticles.map((article: any) => {
        let type = 'column';
        // カテゴリ名の大文字・小文字のブレを吸収
        const categoryName = article.category?.name?.toLowerCase() || '';

        if (categoryName === 'news' || article.subcategory === 'NEWS') {
            type = 'news';
        } else if (categoryName === 'story' || categoryName === '合格体験記') {
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

    return [...staticPages, ...dynamicPages];
}