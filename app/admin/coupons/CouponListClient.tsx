"use client";

import { useState } from "react";

type Coupon = {
    id: string;
    code: string;
    discountType: string;
    discountValue: number;
    minAmount: number;
    maxUses: number | null;
    usedCount: number;
    expiresAt: Date | null;
    isActive: boolean;
    createdAt: Date;
};

export default function CouponListClient({ coupons: initial }: { coupons: Coupon[] }) {
    const [coupons, setCoupons] = useState(initial);
    const [loading, setLoading] = useState<string | null>(null);

    const toggleActive = async (id: string, isActive: boolean) => {
        setLoading(id);
        const res = await fetch("/api/admin/coupons", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, isActive: !isActive }),
        });
        if (res.ok) {
            setCoupons((prev) =>
                prev.map((c) => (c.id === id ? { ...c, isActive: !isActive } : c))
            );
        }
        setLoading(null);
    };

    if (coupons.length === 0) {
        return (
            <div className="bg-white rounded-2xl p-16 text-center text-gray-400 border border-gray-100">
                クーポンがまだありません
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {coupons.map((coupon) => (
                <div
                    key={coupon.id}
                    className={`bg-white border rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center gap-4 transition-opacity ${
                        coupon.isActive ? "border-gray-100" : "border-gray-100 opacity-50"
                    }`}
                >
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="font-black text-lg tracking-widest text-text">
                                {coupon.code}
                            </span>
                            <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    coupon.isActive
                                        ? "bg-green-100 text-green-700"
                                        : "bg-gray-100 text-gray-400"
                                }`}
                            >
                                {coupon.isActive ? "有効" : "無効"}
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 font-bold">
                            <span>
                                割引：
                                {coupon.discountType === "PERCENT"
                                    ? `${coupon.discountValue}%OFF`
                                    : `¥${coupon.discountValue.toLocaleString()}OFF`}
                            </span>
                            {coupon.minAmount > 0 && (
                                <span>最低金額：¥{coupon.minAmount.toLocaleString()}</span>
                            )}
                            <span>
                                使用回数：{coupon.usedCount}
                                {coupon.maxUses !== null ? ` / ${coupon.maxUses}` : " / ∞"}
                            </span>
                            {coupon.expiresAt && (
                                <span>
                                    期限：{new Date(coupon.expiresAt).toLocaleDateString("ja-JP")}
                                </span>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={() => toggleActive(coupon.id, coupon.isActive)}
                        disabled={loading === coupon.id}
                        className={`px-5 py-2 rounded-full text-sm font-bold border transition-colors disabled:opacity-40 ${
                            coupon.isActive
                                ? "border-red-200 text-red-500 hover:bg-red-50"
                                : "border-green-200 text-green-600 hover:bg-green-50"
                        }`}
                    >
                        {loading === coupon.id ? "..." : coupon.isActive ? "無効にする" : "有効にする"}
                    </button>
                </div>
            ))}
        </div>
    );
}
