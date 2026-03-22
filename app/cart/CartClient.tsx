"use client";

import { Exam } from "@prisma/client";
import Link from "next/link";
import { useState, useEffect } from "react";

interface CartClientProps {
    allExams: Exam[];
}

export default function CartClient({ allExams }: CartClientProps) {
    const [cartIds, setCartIds] = useState<string[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const savedCart = JSON.parse(localStorage.getItem("am_cart") || "[]");
        setCartIds(savedCart);
    }, []);

    const removeFromCart = (id: string) => {
        const newCart = cartIds.filter(cartId => cartId !== id);
        setCartIds(newCart);
        localStorage.setItem("am_cart", JSON.stringify(newCart));
        window.dispatchEvent(new Event("cart_updated"));
    };

    const cartItems = cartIds
        .map(id => allExams.find(e => e.id === id))
        .filter((e): e is Exam => !!e);

    const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);

    if (!mounted) return null;

    return (
        <div className="max-w-[1100px] mx-auto py-12 px-5 md:px-10">
            <h1 className="text-3xl font-black mb-10 flex items-center gap-4">
                ショッピングカート
                <span className="text-sm font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{cartItems.length} 点</span>
            </h1>

            <div className="flex flex-col lg:flex-row gap-10 items-start">
                {/* Main Cart Items */}
                <div className="flex-1 w-full space-y-6">
                    {cartItems.length > 0 ? (
                        cartItems.map(item => (
                            <div key={item.id} className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 flex gap-6 shadow-sm">
                                <Link href={`/exam/product/${item.id}`} className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden bg-gray-100 shrink-0">
                                    <img src={item.image || "/placeholder.png"} alt={item.title} className="w-full h-full object-cover" />
                                </Link>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="text-[10px] font-bold text-accent uppercase tracking-widest mb-1">{item.category}</div>
                                        <Link href={`/exam/product/${item.id}`} className="text-lg font-bold leading-tight hover:text-accent transition-colors line-clamp-2">
                                            {item.title}
                                        </Link>
                                    </div>
                                    <div className="flex justify-between items-end mt-4">
                                        <span className="text-xl font-black italic">¥{item.price.toLocaleString()}</span>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors py-2 px-4 rounded-full border border-gray-100 hover:border-red-100"
                                        >
                                            削除する
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl py-20 px-10 text-center">
                            <div className="text-5xl mb-6">🛒</div>
                            <h2 className="text-xl font-bold text-gray-400 mb-8">カートは空です</h2>
                            <Link href="/exam-store" className="inline-block bg-text text-white py-4 px-10 rounded-full font-bold transition-transform hover:scale-105">
                                教材を探しにいく
                            </Link>
                        </div>
                    )}
                </div>

                {/* Sidebar Summary */}
                <aside className="w-full lg:w-[350px] shrink-0 sticky top-[160px]">
                    <div className="bg-white border-2 border-gray-100 rounded-3xl p-8 shadow-xl">
                        <h2 className="text-xl font-black mb-8 pb-4 border-b border-gray-50">注文内容</h2>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-gray-500 font-bold">
                                <span>小計</span>
                                <span>¥{subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-gray-500 font-bold">
                                <span>消費税 (10%)</span>
                                <span>込</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-baseline mb-10 pt-6 border-t border-gray-50">
                            <span className="text-lg font-bold">合計金額</span>
                            <span className="text-3xl font-black text-text italic">¥{subtotal.toLocaleString()}</span>
                        </div>

                        <Link
                            href={cartItems.length > 0 ? "/checkout" : "#"}
                            className={`block w-full text-center py-5 rounded-full font-bold text-lg transition-all ${cartItems.length > 0
                                ? "bg-accent text-white shadow-lg shadow-accent/20 hover:scale-[1.02] hover:brightness-110 active:scale-95"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                }`}
                        >
                            レジに進む
                        </Link>

                        <div className="mt-8 text-[11px] text-gray-400 leading-relaxed text-center px-4">
                            ※デジタルコンテンツの性質上、決済後のキャンセルは特商法に基づく場合を除き原則不可となります。
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
