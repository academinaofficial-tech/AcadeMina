"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Category = { id: string; name: string };

export default function QaNewClient({ categories }: { categories: Category[] }) {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [anonymous, setAnonymous] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !body.trim() || !categoryId) {
            setError("すべての項目を入力してください");
            return;
        }
        setLoading(true);
        setError("");
        const res = await fetch("/api/qa/questions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, body, categoryId, anonymous }),
        });
        if (res.ok) {
            const data = await res.json();
            router.push(`/exam/qa/${data.id}`);
        } else {
            const data = await res.json();
            setError(data.error ?? "エラーが発生しました");
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-2xl p-8 space-y-6">
            {/* カテゴリ */}
            <div>
                <label className="block text-sm font-bold mb-2">カテゴリ <span className="text-red-500">*</span></label>
                <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-text transition-colors bg-white"
                >
                    <option value="">カテゴリを選択</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>

            {/* タイトル */}
            <div>
                <label className="block text-sm font-bold mb-2">タイトル <span className="text-red-500">*</span></label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="例：東大院の研究計画書の書き方を教えてください"
                    maxLength={120}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-text transition-colors"
                />
                <p className="text-xs text-gray-400 mt-1 text-right">{title.length}/120</p>
            </div>

            {/* 本文 */}
            <div>
                <label className="block text-sm font-bold mb-2">本文 <span className="text-red-500">*</span></label>
                <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="質問の詳細を記入してください。背景や状況を具体的に書くと回答を得やすくなります。"
                    rows={8}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-text transition-colors resize-none leading-relaxed"
                />
            </div>

            {/* 匿名オプション */}
            <label className="flex items-center gap-3 cursor-pointer select-none">
                <div
                    onClick={() => setAnonymous(!anonymous)}
                    className={`w-10 h-6 rounded-full transition-colors flex items-center px-0.5 ${
                        anonymous ? "bg-text" : "bg-gray-200"
                    }`}
                >
                    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        anonymous ? "translate-x-4" : "translate-x-0"
                    }`} />
                </div>
                <div>
                    <p className="text-sm font-bold">匿名で投稿する</p>
                    <p className="text-xs text-gray-400">オンにすると投稿者名が表示されません</p>
                </div>
            </label>

            {error && (
                <p className="text-sm text-red-500 bg-red-50 rounded-lg px-4 py-3">{error}</p>
            )}

            <div className="flex justify-end gap-3">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-3 rounded-full border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                    キャンセル
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-text text-white rounded-full font-bold text-sm hover:opacity-80 transition-opacity disabled:opacity-50"
                >
                    {loading ? "投稿中..." : "投稿する"}
                </button>
            </div>
        </form>
    );
}
