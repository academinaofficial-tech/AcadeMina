"use client";

import { formatDate } from "@/lib/cms";
import Link from "next/link";

interface StoryDetailClientProps {
    article: any;
}

export default function StoryDetailClient({ article }: StoryDetailClientProps) {
    if (!article) return <div className="text-center py-20">体験記が見つかりませんでした。</div>;

    const imgUrl = article.eyecatch?.url;
    // 💡 体験記用の大学データを抽出
    const school = article.school_info || article;

    return (
        <article className="max-w-[860px] mx-auto py-16 px-6 lg:px-0">
            
            {/* 1. アイキャッチ画像 (一番上) */}
            {imgUrl && (
                <div className="mb-8 -mx-6 lg:-mx-10">
                    <img
                        src={imgUrl}
                        alt={article.title}
                        className="w-full h-auto max-h-[500px] bg-gray-100 rounded-3xl shadow-md object-cover"
                    />
                </div>
            )}

            {/* 2. ヘッダーセクション (タイトル → カテゴリ＆日付・著者) */}
            {/* 2. ヘッダーセクション (タイトル → 大学情報 ＆ 日付・著者) */}
            <header className="mb-12">
                {/* タイトル (左寄せ) */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-8 text-gray-900">
                    {article.title}
                </h1>

                {/* 大学情報(左) と 日付・著者(右) を横並びに配置 */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-5">
                    
                    {/* 左側：大学情報 */}
                    <div className="flex flex-wrap items-center gap-3">
                        {/* 🎓 合格体験記ならではの「大学・専攻バッジ」 */}
                        {school.university && (
                            <div className="text-gray-700 font-bold text-sm bg-gray-100 px-4 py-1.5 rounded-full border border-gray-200 flex items-center gap-2">
                                <span>🎓 {school.university}</span>
                                {school.faculty && <span className="text-gray-400">|</span>}
                                {school.faculty && <span>{school.faculty}</span>}
                                {school.major && <span className="text-gray-400">|</span>}
                                {school.major && <span>{school.major}</span>}
                            </div>
                        )}
                    </div>

                    {/* 右側：日付・著者 */}
                    <div className="flex items-center gap-4 text-gray-500 text-sm font-medium">
                        <span>{formatDate(article.publishedAt)}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                        <span>{article.author || "合格体験記"}</span>
                    </div>
                </div>
            </header>

            {/* Content Section */}
            <div className="column-content">
                <div
                    className="prose prose-lg max-w-none text-gray-800 leading-loose 
                    /* h2（大見出し）の設定 */
                    [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:border-b-2 [&_h2]:border-gray-200 [&_h2]:pb-2 [&_h2]:mt-14 [&_h2]:mb-6
                    
                    /* h3（小見出し）の設定 */
                    [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mt-10 [&_h3]:mb-4 [&_h3]:border-l-4 [&_h3]:border-blue-600 [&_h3]:pl-4 [&_h3]:text-gray-900
                    
                    /* aタグ（リンク）の設定 */
                    [&_a]:text-blue-600 [&_a]:underline [&_a]:font-bold hover:[&_a]:text-blue-800 [&_a]:transition-colors
                    
                    /* リスト（箇条書き）の設定 */
                    [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-6 [&_li]:mb-2
                    [&_strong]:font-extrabold [&_strong]:text-gray-900

                    /* 🎁 特殊なHTML（比較カードなど）の設定 */
                    [&_.section-lead]:text-gray-500 [&_.section-lead]:font-medium [&_.section-lead]:mb-8
                    [&_.info-box]:bg-blue-50 [&_.info-box]:p-6 [&_.info-box]:rounded-xl [&_.info-box]:my-8 [&_.info-box]:border [&_.info-box]:border-blue-200
                    [&_.compare-grid]:grid md:[&_.compare-grid]:grid-cols-2 [&_.compare-grid]:gap-6 [&_.compare-grid]:my-8
                    [&_.compare-card]:border [&_.compare-card]:border-gray-200 [&_.compare-card]:rounded-xl [&_.compare-card]:overflow-hidden [&_.compare-card]:shadow-sm
                    [&_.compare-card-head]:bg-gray-800 [&_.compare-card-head]:text-white [&_.compare-card-head]:font-bold [&_.compare-card-head]:text-center [&_.compare-card-head]:py-2
                    [&_.compare-card-body]:p-5 [&_.compare-card-body]:bg-gray-50 [&_.compare-card-body>p]:mb-2 [&_.compare-card-body>p:last-child]:mb-0
                    
                    /* 📚 追加：Amazonリンク（サムネなし・シンプル版）の設定 */
                    [&_.amazon-link]:block [&_.amazon-link]:my-8 [&_.amazon-link]:p-5 [&_.amazon-link]:bg-gray-50 [&_.amazon-link]:border [&_.amazon-link]:border-gray-200 [&_.amazon-link]:rounded-xl hover:[&_.amazon-link]:bg-gray-100 [&_.amazon-link]:transition-colors
                    [&_.amazon-link_a]:flex [&_.amazon-link_a]:flex-col sm:[&_.amazon-link_a]:flex-row sm:[&_.amazon-link_a]:items-center [&_.amazon-link_a]:justify-between [&_.amazon-link_a]:no-underline
                    [&_.amazon-title]:text-gray-900 [&_.amazon-title]:font-bold [&_.amazon-title]:text-lg [&_.amazon-title]:mb-4 sm:[&_.amazon-title]:mb-0 sm:[&_.amazon-title]:mr-4
                    [&_.amazon-btn]:bg-[#FFA724] hover:[&_.amazon-btn]:bg-[#FF9900] [&_.amazon-btn]:text-white [&_.amazon-btn]:text-sm [&_.amazon-btn]:font-bold [&_.amazon-btn]:px-8 [&_.amazon-btn]:py-3 [&_.amazon-btn]:rounded-full [&_.amazon-btn]:text-center [&_.amazon-btn]:transition-colors [&_.amazon-btn]:shadow-sm [&_.amazon-btn]:whitespace-nowrap
                    "
                    dangerouslySetInnerHTML={{ 
                        __html: article.content || "<p>記事の中身がここに入ります。</p>" 
                    }}
                />
            </div>

            <footer className="mt-24 pt-10 border-t border-gray-100 text-center">
                <p className="text-gray-400 mb-8 font-medium">最後まで読んでいただきありがとうございます。</p>
                <Link
                    href="/story"
                    className="inline-block px-12 py-4 border-2 border-black rounded-full font-bold transition-all duration-300 hover:bg-black hover:text-white"
                >
                    ← 体験記一覧に戻る
                </Link>
            </footer>
        </article>
    );
}