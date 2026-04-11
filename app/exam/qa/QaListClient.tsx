"use client";

import { useState } from "react";
import Link from "next/link";

type Category = { id: string; name: string; order: number };
type Question = {
    id: string;
    title: string;
    body: string;
    anonymous: boolean;
    createdAt: string;
    category: Category;
    profile: { firstName: string; lastName: string };
    _count: { answers: number };
};

export default function QaListClient({
    initialQuestions,
    categories,
    currentUserId,
}: {
    initialQuestions: Question[];
    categories: Category[];
    currentUserId: string | null;
}) {
    const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

    const filtered =
        selectedCategory === "ALL"
            ? initialQuestions
            : initialQuestions.filter((q) => q.category.id === selectedCategory);

    return (
        <div className="max-w-[960px] mx-auto px-5 py-10">
            {/* 質問投稿ボタン */}
            <div className="flex justify-end mb-8">
                <Link
                    href={currentUserId ? "/exam/qa/new" : "/account/login?redirect_url=/exam/qa/new"}
                    className="inline-flex items-center gap-2 bg-text text-white px-6 py-3 rounded-full font-bold text-sm hover:opacity-80 transition-opacity"
                >
                    <span className="text-lg leading-none">+</span> 質問を投稿する
                </Link>
            </div>

            {/* カテゴリタブ */}
            <div className="flex flex-wrap gap-2 mb-8">
                <button
                    onClick={() => setSelectedCategory("ALL")}
                    className={`px-4 py-2 rounded-full text-sm font-bold border transition-colors ${
                        selectedCategory === "ALL"
                            ? "bg-text text-white border-text"
                            : "bg-white text-gray-600 border-gray-200 hover:border-text hover:text-text"
                    }`}
                >
                    すべて
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-4 py-2 rounded-full text-sm font-bold border transition-colors ${
                            selectedCategory === cat.id
                                ? "bg-text text-white border-text"
                                : "bg-white text-gray-600 border-gray-200 hover:border-text hover:text-text"
                        }`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* 質問グリッド */}
            {filtered.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                    <p className="text-lg font-bold mb-2">質問がまだありません</p>
                    <p className="text-sm">最初の質問を投稿してみましょう</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((q) => (
                        <Link key={q.id} href={`/exam/qa/${q.id}`}>
                            <div className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-text/30 hover:shadow-md transition-all group cursor-pointer h-full flex flex-col">
                                {/* カテゴリ + 回答数 */}
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-bold text-accent tracking-wide">
                                        {q.category.name}
                                    </span>
                                    <div className="flex items-center gap-1.5">
                                        {q._count.answers > 0 && (
                                            <span className="bg-accent/10 text-accent text-[10px] font-bold px-2 py-0.5 rounded-full">
                                                回答済み
                                            </span>
                                        )}
                                        <span className="bg-gray-100 text-gray-500 text-xs font-bold px-2 py-0.5 rounded-full min-w-[24px] text-center">
                                            {q._count.answers}
                                        </span>
                                    </div>
                                </div>

                                {/* タイトル */}
                                <h2 className="font-bold text-sm leading-snug mb-2 group-hover:text-text transition-colors line-clamp-3 flex-1">
                                    {q.title}
                                </h2>

                                {/* 本文プレビュー */}
                                <p className="text-xs text-gray-400 line-clamp-2 mb-4">{q.body}</p>

                                {/* フッター */}
                                <div className="flex items-center gap-1.5 text-[11px] text-gray-400 border-t border-gray-50 pt-3 mt-auto">
                                    <span>
                                        {q.anonymous ? "匿名" : `${q.profile.lastName} ${q.profile.firstName}`}
                                    </span>
                                    <span>·</span>
                                    <span>{new Date(q.createdAt).toLocaleDateString("ja-JP")}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
