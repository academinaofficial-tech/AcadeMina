"use client";

import { Exam, Profile } from "@prisma/client";
import Link from "next/link";
import { useState, useEffect } from "react";

interface CheckoutClientProps {
    allExams: Exam[];
    initialProfile: Profile | null;
}

export default function CheckoutClient({ allExams, initialProfile }: CheckoutClientProps) {
    const [cartIds, setCartIds] = useState<string[]>([]);
    const [mounted, setMounted] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("card");
    const [agreed, setAgreed] = useState(false);
    const [loading, setLoading] = useState(false);

    // Profile Form State
    const [profName, setProfName] = useState(initialProfile ? `${initialProfile.lastName} ${initialProfile.firstName}` : "");
    const [profEmail, setProfEmail] = useState(initialProfile?.email || "");
    const [profUniv, setProfUniv] = useState(initialProfile?.university || "");

    useEffect(() => {
        setMounted(true);
        const savedCart = JSON.parse(localStorage.getItem("am_cart") || "[]");
        setCartIds(savedCart);
    }, []);

    const cartItems = cartIds
        .map(id => allExams.find(e => e.id === id))
        .filter((e): e is Exam => !!e);

    const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);

    const handleCheckout = async () => {
        if (!agreed || loading) return;

        setLoading(true);

        try {
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ cartIds }),
            });

            const data = await response.json();

            if (data.url) {
                // Save order info locally (metadata will also be in Stripe)
                const orderId = `AM-${Date.now().toString().slice(-6)}`;
                localStorage.setItem("am_order", JSON.stringify({
                    orderId,
                    items: cartIds
                }));

                // Clear cart locally
                localStorage.removeItem("am_cart");
                window.dispatchEvent(new Event("cart_updated"));

                // Redirect to Stripe
                window.location.href = data.url;
            } else {
                alert("決済エラーが発生しました。時間を置いて再度お試しください。");
                setLoading(false);
            }
        } catch (error) {
            console.error("Checkout error:", error);
            alert("通信エラーが発生しました。");
            setLoading(false);
        }
    };

    if (!mounted) return null;

    if (cartItems.length === 0) {
        return (
            <div className="max-w-[700px] mx-auto py-24 px-5 text-center">
                <div className="text-6xl mb-8">🛒</div>
                <h1 className="text-2xl font-bold text-gray-400 mb-10">カートが空のため、決済ページを表示できません。</h1>
                <Link href="/exam-store" className="inline-block bg-text text-white py-4 px-10 rounded-full font-bold">
                    教材ストアへ戻る
                </Link>
            </div>
        );
    }

    return (
        <div>
            {/* Step Progress Bar */}
            <div className="flex justify-center items-center py-8 px-5 bg-white border-b border-gray-100">
                <div className="flex items-center gap-2 text-sm font-black text-text opacity-50">
                    <span className="w-8 h-8 rounded-full border-2 border-text flex items-center justify-center">✓</span>
                    カート
                </div>
                <div className="w-12 h-0.5 bg-gray-200 mx-4"></div>
                <div className="flex items-center gap-2 text-sm font-black text-accent">
                    <span className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center">2</span>
                    決済情報
                </div>
                <div className="w-12 h-0.5 bg-gray-100 mx-4"></div>
                <div className="flex items-center gap-2 text-sm font-black text-gray-300">
                    <span className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center font-normal">3</span>
                    購入完了
                </div>
            </div>

            <div className="max-w-[1100px] mx-auto py-12 px-5 flex flex-col lg:flex-row gap-12 items-start">
                <div className="flex-1 w-full space-y-10">
                    {/* Payment Method */}
                    <section className="bg-white border border-gray-100 rounded-3xl p-8 md:p-10 shadow-sm">
                        <h2 className="text-xl font-black mb-8 pb-3 border-b-4 border-text inline-block">お支払い方法</h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-5 rounded-2xl border-2 border-accent bg-blue-50/50 shadow-inner">
                                <input
                                    type="radio"
                                    checked
                                    readOnly
                                    className="w-5 h-5 accent-accent"
                                />
                                <span className="font-bold">クレジットカード（）</span>
                                <div className="ml-auto flex gap-1">
                                    {["VISA", "MC", "AMEX", "JCB"].map(logo => (
                                        <span key={logo} className="bg-gray-100 text-[9px] font-black px-1.5 py-0.5 rounded text-gray-500">{logo}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 p-6 bg-blue-50/30 rounded-2xl border border-blue-100 text-center">
                            <p className="text-sm font-bold text-blue-700/70 leading-relaxed">
                                「決済画面に進む」ボタンを押すと、<br />
                                決済ページへ移動します。
                            </p>
                        </div>
                    </section>

                    {/* Registration Info */}
                    <section className="bg-white border border-gray-100 rounded-3xl p-8 md:p-10 shadow-sm">
                        <h2 className="text-xl font-black mb-8 pb-3 border-b-4 border-text inline-block">ご登録情報</h2>
                        <div className="grid gap-6">
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">氏名 <span className="text-accent">*</span></label>
                                <input
                                    type="text"
                                    value={profName}
                                    onChange={(e) => setProfName(e.target.value)}
                                    placeholder="例：山田 太郎"
                                    className="w-full p-4 rounded-xl border border-gray-100 font-bold focus:border-accent outline-none bg-gray-50/30"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">メールアドレス <span className="text-accent">*</span></label>
                                <input
                                    type="email"
                                    value={profEmail}
                                    onChange={(e) => setProfEmail(e.target.value)}
                                    placeholder="例：yamada@example.com"
                                    className="w-full p-4 rounded-xl border border-gray-100 font-bold focus:border-accent outline-none bg-gray-50/30"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">所属（大学・学部・学年）</label>
                                <input
                                    type="text"
                                    value={profUniv}
                                    onChange={(e) => setProfUniv(e.target.value)}
                                    placeholder="例：東京大学 工学部 3年"
                                    className="w-full p-4 rounded-xl border border-gray-100 font-bold focus:border-accent outline-none bg-gray-50/30"
                                />
                            </div>
                        </div>
                    </section>
                </div>

                {/* Summary Sidebar */}
                <aside className="w-full lg:w-[400px] shrink-0 sticky top-[160px]">
                    <div className="bg-text text-white rounded-3xl p-10 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>

                        <h2 className="text-xl font-black mb-10 relative z-10 border-b border-white/10 pb-4">注文サマリー</h2>

                        <div className="space-y-6 mb-12 relative z-10">
                            {cartItems.map(item => (
                                <div key={item.id} className="flex justify-between items-start gap-4">
                                    <div className="flex-1">
                                        <div className="text-sm font-bold line-clamp-1 opacity-90">{item.title}</div>
                                        <div className="text-[10px] font-bold text-accent-light uppercase mt-1 tracking-widest">Digital Content</div>
                                    </div>
                                    <div className="font-bold whitespace-nowrap">¥{item.price.toLocaleString()}</div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between items-baseline mb-12 pt-8 border-t border-white/10 relative z-10">
                            <span className="text-sm font-bold opacity-60">合計（税込）</span>
                            <span className="text-4xl font-black italic">¥{subtotal.toLocaleString()}</span>
                        </div>

                        <div className="mb-10 relative z-10">
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={agreed}
                                    onChange={(e) => setAgreed(e.target.checked)}
                                    className="mt-1 w-5 h-5 accent-accent"
                                />
                                <span className="text-xs font-bold leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity">
                                    <Link href="/legal" className="underline hover:text-accent">利用規約</Link>および<Link href="/legal" className="underline hover:text-accent">プライバシーポリシー</Link>の内容を確認し、同意します。
                                </span>
                            </label>
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={!agreed || loading}
                            className={`w-full py-6 rounded-full font-black text-xl transition-all relative z-10 ${agreed && !loading
                                ? "bg-accent text-white shadow-xl shadow-black/20 hover:scale-[1.02] hover:brightness-110 active:scale-95"
                                : "bg-white/10 text-white/30 cursor-not-allowed border border-white/10"
                                }`}
                        >
                            {loading ? "処理中..." : "決済画面に進む"}
                        </button>

                        <div className="mt-8 text-center relative z-10">
                            <Link href="/cart" className="text-xs font-bold opacity-40 hover:opacity-100 transition-opacity uppercase tracking-widest">
                                ← カートに戻る
                            </Link>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
