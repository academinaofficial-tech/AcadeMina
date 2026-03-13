"use client";

import { Exam } from "@prisma/client";
import Link from "next/link";
import { useState, useEffect } from "react";

interface ProductDetailClientProps {
    exam: Exam;
}

export default function ProductDetailClient({ exam }: ProductDetailClientProps) {
    const [cart, setCart] = useState<string[]>([]);

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem("am_cart") || "[]");
        setCart(savedCart);
    }, []);

    const addToCart = () => {
        if (!cart.includes(exam.id)) {
            const newCart = [...cart, exam.id];
            setCart(newCart);
            localStorage.setItem("am_cart", JSON.stringify(newCart));
            window.dispatchEvent(new Event("cart_updated"));
            alert("カートに追加しました！");
        } else {
            alert("すでにカートに入っています。");
        }
    };

    const buyNow = () => {
        if (!cart.includes(exam.id)) {
            const newCart = [...cart, exam.id];
            localStorage.setItem("am_cart", JSON.stringify(newCart));
            window.dispatchEvent(new Event("cart_updated"));
        }
        window.location.href = "/checkout";
    };

    return (
        <div className="bg-white min-h-screen">
            {/* Breadcrumb */}
            <div className="py-4 px-5 md:px-10 text-xs text-gray-400 bg-gray-50 border-b">
                <div className="max-w-[1100px] mx-auto flex items-center gap-2">
                    <Link href="/" className="hover:text-accent">TOP</Link>
                    <span>&gt;</span>
                    <Link href="/exam-store" className="hover:text-accent">教材ストア</Link>
                    <span>&gt;</span>
                    <span className="text-gray-600 font-medium truncate">{exam.title}</span>
                </div>
            </div>

            <div className="max-w-[1100px] mx-auto py-12 px-5 flex flex-col md:flex-row gap-12 items-start">
                {/* Main Content */}
                <div className="flex-1">
                    <div className="w-full aspect-video rounded-3xl overflow-hidden bg-gray-100 mb-10 shadow-sm">
                        <img src={exam.image} alt={exam.title} className="w-full h-full object-cover" />
                    </div>

                    <div className="mb-10">
                        <div className="text-sm font-bold text-accent uppercase tracking-widest mb-3">
                            {exam.category}
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-6">
                            {exam.title}
                        </h1>
                        {exam.author && (
                            <div className="flex items-center gap-2 text-gray-500 font-medium italic">
                                <span>By</span>
                                <span className="text-text font-bold not-italic">{exam.author}</span>
                            </div>
                        )}
                    </div>

                    <div className="space-y-12">
                        <section>
                            <h2 className="text-xl font-extrabold mb-6 pb-2 border-b-4 border-text inline-block">概要</h2>
                            <p className="text-lg leading-relaxed text-gray-600 whitespace-pre-wrap">
                                {exam.description || "この教材の概要説明はありません。"}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-extrabold mb-6 pb-2 border-b-4 border-text inline-block">学習内容</h2>
                            <ul className="grid gap-4">
                                {exam.contents.length > 0 ? (
                                    exam.contents.map((item: string, idx: number) => (
                                        <li key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                            <span className="text-accent text-xl font-bold">✓</span>
                                            <span className="font-bold text-gray-700">{item}</span>
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-gray-400">内容は登録されていません。</li>
                                )}
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-extrabold mb-6 pb-2 border-b-4 border-text inline-block">本文プレビュー</h2>
                            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-8 relative overflow-hidden">
                                <p className="text-gray-500 leading-relaxed italic">
                                    {exam.preview || "プレビューは利用できません。"}
                                    <span className="ml-1 opacity-50">...（続きは購入後にご覧いただけます）</span>
                                </p>
                                <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-gray-50 to-transparent"></div>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Pricing / CTA Panel */}
                <aside className="w-full md:w-[350px] shrink-0 md:sticky md:top-[160px]">
                    <div className="bg-white border-2 border-gray-100 rounded-3xl p-8 shadow-xl">
                        <div className="mb-6">
                            <div className="text-3xl font-black text-text mb-1">
                                ¥{exam.price.toLocaleString()}
                            </div>
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">税込料金</div>
                        </div>

                        <div className="space-y-4">
                            <button
                                onClick={addToCart}
                                className="w-full py-5 bg-accent text-white rounded-full font-bold text-lg shadow-lg shadow-accent/20 transition-all hover:scale-[1.02] hover:brightness-110 active:scale-95"
                            >
                                カートにいれる
                            </button>
                            <button
                                onClick={buyNow}
                                className="w-full py-5 bg-text text-white rounded-full font-bold text-lg transition-all hover:opacity-90 active:scale-95"
                            >
                                今すぐ購入
                            </button>
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-50">
                            <button className="w-full py-3 flex items-center justify-center gap-2 text-gray-400 font-bold hover:text-accent transition-colors">
                                <span>♡</span>
                                <span>お気に入りに追加</span>
                            </button>
                        </div>
                    </div>

                    <div className="mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-100">
                        <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                            <span>🛡️</span> 安心の返金保証
                        </h4>
                        <p className="text-xs text-blue-700 leading-relaxed">
                            万が一内容にご満足いただけない場合、購入後24時間以内であれば返金リクエストが可能です。
                        </p>
                    </div>
                </aside>
            </div>
        </div>
    );
}
