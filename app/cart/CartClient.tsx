"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/cartStore";

type CouponResult = {
    discountType: "PERCENT" | "FIXED";
    discountValue: number;
    discountAmount: number;
};

export default function CartClient() {
    const { items, removeItem, clearCart } = useCartStore();
    const router = useRouter();

    const [couponCode, setCouponCode] = useState("");
    const [coupon, setCoupon] = useState<CouponResult | null>(null);
    const [couponError, setCouponError] = useState("");
    const [couponLoading, setCouponLoading] = useState(false);
    const [checkoutLoading, setCheckoutLoading] = useState(false);

    const subtotal = items.reduce((sum, item) => sum + item.price, 0);
    const discountAmount = coupon?.discountAmount ?? 0;
    const total = Math.max(0, subtotal - discountAmount);

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;
        setCouponLoading(true);
        setCouponError("");
        setCoupon(null);

        const res = await fetch("/api/coupons/validate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: couponCode.trim(), subtotal }),
        });
        const data = await res.json();

        if (!res.ok) {
            setCouponError(data.error || "クーポンが適用できませんでした");
        } else {
            setCoupon(data);
        }
        setCouponLoading(false);
    };

    const handleCheckout = async () => {
        if (items.length === 0) return;
        setCheckoutLoading(true);

        const res = await fetch("/api/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                examIds: items.map((i) => i.examId),
                couponCode: coupon ? couponCode.trim() : undefined,
            }),
        });
        const data = await res.json();

        if (data.url) {
            clearCart();
            window.location.href = data.url;
        } else if (res.status === 401) {
            router.push(`/account/login?redirect_url=/cart`);
        } else {
            alert(data.error || "エラーが発生しました。時間を置いて再度お試しください。");
            setCheckoutLoading(false);
        }
    };

    return (
        <div className="max-w-[1100px] mx-auto py-12 px-5 md:px-10">
            <h1 className="text-3xl font-black mb-10 flex items-center gap-4">
                ショッピングカート
                <span className="text-sm font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                    {items.length} 点
                </span>
            </h1>

            <div className="flex flex-col lg:flex-row gap-10 items-start">
                {/* カート商品リスト */}
                <div className="flex-1 w-full space-y-6">
                    {items.length > 0 ? (
                        items.map((item) => (
                            <div
                                key={item.examId}
                                className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 flex gap-6 shadow-sm"
                            >
                                <Link
                                    href={`/exam/product/${item.examId}`}
                                    className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden bg-gray-100 shrink-0"
                                >
                                    <img
                                        src={item.image || "/placeholder.png"}
                                        alt={item.title}
                                        className="w-full h-full object-cover"
                                    />
                                </Link>
                                <div className="flex-1 flex flex-col justify-between">
                                    <Link
                                        href={`/exam/product/${item.examId}`}
                                        className="text-lg font-bold leading-tight hover:text-accent transition-colors line-clamp-2"
                                    >
                                        {item.title}
                                    </Link>
                                    <div className="flex justify-between items-end mt-4">
                                        <span className="text-xl font-black italic">
                                            ¥{item.price.toLocaleString()}
                                        </span>
                                        <button
                                            onClick={() => removeItem(item.examId)}
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
                            <Link
                                href="/exam-store"
                                className="inline-block bg-text text-white py-4 px-10 rounded-full font-bold transition-transform hover:scale-105"
                            >
                                教材を探しにいく
                            </Link>
                        </div>
                    )}
                </div>

                {/* サイドバー */}
                <aside className="w-full lg:w-[360px] shrink-0 lg:sticky lg:top-[160px]">
                    <div className="bg-white border-2 border-gray-100 rounded-3xl p-8 shadow-xl">
                        <h2 className="text-xl font-black mb-6 pb-4 border-b border-gray-100">注文内容</h2>

                        {/* クーポン入力 */}
                        <div className="mb-6">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                                クーポンコード
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={couponCode}
                                    onChange={(e) => {
                                        setCouponCode(e.target.value.toUpperCase());
                                        setCoupon(null);
                                        setCouponError("");
                                    }}
                                    placeholder="コードを入力"
                                    className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold tracking-widest focus:outline-none focus:border-accent"
                                />
                                <button
                                    onClick={handleApplyCoupon}
                                    disabled={couponLoading || !couponCode.trim()}
                                    className="px-4 py-2.5 bg-text text-white rounded-xl text-sm font-bold hover:opacity-80 transition-opacity disabled:opacity-40"
                                >
                                    {couponLoading ? "..." : "適用"}
                                </button>
                            </div>
                            {couponError && (
                                <p className="mt-2 text-xs text-red-500 font-bold">{couponError}</p>
                            )}
                            {coupon && (
                                <p className="mt-2 text-xs text-green-600 font-bold">
                                    ✓ クーポン適用済み（
                                    {coupon.discountType === "PERCENT"
                                        ? `${coupon.discountValue}%OFF`
                                        : `¥${coupon.discountValue.toLocaleString()}OFF`}
                                    ）
                                </p>
                            )}
                        </div>

                        {/* 金額内訳 */}
                        <div className="space-y-3 mb-6 text-sm">
                            <div className="flex justify-between text-gray-500 font-bold">
                                <span>小計</span>
                                <span>¥{subtotal.toLocaleString()}</span>
                            </div>
                            {coupon && (
                                <div className="flex justify-between text-green-600 font-bold">
                                    <span>割引</span>
                                    <span>－¥{discountAmount.toLocaleString()}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-gray-400 text-xs font-bold">
                                <span>消費税</span>
                                <span>税込</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-baseline mb-8 pt-4 border-t border-gray-100">
                            <span className="text-lg font-bold">合計金額</span>
                            <span className="text-3xl font-black text-text italic">
                                ¥{total.toLocaleString()}
                            </span>
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={items.length === 0 || checkoutLoading}
                            className="w-full py-5 bg-accent text-white rounded-full font-bold text-lg shadow-lg shadow-accent/20 transition-all hover:scale-[1.02] hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {checkoutLoading ? "処理中..." : "レジに進む"}
                        </button>

                        <p className="mt-4 text-[11px] text-gray-400 leading-relaxed text-center">
                            ※デジタルコンテンツの性質上、決済後のキャンセルは特商法に基づく場合を除き原則不可となります。
                        </p>
                    </div>
                </aside>
            </div>
        </div>
    );
}
