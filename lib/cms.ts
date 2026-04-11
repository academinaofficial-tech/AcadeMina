const CMS_CONFIG = {
    SERVICE_ID: (process.env.MICROCMS_SERVICE_ID || 'your-service-id').replace('.microcms.io', '').trim(),
    API_KEY: (process.env.MICROCMS_API_KEY || 'your-api-key').trim(),
    ENDPOINT: 'columns',
    get BASE_URL() {
        return `https://${this.SERVICE_ID}.microcms.io/api/v1`;
    }
};

const _mockArticles = [
    {
        id: 'mock-col-001',
        title: '【院試対策】外部受験生が面接で必ず聞かれる「なぜうちの研究室？」への正解回答',
        eyecatch: { url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop' },
        category: { name: 'Interview' },
        content: '<p>内容がここに入ります。</p>',
        publishedAt: '2025-12-05T09:00:00.000Z',
    },
    {
        id: 'mock-col-002',
        title: '研究計画書は「ラブレター」ではない。「事業計画書」として書け。',
        eyecatch: { url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=800&auto=format&fit=crop' },
        category: { name: 'Strategy' },
        content: '<p>内容がここに入ります。</p>',
        publishedAt: '2025-11-28T09:00:00.000Z',
    },
    {
        id: 'mock-col-003',
        title: '文系から理転して旧帝大院へ。合格者インタビュー vol.12',
        eyecatch: { url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop' },
        category: { name: 'Story' },
        content: '<p>内容がここに入ります。</p>',
        publishedAt: '2025-11-15T09:00:00.000Z',
    }
];

function _getMockData(options: any = {}) {
    let data = [..._mockArticles];
    if (options.filters && options.filters.includes('category[equals]')) {
        // Mock simplification
    }
    data.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    const offset = options.offset || 0;
    const limit = options.limit || 10;
    return { contents: data.slice(offset, offset + limit), totalCount: data.length };
}

export async function getArticles(options: any = {}) {
    const { limit = 10, offset = 0, filters = '', orders = '-publishedAt' } = options;

    let queryFilters = filters;

    const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
        orders,
    });
    if (queryFilters) params.set('filters', queryFilters);

    const url = `${CMS_CONFIG.BASE_URL}/${CMS_CONFIG.ENDPOINT}?${params}`;

    try {
        const res = await fetch(url, {
            headers: { 'X-MICROCMS-API-KEY': CMS_CONFIG.API_KEY },
            next: { revalidate: 60 }
        });
        if (!res.ok) throw new Error(`CMS API Error: ${res.status}`);
        return await res.json();
    } catch (e: any) {
        console.error('CMS fetch failed:', e.message);
        return { contents: [], totalCount: 0 };
    }
}

export async function getFeaturedColumns(limit = 3) {
    return getArticles({
        limit,
        orders: '-publishedAt'
    });
}

export async function getLatestNews(limit = 5) {
    return getArticles({
        limit,
        orders: '-publishedAt'
    });
}

export function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export async function getArticleById(id: string) {
    const url = `${CMS_CONFIG.BASE_URL}/${CMS_CONFIG.ENDPOINT}/${id}`;

    try {
        const res = await fetch(url, {
            headers: { 'X-MICROCMS-API-KEY': CMS_CONFIG.API_KEY },
            next: { revalidate: 60 }
        });
        if (!res.ok) throw new Error(`CMS API Error: ${res.status}`);
        return await res.json();
    } catch (e: any) {
        console.error(`CMS fetch failed for ID ${id}:`, e.message);
        return null;
    }
}

// 大学・専攻マスタを全件取得する関数
export async function getSchools() {
    const limit = 100; // microCMSの1回あたりの最大取得件数
    let offset = 0;
    let allSchools: any[] = [];
    let totalCount = 0;

    try {
        // 1回目の通信
        let url = `${CMS_CONFIG.BASE_URL}/schools?limit=${limit}&offset=${offset}`;
        let res = await fetch(url, {
            headers: { 'X-MICROCMS-API-KEY': CMS_CONFIG.API_KEY },
            next: { revalidate: 60 }
        });

        if (!res.ok) throw new Error(`CMS API Error: ${res.status}`);
        let data = await res.json();

        allSchools = [...data.contents];
        totalCount = data.totalCount;

        // 残りのデータをループで取得
        while (allSchools.length < totalCount) {
            offset += limit;
            url = `${CMS_CONFIG.BASE_URL}/schools?limit=${limit}&offset=${offset}`;

            res = await fetch(url, {
                headers: { 'X-MICROCMS-API-KEY': CMS_CONFIG.API_KEY },
                next: { revalidate: 60 }
            });

            if (!res.ok) throw new Error(`CMS API Error: ${res.status}`);
            data = await res.json();

            allSchools = [...allSchools, ...data.contents];
        }

        return { contents: allSchools, totalCount };

    } catch (e: any) {
        console.warn('CMS fetch failed for schools:', e.message);

        // 🚨 修正箇所：本番環境ではエラーを投げる
        if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
            throw new Error(`[Fatal] Failed to fetch schools from microCMS: ${e.message}`);
        }

        return { contents: [], totalCount: 0 };
    }
}

export async function getArticleBySlug(slug: string) {
    // Next.jsのparamsが二重エンコードされている場合があるため正規化する
    let normalizedSlug = slug;
    try { normalizedSlug = decodeURIComponent(slug); } catch {}

    try {
        // まずslugフィールドで検索
        const filterUrl = `${CMS_CONFIG.BASE_URL}/${CMS_CONFIG.ENDPOINT}?filters=slug[equals]${encodeURIComponent(normalizedSlug)}`;
        console.log('[getArticleBySlug] normalizedSlug:', normalizedSlug);
        console.log('[getArticleBySlug] filterUrl:', filterUrl);

        const filterRes = await fetch(filterUrl, {
            headers: { 'X-MICROCMS-API-KEY': CMS_CONFIG.API_KEY },
            cache: 'no-store',
        });

        console.log('[getArticleBySlug] filterRes status:', filterRes.status);
        if (!filterRes.ok) throw new Error(`CMS API Error: ${filterRes.status}`);

        const filterData = await filterRes.json();
        console.log('[getArticleBySlug] filterData.contents.length:', filterData.contents?.length);
        if (filterData.contents[0]) return filterData.contents[0];

        // slugで見つからない場合はIDで直接取得を試みる
        const idUrl = `${CMS_CONFIG.BASE_URL}/${CMS_CONFIG.ENDPOINT}/${encodeURIComponent(normalizedSlug)}`;
        console.log('[getArticleBySlug] idUrl:', idUrl);

        const idRes = await fetch(idUrl, {
            headers: { 'X-MICROCMS-API-KEY': CMS_CONFIG.API_KEY },
            cache: 'no-store',
        });

        console.log('[getArticleBySlug] idRes status:', idRes.status);
        if (idRes.ok) return await idRes.json();

        return null;

    } catch (e: any) {
        console.warn(`CMS fetch failed for slug ${slug}:`, e.message);

        if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
            throw new Error(`[Fatal] Failed to fetch article by slug from microCMS: ${e.message}`);
        }

        return _mockArticles.find((a: any) => a.slug === slug) || _mockArticles[0];
    }
}