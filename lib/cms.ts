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
    // Simple filter for mock
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
        console.warn('CMS fetch failed, using mock data:', e.message);
        return _getMockData(options);
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
        console.warn(`CMS fetch failed for ID ${id}, using mock data:`, e.message);
        return _mockArticles.find(a => a.id === id) || _mockArticles[0];
    }
}
