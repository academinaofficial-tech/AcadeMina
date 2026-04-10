"use client";

import { formatDate } from "@/lib/cms";
import Link from "next/link";
import Typography from "@/components/ui/Typography";

interface NewsDetailClientProps {
    article: any;
}

export default function NewsDetailClient({ article }: NewsDetailClientProps) {
    return (
        <main className="mt-20 md:mt-[134px] min-h-screen bg-gray-50/50 pb-24">
            {/* パンくずリスト */}
            <nav className="py-4 px-6 md:px-10 text-xs text-gray-500 bg-white border-b border-gray-100 flex items-center gap-2 overflow-x-auto whitespace-nowrap">
                <Link href="/" className="hover:text-blue-600 font-bold transition-colors">TOP</Link>
                <span>&gt;</span>
                <Link href="/news" className="hover:text-blue-600 font-bold transition-colors">News</Link>
                <span>&gt;</span>
                <span className="font-semibold text-gray-800 truncate max-w-[200px]">{article.title}</span>
            </nav>

            <article className="max-w-[860px] mx-auto pt-10 px-5 md:px-0">
                {/* 🌟 1. ヘッダー：左に黒のアクセントラインを入れた美しいカード */}
                <header className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-200 mb-8 relative overflow-hidden">
                    {/* 左側の黒いライン装飾 */}
                    <div className="absolute top-0 left-0 w-2 h-full bg-black"></div>
                    
                    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                        <span className="bg-black text-white py-1.5 px-5 text-xs font-extrabold rounded-full tracking-widest shadow-sm w-fit">
                            {article.subcategory || 'NEWS'}
                        </span>
                        <span className="text-gray-500 text-sm font-bold tracking-wide flex items-center gap-2">
                            {/* 時計アイコン */}
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            {formatDate(article.publishedAt)}
                        </span>
                    </div>
                    
                    <Typography variant="h2" component="h1" className="text-gray-900 tracking-tight">
                        {article.title}
                    </Typography>
                    
                    {article.author && (
                        <div className="mt-6 pt-6 border-t border-gray-100 text-right">
                            <p className="text-gray-500 text-sm font-bold inline-flex items-center gap-2">
                                <span className="text-lg">✍️</span> {article.author}
                            </p>
                        </div>
                    )}
                </header>

                {/* 🌟 2. 本文：白背景のカードにして読みやすさを極限まで高める */}
                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-200 mb-16">
                    <div className="column-content">
                        <div 
                            dangerouslySetInnerHTML={{ 
                                __html: article.content || "<p>お知らせの内容は現在準備中です。</p>" 
                            }} 
                        />
                    </div>
                </div>

                {/* 🌟 3. フッター：一覧に戻るリンク（ボタン風） */}
                <footer className="text-center">
                    <Link
                        href="/news"
                        className="inline-flex items-center justify-center gap-3 px-10 py-4 bg-gray-900 hover:bg-black text-white font-bold rounded-full transition-all hover:shadow-lg hover:-translate-y-1"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        ニュース一覧に戻る
                    </Link>
                </footer>
            </article>
        </main>
    );
}