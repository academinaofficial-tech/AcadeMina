/* =========================================
   AcadeMina CMS Configuration (microCMS)
   =========================================
   
   ■ セットアップ手順
   1. https://microcms.io でアカウント作成（無料プランあり）
   2. サービスを作成（例: academina）
   3. APIスキーマを作成（下記「コンテンツモデル」参照）
   4. 下の SERVICE_ID と API_KEY を書き換える
   5. microCMS管理画面から記事を投稿 → サイトに自動反映
   
   ■ コンテンツモデル（microCMS側で設定）
   
   【API名: articles】
   フィールドID    | 表示名      | 種類
   --------------|-----------|------------------
   title         | タイトル    | テキストフィールド
   body          | 本文       | リッチエディタ
   thumbnail     | サムネイル   | 画像
   category      | カテゴリ    | セレクト(column/news)
   subcategory   | サブカテゴリ | テキスト(Interview/Strategy/Update等)
   description   | 概要文     | テキストエリア
   author        | 著者       | テキスト
   tags          | タグ       | 複数選択(リスト)
   isFeatured    | おすすめ    | 真偽値
   
   ========================================= */

const CMS_CONFIG = {
    // ★★★ ここを書き換える ★★★
    SERVICE_ID: 'your-service-id',   // microCMSのサービスID
    API_KEY: 'your-api-key',         // microCMSのAPIキー（公開用）
    
    // エンドポイント
    ENDPOINT: 'articles',
    
    // 基本URL（自動生成）
    get BASE_URL() {
        return `https://${this.SERVICE_ID}.microcms.io/api/v1`;
    }
};

/* -----------------------------------------
   CMS APIクライアント
   ----------------------------------------- */
const CMS = {
    /**
     * 記事一覧を取得
     * @param {Object} options - { limit, offset, filters, orders, category }
     * @returns {Promise<{contents: Array, totalCount: number}>}
     */
    async getArticles(options = {}) {
        const { limit = 10, offset = 0, filters = '', orders = '-publishedAt', category = '' } = options;
        
        let queryFilters = filters;
        if (category) {
            queryFilters = queryFilters 
                ? `${queryFilters}[and]category[equals]${category}` 
                : `category[equals]${category}`;
        }
        
        const params = new URLSearchParams({
            limit: limit.toString(),
            offset: offset.toString(),
            orders,
        });
        if (queryFilters) params.set('filters', queryFilters);
        
        const url = `${CMS_CONFIG.BASE_URL}/${CMS_CONFIG.ENDPOINT}?${params}`;
        
        try {
            const res = await fetch(url, {
                headers: { 'X-MICROCMS-API-KEY': CMS_CONFIG.API_KEY }
            });
            if (!res.ok) throw new Error(`CMS API Error: ${res.status}`);
            return await res.json();
        } catch (e) {
            console.warn('CMS fetch failed, using mock data:', e.message);
            return this._getMockData(options);
        }
    },
    
    /**
     * 記事詳細を取得
     * @param {string} id - コンテンツID
     * @returns {Promise<Object>}
     */
    async getArticle(id) {
        const url = `${CMS_CONFIG.BASE_URL}/${CMS_CONFIG.ENDPOINT}/${id}`;
        
        try {
            const res = await fetch(url, {
                headers: { 'X-MICROCMS-API-KEY': CMS_CONFIG.API_KEY }
            });
            if (!res.ok) throw new Error(`CMS API Error: ${res.status}`);
            return await res.json();
        } catch (e) {
            console.warn('CMS fetch failed, using mock data:', e.message);
            return this._getMockArticle(id);
        }
    },

    /**
     * おすすめコラム取得（index.html用）
     * @param {number} limit
     */
    async getFeaturedColumns(limit = 3) {
        return this.getArticles({
            limit,
            category: 'column',
            filters: 'isFeatured[equals]true',
            orders: '-publishedAt'
        });
    },
    
    /**
     * 最新ニュース取得（index.html用）
     * @param {number} limit
     */
    async getLatestNews(limit = 5) {
        return this.getArticles({
            limit,
            category: 'news',
            orders: '-publishedAt'
        });
    },

    /* -----------------------------------------
       モックデータ（CMS未接続時のフォールバック）
       ----------------------------------------- */
    _mockArticles: [
        {
            id: 'mock-col-001',
            title: '【院試対策】外部受験生が面接で必ず聞かれる「なぜうちの研究室？」への正解回答',
            body: '<p>大学院入試の面接において、外部受験生が最も聞かれる質問のひとつが「なぜうちの研究室を志望するのか？」です。</p><h2>面接官が本当に知りたいこと</h2><p>この質問の裏にある意図を理解することが、合格への第一歩です。面接官は単に「志望動機」を聞いているのではありません。あなたの<strong>研究への理解度</strong>と<strong>研究室との相性</strong>を見ています。</p><h2>NGな回答パターン</h2><p>「○○先生の研究が面白いと思ったからです」— これでは不十分です。具体性がなく、他の受験生と差別化できません。</p><h2>合格者の回答フレームワーク</h2><p>合格者に共通する回答には、3つの要素が含まれています：</p><ol><li><strong>自分の問題意識</strong>（なぜこのテーマに興味を持ったか）</li><li><strong>研究室の強み</strong>（他の研究室にはない特徴）</li><li><strong>具体的な研究計画</strong>（入学後に何をしたいか）</li></ol><p>これらを自分の言葉で、具体的なエピソードと共に語ることが重要です。</p>',
            thumbnail: { url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop' },
            category: ['column'],
            subcategory: 'Interview',
            description: '外部受験の面接で頻出の「なぜうちの研究室？」。合格者の回答パターンを分析し、フレームワーク化しました。',
            author: 'AcadeMina編集部',
            tags: ['面接対策', '外部受験', '院試'],
            isFeatured: true,
            publishedAt: '2025-12-05T09:00:00.000Z',
            createdAt: '2025-12-05T09:00:00.000Z'
        },
        {
            id: 'mock-col-002',
            title: '研究計画書は「ラブレター」ではない。「事業計画書」として書け。',
            body: '<p>多くの受験生が研究計画書を「やりたいことへの情熱」で埋め尽くしてしまいます。しかし、教授が求めているのは情熱ではなく、<strong>実現可能性と論理性</strong>です。</p><h2>なぜ「事業計画書」なのか</h2><p>研究計画書とスタートアップの事業計画書には驚くほど共通点があります。どちらも「限られたリソースで、不確実な成果を目指す」という構造を持っています。</p><h2>5つの必須要素</h2><ol><li>課題設定（なぜこの研究が必要か）</li><li>先行研究の整理（既に何がわかっていて、何が未解明か）</li><li>提案手法（どうアプローチするか）</li><li>実現可能性（2年間でどこまでできるか）</li><li>期待される成果（学術的・社会的インパクト）</li></ol>',
            thumbnail: { url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=800&auto=format&fit=crop' },
            category: ['column'],
            subcategory: 'Strategy',
            description: '研究計画書の書き方を「事業計画書」のフレームワークで解説。教授が本当に見ているポイントとは。',
            author: 'T.K.（東大院 M2）',
            tags: ['研究計画書', '院試', '書き方'],
            isFeatured: true,
            publishedAt: '2025-11-28T09:00:00.000Z',
            createdAt: '2025-11-28T09:00:00.000Z'
        },
        {
            id: 'mock-col-003',
            title: '文系から理転して旧帝大院へ。合格者インタビュー vol.12',
            body: '<p>今回お話を伺ったのは、経済学部から京都大学大学院・情報学研究科に合格したSさん。文系からの「理転」という珍しいルートで合格を勝ち取った経験を語っていただきました。</p><h2>きっかけは「データ分析」への興味</h2><p>「もともと計量経済学のゼミにいて、統計分析が好きだったんです。でも経済学の枠組みだけでは物足りなくなって、もっと純粋にデータサイエンスを学びたいと思うようになりました。」</p><h2>学部3年の秋、決断の時</h2><p>「周囲には文系から理系の大学院に行く人はほぼゼロ。情報がなさすぎて、最初は本当に不安でした。」</p>',
            thumbnail: { url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop' },
            category: ['column'],
            subcategory: 'Story',
            description: '経済学部から京大情報学研究科へ。文系から理転した合格者のリアルな体験談。',
            author: 'AcadeMina編集部',
            tags: ['体験記', '理転', '京都大学', 'インタビュー'],
            isFeatured: true,
            publishedAt: '2025-11-15T09:00:00.000Z',
            createdAt: '2025-11-15T09:00:00.000Z'
        },
        {
            id: 'mock-col-004',
            title: '【2026年度版】TOEFL vs TOEIC：院試で本当に有利なのはどっち？',
            body: '<p>大学院入試における英語スコアの扱いは大学によって大きく異なります。この記事では、主要大学の要件を比較し、どちらの試験を受けるべきかを解説します。</p>',
            thumbnail: { url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop' },
            category: ['column'],
            subcategory: 'Strategy',
            description: '主要大学院の英語スコア要件を徹底比較。TOEFLとTOEIC、どちらを選ぶべきか。',
            author: 'AcadeMina編集部',
            tags: ['TOEFL', 'TOEIC', '英語', '院試'],
            isFeatured: false,
            publishedAt: '2025-11-01T09:00:00.000Z',
            createdAt: '2025-11-01T09:00:00.000Z'
        },
        {
            id: 'mock-col-005',
            title: '院試の「過去問」はどこで手に入る？入手方法まとめ',
            body: '<p>院試対策の第一歩は過去問の入手です。しかし、大学院入試の過去問は大学受験と違い、市販されていないケースがほとんどです。</p>',
            thumbnail: { url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=800&auto=format&fit=crop' },
            category: ['column'],
            subcategory: 'Tips',
            description: '院試の過去問を手に入れる5つの方法。公式・非公式ルートを網羅的に解説。',
            author: 'S.M.（東大院 M1）',
            tags: ['過去問', '院試', '対策'],
            isFeatured: false,
            publishedAt: '2025-10-20T09:00:00.000Z',
            createdAt: '2025-10-20T09:00:00.000Z'
        },
        // News
        {
            id: 'mock-news-001',
            title: '東京大学 大学院工学系研究科の募集要項データベースを更新しました',
            body: '<p>2026年度入試に対応した最新の募集要項データを反映いたしました。</p>',
            thumbnail: null,
            category: ['news'],
            subcategory: 'Update',
            description: '',
            author: 'AcadeMina',
            tags: ['東京大学'],
            isFeatured: false,
            publishedAt: '2025-12-01T09:00:00.000Z',
            createdAt: '2025-12-01T09:00:00.000Z'
        },
        {
            id: 'mock-news-002',
            title: '【無料ウェビナー】春休みから始める院試英語対策（TOEFL/TOEIC）',
            body: '<p>2025年12月15日（土）19:00〜20:30、無料オンラインセミナー開催。</p>',
            thumbnail: null,
            category: ['news'],
            subcategory: 'Event',
            description: '',
            author: 'AcadeMina',
            tags: ['イベント', 'TOEFL'],
            isFeatured: false,
            publishedAt: '2025-11-20T09:00:00.000Z',
            createdAt: '2025-11-20T09:00:00.000Z'
        },
        {
            id: 'mock-news-003',
            title: 'サイトメンテナンスのお知らせ（11/15 深夜2:00〜）',
            body: '<p>サーバー強化のため一時停止します。</p>',
            thumbnail: null,
            category: ['news'],
            subcategory: 'Info',
            description: '',
            author: 'AcadeMina',
            tags: [],
            isFeatured: false,
            publishedAt: '2025-11-10T09:00:00.000Z',
            createdAt: '2025-11-10T09:00:00.000Z'
        }
    ],

    _getMockData(options = {}) {
        let data = [...this._mockArticles];
        if (options.category) data = data.filter(a => a.category.includes(options.category));
        if (options.filters && options.filters.includes('isFeatured[equals]true')) data = data.filter(a => a.isFeatured);
        data.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
        const offset = options.offset || 0;
        const limit = options.limit || 10;
        return { contents: data.slice(offset, offset + limit), totalCount: data.length };
    },

    _getMockArticle(id) {
        return this._mockArticles.find(a => a.id === id) || null;
    }
};

/* -----------------------------------------
   ユーティリティ
   ----------------------------------------- */
function formatDate(dateStr) {
    const d = new Date(dateStr);
    return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`;
}

function truncate(str, len) {
    if (!str) return '';
    return str.length > len ? str.substring(0, len) + '...' : str;
}
