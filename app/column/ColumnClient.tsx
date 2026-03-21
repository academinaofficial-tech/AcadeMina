"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/cms";

interface ColumnClientProps {
    initialArticles: any[];
    featuredArticle: any | null;
}

export default function ColumnClient({ initialArticles, featuredArticle }: ColumnClientProps) {
    const [articles, setArticles] = useState(initialArticles);
    const [selectedCategory, setSelectedCategory] = useState("all");

    // ② `category.category` (例: "院試対策") を抽出してタブを作る
    const dynamicCategories = Array.from(
        new Set(initialArticles.map(a => a.category?.category).filter(Boolean))
    ) as string[];

    const categories = ["all", ...dynamicCategories];

    const filterByCategory = (cat: string) => {
        setSelectedCategory(cat);
        if (cat === "all") {
            setArticles(initialArticles);
        } else {
            const filtered = initialArticles.filter(a => a.category?.category === cat);
            setArticles(filtered);
        }
    };

    return (
        <div className="max-w-[1100px] mx-auto py-10 px-5">
            {/* 1. NEW Article Highlight */}
            {featuredArticle && (
                <div className="mb-20">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="w-12 h-[2px] bg-black"></span>
                        <span className="text-sm font-extrabold tracking-[0.2em] uppercase text-gray-400">What's New</span>
                        <span className="text-xl font-extrabold ml-1">最新の記事</span>
                    </div>
                    <Link href={`/column-detail?id=${featuredArticle.slug}`} className="group block no-underline text-inherit">
                        <div className="flex flex-col md:flex-row gap-0 md:gap-10 bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
                            <div
                                className="w-full md:w-1/2 min-h-[250px] md:min-h-[400px] bg-gray-100 bg-cover bg-center shrink-0"
                                style={{ backgroundImage: `url(${featuredArticle.eyecatch?.url || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop'})` }}
                            />
                            <div className="p-8 md:p-12 flex flex-col justify-center">
                                <span className="inline-block bg-black text-white px-3 py-1 rounded-full text-[0.7rem] font-bold mb-4 w-fit tracking-wider">NEW</span>
                                <h2 className="text-2xl md:text-3xl font-extrabold leading-tight mb-4 group-hover:text-accent transition-colors">{featuredArticle.title}</h2>
                                <p className="text-gray-500 leading-relaxed mb-6 line-clamp-3">{featuredArticle.description || "院試に向けた緻密な戦略と、合格者たちのリアルな声をお届けします。"}</p>
                                <div className="text-sm text-gray-400 font-medium">
                                    {formatDate(featuredArticle.publishedAt)} / {featuredArticle.category?.category}
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            )}

            {/* 2. Article Grid Section with Filters */}
            <div className="pt-10 border-t border-gray-100">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <h2 className="text-3xl font-extrabold tracking-tight mb-2 flex items-center gap-3">
                            <span className="text-gray-300 text-lg font-bold">Archive</span>
                            {selectedCategory === "all" ? "全ての記事" : selectedCategory}
                        </h2>
                        <p className="text-gray-400 text-sm font-medium">{articles.length} 件の記事があります</p>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                className={`px-5 py-2 rounded-full border transition-all duration-200 text-xs font-bold ${selectedCategory === cat
                                    ? "bg-black text-white border-black shadow-lg shadow-black/10"
                                    : "bg-white text-gray-400 border-gray-100 hover:border-gray-300 hover:text-gray-600"
                                    }`}
                                onClick={() => filterByCategory(cat)}
                            >
                                {cat === "all" ? "すべて" : cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {articles.map((a) => (
                        <Link key={a.id} href={`/column-detail?id=${a.id}`} className="group no-underline text-inherit">
                            <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1 h-full flex flex-col">
                                <div
                                    className="h-48 bg-gray-100 bg-cover bg-center"
                                    style={{ backgroundImage: `url(${a.eyecatch?.url || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop'})` }}
                                />
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="text-[10px] font-bold text-accent mb-2 uppercase tracking-widest">{a.category?.category || 'Column'}</div>
                                    <h3 className="text-lg font-bold leading-snug mb-3 group-hover:text-accent transition-colors line-clamp-2">{a.title}</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">{a.description || "記事の要約がここに入ります。読み応えのある内容をお楽しみください。"}</p>
                                    <div className="mt-auto text-xs text-gray-400 flex justify-between font-medium">
                                        <span>{formatDate(a.publishedAt)}</span>
                                        <span>{a.author || 'AcadeMina編集部'}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {articles.length === 0 && (
                    <div className="text-center py-20 text-gray-400 border-2 border-dashed border-gray-100 rounded-3xl">
                        記事が見つかりませんでした。
                    </div>
                )}
            </div>
        </div>
    );
}