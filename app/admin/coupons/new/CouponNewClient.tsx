"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CouponNewClient() {
    const router = useRouter();
    const [form, setForm] = useState({
        code: "",
        discountType: "PERCENT",
        discountValue: "",
        minAmount: "",
        maxUses: "1",
        expiresAt: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const res = await fetch("/api/admin/coupons", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...form,
                discountValue: Number(form.discountValue),
                minAmount: Number(form.minAmount || 0),
                maxUses: form.maxUses ? Number(form.maxUses) : null,
                expiresAt: form.expiresAt || null,
            }),
        });

        const data = await res.json();
        if (!res.ok) {
            setError(data.error || "エラーが発生しました");
            setLoading(false);
        } else {
            router.push("/admin/coupons");
        }
    };

    const field = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-accent";
    const label = "block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2";

    return (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-3xl p-8 space-y-6 shadow-sm">
            <div>
                <label className={label}>クーポンコード *</label>
                <input
                    className={field}
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    placeholder="例: SUMMER20"
                    required
                />
                <p className="mt-1 text-xs text-gray-400">英数字・大文字推奨</p>
            </div>

            <div>
                <label className={label}>割引タイプ *</label>
                <select
                    className={field}
                    value={form.discountType}
                    onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                >
                    <option value="PERCENT">パーセント割引（%OFF）</option>
                    <option value="FIXED">固定金額割引（円OFF）</option>
                </select>
            </div>

            <div>
                <label className={label}>
                    割引値 * {form.discountType === "PERCENT" ? "（%）" : "（円）"}
                </label>
                <input
                    type="number"
                    min={1}
                    max={form.discountType === "PERCENT" ? 100 : undefined}
                    className={field}
                    value={form.discountValue}
                    onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                    placeholder={form.discountType === "PERCENT" ? "例: 20" : "例: 500"}
                    required
                />
            </div>

            <div>
                <label className={label}>最低購入金額（円）</label>
                <input
                    type="number"
                    min={0}
                    className={field}
                    value={form.minAmount}
                    onChange={(e) => setForm({ ...form, minAmount: e.target.value })}
                    placeholder="例: 3000（未入力なら制限なし）"
                />
            </div>

            <div>
                <label className={label}>最大使用回数</label>
                <input
                    type="number"
                    min={1}
                    className={field}
                    value={form.maxUses}
                    onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
                    placeholder="例: 1（未入力なら無制限）"
                />
            </div>

            <div>
                <label className={label}>有効期限</label>
                <input
                    type="date"
                    className={field}
                    value={form.expiresAt}
                    onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                />
            </div>

            {error && <p className="text-red-500 text-sm font-bold">{error}</p>}

            <div className="flex gap-4 pt-2">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex-1 py-4 border border-gray-200 rounded-full font-bold text-sm text-gray-500 hover:border-gray-400 transition-colors"
                >
                    キャンセル
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-4 bg-accent text-white rounded-full font-bold text-sm hover:opacity-80 transition-opacity disabled:opacity-40"
                >
                    {loading ? "発行中..." : "発行する"}
                </button>
            </div>
        </form>
    );
}
