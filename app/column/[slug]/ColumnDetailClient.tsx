"use client";

import { formatDate } from "@/lib/cms"; // ※ご自身の環境に合わせてパスを確認してください
import Link from "next/link";
import Button from "@/components/ui/Button";

// ==========================================
// 📦 page.tsxから渡されるデータの型を定義
// ==========================================
interface ColumnArticle {
    id: string;
    title: string;
    content: string;
    publishedAt: string;
    eyecatch?: { url: string; width: number; height: number };
    category?: { category: string; article_type: string };
    author?: string;
}

interface ColumnDetailClientProps {
    article: ColumnArticle;
}

// ==========================================
// 🎨 クライアントコンポーネント本体
// ==========================================
export default function ColumnDetailClient({ article }: ColumnDetailClientProps) {
    if (!article) return <div className="text-center py-20">記事が見つかりませんでした。</div>;

    const imgUrl = article.eyecatch?.url;
    // article_typeが存在しない場合はデフォルトで通常のコラム扱いにする安全対策
    const isNews = article.category?.article_type === "news";

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
            <header className="mb-12">
                {/* タイトル (左寄せ) */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-8 text-gray-900">
                    {article.title}
                </h1>

                {/* カテゴリ(左) と 日付・著者(右) を横並びに配置 */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-5">
                    
                    {/* 左側：カテゴリ (少し目立たせるために背景色と丸みを追加) */}
                    <div className="text-accent font-bold text-sm uppercase tracking-widest bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100">
                        {article.category?.category || "Column"}
                    </div>

                    {/* 右側：日付・著者 */}
                    <div className="flex items-center gap-4 text-gray-500 text-sm font-medium">
                        <span>{formatDate(article.publishedAt)}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                        <span>{article.author || "AcadeMina編集部"}</span>
                    </div>
                </div>
            </header>

            {/* 3. 本文セクション (microCMSから送られてきたHTMLを展開) */}
            <div 
    className="column-content" 
    dangerouslySetInnerHTML={{ __html: article.content }} 
/>

            {/* 4. フッターセクション (戻るボタン) */}
            <footer className="mt-24 pt-10 border-t border-gray-100 text-center">
                <p className="text-gray-400 mb-8 font-medium">最後まで読んでいただきありがとうございます。</p>
                <Button href={isNews ? "/news" : "/column"}>
                    ← {isNews ? "ニュース一覧に戻る" : "全てのコラムを見る"}
                </Button>
            </footer>
        </article>
    );
}