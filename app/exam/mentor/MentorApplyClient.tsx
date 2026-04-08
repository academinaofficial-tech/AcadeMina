"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// 選択できる時間帯
const TIME_SLOTS = [
    "09:00-10:00", "10:00-11:00", "11:00-12:00",
    "12:00-13:00", "13:00-14:00", "14:00-15:00",
    "15:00-16:00", "16:00-17:00", "17:00-18:00",
    "18:00-19:00", "19:00-20:00", "20:00-21:00",
];

type PreferredSlot = { date: string; slots: string[] };

const CONSULTATION_PLANS = [
    { duration: 30, price: 1980, label: "30分" },
    { duration: 60, price: 2980, label: "60分" },
] as const;

function ApplyForm({
    type,
    price,
    onBack,
}: {
    type: "CONSULTATION" | "REVIEW";
    price: number;
    onBack: () => void;
}) {
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();

    const [message, setMessage] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [preferredSlots, setPreferredSlots] = useState<PreferredSlot[]>([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // カレンダー：日付追加
    const addDate = () => {
        if (!selectedDate) return;
        if (preferredSlots.find((s) => s.date === selectedDate)) return;
        setPreferredSlots([...preferredSlots, { date: selectedDate, slots: [] }]);
        setSelectedDate("");
    };

    const removeDate = (date: string) => {
        setPreferredSlots(preferredSlots.filter((s) => s.date !== date));
    };

    const toggleSlot = (date: string, slot: string) => {
        setPreferredSlots(
            preferredSlots.map((s) =>
                s.date === date
                    ? {
                        ...s,
                        slots: s.slots.includes(slot)
                            ? s.slots.filter((t) => t !== slot)
                            : [...s.slots, slot],
                    }
                    : s
            )
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;
        setLoading(true);
        setError("");

        try {
            // 1. SetupIntentを取得
            const siRes = await fetch("/api/mentor/setup-intent", { method: "POST" });
            const siData = await siRes.json();
            if (!siRes.ok) throw new Error(siData.error);

            // 2. カードを保存
            const cardElement = elements.getElement(CardElement);
            if (!cardElement) throw new Error("カード情報が入力されていません");

            const { setupIntent, error: stripeError } = await stripe.confirmCardSetup(
                siData.clientSecret,
                { payment_method: { card: cardElement } }
            );
            if (stripeError) throw new Error(stripeError.message);
            if (!setupIntent?.payment_method) throw new Error("カードの保存に失敗しました");

            // 3. ファイルアップロード（添削の場合）
            let documentUrl: string | undefined;
            if (type === "REVIEW" && file) {
                // 申込レコードを先に作成してからアップロード
                const applyRes = await fetch("/api/mentor/apply", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        type,
                        message,
                        paymentMethodId: setupIntent.payment_method,
                    }),
                });
                const applyData = await applyRes.json();
                if (!applyRes.ok) throw new Error(applyData.error);

                const formData = new FormData();
                formData.append("file", file);
                formData.append("requestId", applyData.id);
                formData.append("role", "student");

                const uploadRes = await fetch("/api/mentor/upload", {
                    method: "POST",
                    body: formData,
                });
                if (!uploadRes.ok) throw new Error("ファイルのアップロードに失敗しました");

                router.push("/mypage/mentor?applied=true");
                return;
            }

            // 4. 申込送信（面談の場合）
            const applyRes = await fetch("/api/mentor/apply", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type,
                    price,
                    preferredSlots: type === "CONSULTATION" ? preferredSlots : undefined,
                    message,
                    paymentMethodId: setupIntent.payment_method,
                }),
            });
            const applyData = await applyRes.json();
            if (!applyRes.ok) throw new Error(applyData.error);

            router.push("/mypage/mentor?applied=true");
        } catch (err: any) {
            setError(err.message || "エラーが発生しました");
        } finally {
            setLoading(false);
        }
    };

    // 今日以降の日付のみ選択可能
    const today = new Date().toISOString().split("T")[0];

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* カード情報 */}
            <div>
                <label className="block text-sm font-bold mb-3">クレジットカード情報</label>
                <div className="border rounded-lg p-4 bg-white">
                    <CardElement
                        options={{
                            style: {
                                base: { fontSize: "16px", color: "#1a1a1a", "::placeholder": { color: "#aaa" } },
                            },
                        }}
                    />
                </div>
                <p className="text-xs text-gray-400 mt-2">
                    カード情報は安全に保存され、サービス完了後に自動で引き落とされます。
                </p>
            </div>

            {/* 希望日時（面談のみ） */}
            {type === "CONSULTATION" && (
                <div>
                    <label className="block text-sm font-bold mb-3">
                        希望日時 <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2 mb-4">
                        <input
                            type="date"
                            min={today}
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="border rounded-lg p-2 flex-1"
                        />
                        <button
                            type="button"
                            onClick={addDate}
                            disabled={!selectedDate}
                            className="px-4 py-2 bg-text text-white rounded-lg font-bold disabled:opacity-40"
                        >
                            追加
                        </button>
                    </div>

                    {preferredSlots.length === 0 && (
                        <p className="text-sm text-gray-400">希望日を追加してください（複数選択可）</p>
                    )}

                    <div className="space-y-4">
                        {preferredSlots.map((slot) => (
                            <div key={slot.date} className="bg-white border rounded-xl p-4">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="font-bold">{slot.date}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeDate(slot.date)}
                                        className="text-gray-400 hover:text-red-500 text-sm"
                                    >
                                        削除
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {TIME_SLOTS.map((time) => (
                                        <button
                                            key={time}
                                            type="button"
                                            onClick={() => toggleSlot(slot.date, time)}
                                            className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
                                                slot.slots.includes(time)
                                                    ? "bg-text text-white border-text"
                                                    : "bg-white text-gray-600 border-gray-200 hover:border-text"
                                            }`}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                                {slot.slots.length === 0 && (
                                    <p className="text-xs text-gray-400 mt-2">時間帯を選択してください</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 書類アップロード（添削のみ） */}
            {type === "REVIEW" && (
                <div>
                    <label className="block text-sm font-bold mb-3">
                        研究計画書ファイル <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-text file:text-white hover:file:bg-accent cursor-pointer"
                    />
                    <p className="text-xs text-gray-400 mt-2">PDF・Word形式に対応しています</p>
                    {file && <p className="text-sm text-green-600 mt-1">✓ {file.name}</p>}
                </div>
            )}

            {/* メッセージ */}
            <div>
                <label className="block text-sm font-bold mb-3">
                    メッセージ・ご要望（任意）
                </label>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    placeholder={
                        type === "CONSULTATION"
                            ? "相談したい内容、受験予定の大学院など"
                            : "添削してほしいポイント、志望大学院など"
                    }
                    className="w-full border rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent"
                />
            </div>

            {error && (
                <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
                    {error}
                </p>
            )}

            <button
                type="submit"
                disabled={loading || !stripe}
                className="w-full py-4 bg-text text-white rounded-full font-bold text-lg hover:bg-accent transition-colors disabled:opacity-50"
            >
                {loading ? "送信中..." : `申し込む（¥${price.toLocaleString()}）`}
            </button>

            <button type="button" onClick={onBack} className="w-full text-sm text-gray-400 hover:text-gray-600">
                ← サービス選択に戻る
            </button>
        </form>
    );
}

export default function MentorApplyClient({
    reviewPrice,
}: {
    reviewPrice: number;
}) {
    const [step, setStep] = useState<"select" | "form">("select");
    const [selectedType, setSelectedType] = useState<"CONSULTATION" | "REVIEW" | null>(null);
    const [selectedPrice, setSelectedPrice] = useState<number>(0);

    const selectConsultation = (price: number) => {
        setSelectedType("CONSULTATION");
        setSelectedPrice(price);
        setStep("form");
    };

    const selectReview = () => {
        setSelectedType("REVIEW");
        setSelectedPrice(reviewPrice);
        setStep("form");
    };

    return (
        <div className="max-w-[860px] mx-auto px-5 py-16">
            <div className="text-center mb-12">
                <div className="text-[0.85rem] font-bold text-accent tracking-widest uppercase mb-3">
                    Mentoring Service
                </div>
                <h1 className="text-[2rem] md:text-[2.5rem] font-extrabold mb-4">
                    面談・研究計画書添削
                </h1>
                {/* 東大・東京科学大の強調 */}
                <div className="inline-flex items-center gap-2 bg-black text-white text-sm font-bold px-5 py-2 rounded-full mb-4">
                    東京大学・東京科学大学の現役学生によるサポート
                </div>
                <p className="text-gray-500 leading-relaxed mt-3">
                    サービス完了後にお支払いいただく後払い制です。<br />
                    運営側のキャンセルがあった場合、費用は一切発生しません。
                </p>
            </div>

            {step === "select" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 面談カード（30分・60分） */}
                    <div className="bg-white border rounded-2xl p-8 shadow-sm flex flex-col">
                        <div className="text-3xl mb-4">💬</div>
                        <div className="text-xs font-bold text-accent uppercase tracking-widest mb-2">
                            Consultation
                        </div>
                        <h2 className="text-xl font-extrabold mb-3">面談相談</h2>
                        <p className="text-sm text-gray-500 leading-relaxed mb-6">
                            大学院受験に関する疑問や不安をオンラインで相談。
                            研究室選び・面接対策・勉強スケジュールなど幅広く対応します。
                        </p>
                        <div className="mt-auto space-y-3">
                            {CONSULTATION_PLANS.map((plan) => (
                                <button
                                    key={plan.duration}
                                    onClick={() => selectConsultation(plan.price)}
                                    className="w-full flex items-center justify-between border-2 border-transparent hover:border-accent rounded-xl px-5 py-3 bg-gray-50 hover:bg-white transition-all group"
                                >
                                    <span className="font-bold text-sm">{plan.label}</span>
                                    <span className="flex items-center gap-2">
                                        <span className="text-xl font-extrabold">¥{plan.price.toLocaleString()}</span>
                                        <span className="text-xs text-accent font-bold group-hover:translate-x-1 transition-transform">→</span>
                                    </span>
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-gray-400 mt-3">面談完了後にお支払い</p>
                    </div>

                    {/* 添削カード */}
                    <button
                        onClick={selectReview}
                        className="text-left bg-white border-2 border-transparent hover:border-accent rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all group flex flex-col"
                    >
                        <div className="text-3xl mb-4">📝</div>
                        <div className="text-xs font-bold text-accent uppercase tracking-widest mb-2">
                            Review
                        </div>
                        <h2 className="text-xl font-extrabold mb-3">研究計画書添削</h2>
                        <p className="text-sm text-gray-500 leading-relaxed mb-6">
                            研究計画書をご提出いただき、3日以内に添削してお返しします。
                            志望大学院に合わせた的確なフィードバックをお届けします。
                        </p>
                        <div className="mt-auto flex items-center justify-between">
                            <span className="text-2xl font-extrabold">
                                ¥{reviewPrice.toLocaleString()}
                            </span>
                            <span className="text-sm text-accent font-bold group-hover:translate-x-1 transition-transform">
                                申し込む →
                            </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">添削書類の提出後にお支払い</p>
                    </button>
                </div>
            )}

            {step === "form" && selectedType && (
                <div className="bg-white rounded-2xl shadow-sm p-8">
                    <div className="mb-8">
                        <div className="text-xs font-bold text-accent uppercase tracking-widest mb-1">
                            {selectedType === "CONSULTATION" ? "Consultation / 面談相談" : "Review / 研究計画書添削"}
                        </div>
                        <h2 className="text-xl font-extrabold">申込フォーム</h2>
                    </div>

                    <Elements stripe={stripePromise}>
                        <ApplyForm
                            type={selectedType}
                            price={selectedPrice}
                            onBack={() => setStep("select")}
                        />
                    </Elements>
                </div>
            )}
        </div>
    );
}
