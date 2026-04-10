"use client";

import { useState } from "react";

type Category = {
    id: string;
    name: string;
    order: number;
    _count: { questions: number };
};

export default function AdminQaClient({ categories: initial }: { categories: Category[] }) {
    const [categories, setCategories] = useState(initial);
    const [newName, setNewName] = useState("");
    const [newOrder, setNewOrder] = useState("");
    const [adding, setAdding] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const addCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim()) return;
        setAdding(true);
        const res = await fetch("/api/qa/categories", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newName.trim(), order: Number(newOrder) || 0 }),
        });
        if (res.ok) {
            const cat = await res.json();
            setCategories([...categories, { ...cat, _count: { questions: 0 } }]);
            setNewName("");
            setNewOrder("");
        } else {
            const data = await res.json();
            alert(data.error ?? "エラーが発生しました");
        }
        setAdding(false);
    };

    const deleteCategory = async (id: string) => {
        const cat = categories.find((c) => c.id === id);
        if (cat && cat._count.questions > 0) {
            alert("このカテゴリには質問が存在するため削除できません");
            return;
        }
        if (!confirm("このカテゴリを削除しますか？")) return;
        setDeletingId(id);
        const res = await fetch("/api/qa/categories", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });
        if (res.ok) {
            setCategories(categories.filter((c) => c.id !== id));
        }
        setDeletingId(null);
    };

    return (
        <div className="space-y-8">
            {/* 新規追加 */}
            <section className="bg-white border border-gray-100 rounded-2xl p-8">
                <h2 className="text-lg font-bold mb-6">カテゴリを追加</h2>
                <form onSubmit={addCategory} className="flex gap-3">
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="カテゴリ名（例：研究計画書）"
                        className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-text transition-colors"
                    />
                    <input
                        type="number"
                        value={newOrder}
                        onChange={(e) => setNewOrder(e.target.value)}
                        placeholder="順序"
                        className="w-24 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-text transition-colors"
                    />
                    <button
                        type="submit"
                        disabled={adding || !newName.trim()}
                        className="px-6 py-3 bg-text text-white rounded-xl font-bold text-sm hover:opacity-80 transition-opacity disabled:opacity-50 whitespace-nowrap"
                    >
                        {adding ? "追加中..." : "追加"}
                    </button>
                </form>
            </section>

            {/* カテゴリ一覧 */}
            <section className="bg-white border border-gray-100 rounded-2xl p-8">
                <h2 className="text-lg font-bold mb-6">カテゴリ一覧</h2>
                <div className="space-y-3">
                    {categories.length === 0 && (
                        <p className="text-center py-8 text-gray-400">カテゴリがありません</p>
                    )}
                    {categories
                        .sort((a, b) => a.order - b.order)
                        .map((cat) => (
                            <div
                                key={cat.id}
                                className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl"
                            >
                                <div className="flex items-center gap-4">
                                    <span className="text-xs text-gray-400 font-mono w-6">{cat.order}</span>
                                    <span className="font-bold">{cat.name}</span>
                                    <span className="text-xs text-gray-400">
                                        {cat._count.questions}件の質問
                                    </span>
                                </div>
                                <button
                                    onClick={() => deleteCategory(cat.id)}
                                    disabled={deletingId === cat.id}
                                    className="text-xs text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                                >
                                    削除
                                </button>
                            </div>
                        ))}
                </div>
            </section>
        </div>
    );
}
