"use client";

import { formatDate } from "@/lib/cms";
import Link from "next/link";

interface ColumnDetailClientProps {
    article: any;
}

export default function ColumnDetailClient({ article }: ColumnDetailClientProps) {
    if (!article) return <div className="text-center py-20">記事が見つかりませんでした。</div>;

    const imgUrl = article.eyecatch?.url;

    return (
        <article className="max-w-[720px] mx-auto py-16 px-6 lg:px-0">
            {/* Header Section */}
            <header className="mb-12 text-center">
                <div className="text-accent font-bold text-sm uppercase tracking-widest mb-4">
                    {article.category?.name || "Column"}
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-6">
                    {article.title}
                </h1>
                <div className="flex items-center justify-center gap-4 text-gray-400 font-medium">
                    <span>{formatDate(article.publishedAt)}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    <span>{article.author || "AcadeMina編集部"}</span>
                </div>
            </header>

            {/* Hero Image */}
            {imgUrl && (
                <div className="mb-16 -mx-6 lg:-mx-24">
                    <div
                        className="w-full aspect-[16/9] bg-gray-100 rounded-3xl overflow-hidden shadow-2xl bg-cover bg-center"
                        style={{ backgroundImage: `url(${imgUrl})` }}
                    />
                </div>
            )}

            {/* Content Section - "Note-like" Typography */}
            <div className="prose prose-lg max-w-none prose-slate prose-headings:font-extrabold prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-8 prose-p:leading-relaxed prose-p:mb-8 prose-img:rounded-3xl prose-img:shadow-lg">
                {/* 
                  microCMSのリッチエディタから来るHTMLを注入します。
                  note風のゆったりとした行間とフォントサイズを意識しています。
                */}
                <div
                    dangerouslySetInnerHTML={{ __html: article.content || "<p>記事の中身がここに入ります。microCMSのリッチエディタで編集した内容が美しく反映されます。</p><p>noteのように画像を自由に配置したり、引用や箇条書きを使って、読み手にストレスのない読書体験を提供しましょう。</p><h2>見出しの例</h2><p>このように大きな見出しも綺麗に表示されます。研究の合間にサクッと読める、そんなコラムを目指しています。</p>" }}
                />
            </div>

            <footer className="mt-24 pt-10 border-t border-gray-100 text-center">
                <p className="text-gray-400 mb-8 font-medium">最後まで読んでいただきありがとうございます。</p>
                <Link
                    href={article.category?.includes("news") ? "/news" : "/column"}
                    className="inline-block px-12 py-4 border-2 border-black rounded-full font-bold transition-all duration-300 hover:bg-black hover:text-white"
                >
                    ← {article.category?.includes("news") ? "ニュース一覧に戻る" : "全てのコラムを見る"}
                </Link>
            </footer>
        </article>
    );
}
