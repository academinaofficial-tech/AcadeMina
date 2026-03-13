"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Exam } from "@prisma/client";

interface ExamStoreClientProps {
    initialExams: Exam[];
}

const masterTags = [
    { tag: "東大院", cat: "大学" }, { tag: "東京科学大学院", cat: "大学" }, { tag: "京大院", cat: "大学" }, { tag: "阪大院", cat: "大学" }, { tag: "慶應院", cat: "大学" }, { tag: "東北大院", cat: "大学" }, { tag: "名大院", cat: "大学" }, { tag: "九大院", cat: "大学" },
    { tag: "情報理工", cat: "専攻" }, { tag: "機械工学", cat: "専攻" }, { tag: "電気電子", cat: "専攻" }, { tag: "数理科学", cat: "専攻" }, { tag: "化学", cat: "専攻" }, { tag: "生命科学", cat: "専攻" }, { tag: "経済学", cat: "専攻" }, { tag: "心理学", cat: "専攻" },
    { tag: "過去問", cat: "タイプ" }, { tag: "過去問解説", cat: "タイプ" }, { tag: "対策教材", cat: "タイプ" }, { tag: "予想問題", cat: "タイプ" }, { tag: "合格体験記", cat: "タイプ" }, { tag: "研究計画書", cat: "タイプ" },
    { tag: "TOEFL", cat: "試験" }, { tag: "TOEIC", cat: "試験" }, { tag: "線形代数", cat: "科目" }, { tag: "微分方程式", cat: "科目" }, { tag: "統計学", cat: "科目" }, { tag: "プログラミング", cat: "科目" }, { tag: "物理", cat: "科目" }, { tag: "有機化学", cat: "科目" },
];

export default function ExamStoreClient({ initialExams }: ExamStoreClientProps) {
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState<{ tag: string; cat: string }[]>([]);
    const [cart, setCart] = useState<string[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem("am_cart") || "[]");
        setCart(savedCart);
    }, []);

    const saveCart = (newCart: string[]) => {
        setCart(newCart);
        localStorage.setItem("am_cart", JSON.stringify(newCart));
        window.dispatchEvent(new Event("cart_updated"));
    };

    const addToCart = (id: string) => {
        if (!cart.includes(id)) {
            saveCart([...cart, id]);
            setIsCartOpen(true);
        }
    };

    const removeFromCart = (index: number) => {
        const newCart = [...cart];
        newCart.splice(index, 1);
        saveCart(newCart);
    };

    const addTag = (tag: string) => {
        if (!selectedTags.includes(tag)) {
            setSelectedTags([...selectedTags, tag]);
        }
        setSearchQuery("");
        setSuggestions([]);
    };

    const removeTag = (tag: string) => {
        setSelectedTags(selectedTags.filter((t) => t !== tag));
    };

    const handleSearchChange = (q: string) => {
        setSearchQuery(q);
        if (q.length > 0) {
            const matches = masterTags.filter((m) => m.tag.includes(q));
            setSuggestions(matches);
        } else {
            setSuggestions([]);
        }
    };

    const filteredExams = initialExams.filter((exam) => {
        if (exam.price < priceRange.min || exam.price > priceRange.max) return false;
        if (selectedTags.length > 0) {
            const text = `${exam.title} ${exam.category} ${exam.description || ""}`.toLowerCase();
            return selectedTags.every((tag) => text.includes(tag.toLowerCase()));
        }
        return true;
    });

    const cartTotal = cart.reduce((total, id) => {
        const exam = initialExams.find((e) => e.id === id);
        return total + (exam?.price || 0);
    }, 0);

    return (
        <>
            <div className="pt-[60px] pb-[50px] px-10  text-center relative overflow-hidden">
                <h1 className="text-[2.5rem] font-extrabold mb-[15px] relative">教材ストア</h1>
                <div className="max-w-[650px] mx-auto relative">
                    <div className="flex flex-wrap gap-2 mb-3 min-h-[0px]">
                        {selectedTags.map((tag) => (
                            <span key={tag} className="flex items-center gap-1 bg-white/95 text-accent py-1 px-3 rounded-full text-sm font-bold">
                                #{tag}
                                <button onClick={() => removeTag(tag)} className="hover:text-red-500">×</button>
                            </span>
                        ))}
                    </div>
                    <div className="relative">
                        <input
                            autoComplete="off"
                            className="w-full py-4 pr-[50px] pl-5 border-none rounded-full text-black text-lg outline-none shadow-lg"
                            placeholder="大学名、科目、キーワードを入力"
                            value={searchQuery}
                            onChange={(e) => handleSearchChange(e.target.value)}
                        />
                        {suggestions.length > 0 && (
                            <div className="absolute top-full left-0 right-0 bg-white rounded-xl shadow-2xl mt-2 max-h-[250px] overflow-y-auto z-[100]">
                                {suggestions.map((s) => (
                                    <div
                                        key={s.tag}
                                        className="py-3 px-5 text-gray-800 cursor-pointer flex justify-between items-center hover:bg-gray-100"
                                        onClick={() => addTag(s.tag)}
                                    >
                                        <span>#{s.tag}</span>
                                        <span className="text-xs bg-gray-200 px-2 py-1 rounded">{s.cat}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row max-w-[1200px] mx-auto py-10 px-5 gap-10">
                <aside className="w-full md:w-[260px] shrink-0 space-y-8">
                    <div>
                        <h3 className="text-lg font-bold mb-4 border-b-2 border-text pb-2">絞り込み</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold mb-2">価格帯</label>
                                <div className="flex gap-2 items-center">
                                    <input
                                        type="number"
                                        className="w-full p-2 border rounded"
                                        placeholder="¥0"
                                        onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) || 0 })}
                                    />
                                    <span>〜</span>
                                    <input
                                        type="number"
                                        className="w-full p-2 border rounded"
                                        placeholder="¥10万"
                                        onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) || 100000 })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                <div className="flex-1">
                    <h2 className="text-2xl font-extrabold mb-8 flex items-center gap-3">
                        すべての教材
                        <span className="text-sm font-normal text-gray-400">{filteredExams.length}件</span>
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredExams.map((exam) => (
                            <div key={exam.id} className="bg-white border rounded-xl overflow-hidden hover:shadow-xl transition-all group">
                                <Link href={`/exam/product/${exam.id}`}>
                                    <div
                                        className="h-48 bg-gray-200 bg-cover bg-center"
                                        style={{ backgroundImage: `url(${exam.image})` }}
                                    />
                                </Link>
                                <div className="p-5">
                                    <div className="text-xs font-bold text-accent uppercase mb-2">{exam.category}</div>
                                    <h3 className="font-bold text-lg mb-3 line-clamp-2 h-14">{exam.title}</h3>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xl font-extrabold">¥{exam.price.toLocaleString()}</span>
                                        <button
                                            onClick={() => addToCart(exam.id)}
                                            className="bg-text text-white px-4 py-2 rounded-lg font-bold hover:bg-accent transition-colors"
                                        >
                                            カートに追加
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {filteredExams.length === 0 && (
                        <div className="text-center py-20 text-gray-400">該当する教材が見つかりませんでした。</div>
                    )}
                </div>
            </div>

            {/* Cart Drawer */}
            {isCartOpen && (
                <div className="fixed inset-0 bg-black/50 z-[2000]" onClick={() => setIsCartOpen(false)} />
            )}
            <div className={`fixed top-0 right-0 w-full md:w-[400px] h-screen bg-white z-[2001] shadow-2xl transition-transform duration-300 ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}>
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold">カート</h2>
                    <button onClick={() => setIsCartOpen(false)} className="text-3xl">&times;</button>
                </div>
                <div className="p-6 overflow-y-auto h-[calc(100vh-200px)]">
                    {cart.length === 0 ? (
                        <p className="text-center text-gray-400 mt-10">カートは空です。</p>
                    ) : (
                        <div className="space-y-4">
                            {cart.map((id, index) => {
                                const exam = initialExams.find((e) => e.id === id);
                                return (
                                    <div key={id} className="flex gap-4 p-3 border rounded-lg">
                                        <div className="w-16 h-16 bg-gray-100 rounded bg-cover" style={{ backgroundImage: `url(${exam?.image})` }} />
                                        <div className="flex-1">
                                            <div className="text-sm font-bold line-clamp-1">{exam?.title}</div>
                                            <div className="font-bold text-accent">¥{exam?.price.toLocaleString()}</div>
                                            <button onClick={() => removeFromCart(index)} className="text-xs text-gray-400 hover:text-red-500">削除</button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
                <div className="p-6 border-t absolute bottom-0 w-full bg-white">
                    <div className="flex justify-between text-xl font-bold mb-6">
                        <span>合計</span>
                        <span>¥{cartTotal.toLocaleString()}</span>
                    </div>
                    <Link
                        href="/cart"
                        className="block w-full bg-accent text-white text-center py-4 rounded-full font-bold text-lg hover:brightness-110"
                    >
                        購入手続きへ進む
                    </Link>
                </div>
            </div>
        </>
    );
}
