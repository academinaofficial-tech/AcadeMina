"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const TIME_SLOTS = [
    "09:00-10:00", "10:00-11:00", "11:00-12:00",
    "12:00-13:00", "13:00-14:00", "14:00-15:00",
    "15:00-16:00", "16:00-17:00", "17:00-18:00",
    "18:00-19:00", "19:00-20:00", "20:00-21:00",
];

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

type PreferredSlot = { date: string; slots: string[] };

const CONSULTATION_PLANS = [
    { duration: 30, price: 1980, label: "30分" },
    { duration: 60, price: 2980, label: "60分" },
] as const;

function formatDateJp(dateStr: string) {
    const d = new Date(dateStr + "T00:00:00");
    return `${d.getMonth() + 1}月${d.getDate()}日（${WEEKDAYS[d.getDay()]}）`;
}

function CalendarPicker({
    preferredSlots,
    setPreferredSlots,
}: {
    preferredSlots: PreferredSlot[];
    setPreferredSlots: (slots: PreferredSlot[]) => void;
}) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [calYear, setCalYear] = useState(today.getFullYear());
    const [calMonth, setCalMonth] = useState(today.getMonth()); // 0-indexed
    const [activeDate, setActiveDate] = useState<string | null>(null);

    const toDateStr = (y: number, m: number, d: number) =>
        `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

    const isSelected = (dateStr: string) => preferredSlots.some((s) => s.date === dateStr);
    const isPast = (y: number, m: number, d: number) =>
        new Date(y, m, d) < today;

    const prevMonth = () => {
        if (calMonth === 0) { setCalYear(calYear - 1); setCalMonth(11); }
        else setCalMonth(calMonth - 1);
    };
    const nextMonth = () => {
        if (calMonth === 11) { setCalYear(calYear + 1); setCalMonth(0); }
        else setCalMonth(calMonth + 1);
    };

    // Can't go before current month
    const canGoPrev = calYear > today.getFullYear() || calMonth > today.getMonth();

    const firstDay = new Date(calYear, calMonth, 1).getDay(); // 0=Sun
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

    const toggleDate = (dateStr: string) => {
        if (isSelected(dateStr)) {
            // deselect
            setPreferredSlots(preferredSlots.filter((s) => s.date !== dateStr));
            if (activeDate === dateStr) setActiveDate(null);
        } else {
            // select
            const newSlots = [...preferredSlots, { date: dateStr, slots: [] }]
                .sort((a, b) => a.date.localeCompare(b.date));
            setPreferredSlots(newSlots);
            setActiveDate(dateStr);
        }
    };

    const toggleTimeSlot = (slot: string) => {
        if (!activeDate) return;
        setPreferredSlots(
            preferredSlots.map((s) =>
                s.date === activeDate
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

    const activeSlotData = preferredSlots.find((s) => s.date === activeDate);

    // Build calendar grid cells
    const cells: Array<{ day: number | null; dateStr: string | null }> = [];
    for (let i = 0; i < firstDay; i++) cells.push({ day: null, dateStr: null });
    for (let d = 1; d <= daysInMonth; d++) {
        cells.push({ day: d, dateStr: toDateStr(calYear, calMonth, d) });
    }

    return (
        <div className="space-y-4">
            {/* Calendar */}
            <div className="bg-gray-50 border rounded-2xl p-5">
                {/* Month navigation */}
                <div className="flex items-center justify-between mb-4">
                    <button
                        type="button"
                        onClick={prevMonth}
                        disabled={!canGoPrev}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 disabled:opacity-30 transition-colors"
                    >
                        ‹
                    </button>
                    <span className="font-bold text-sm">
                        {calYear}年{calMonth + 1}月
                    </span>
                    <button
                        type="button"
                        onClick={nextMonth}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
                    >
                        ›
                    </button>
                </div>

                {/* Weekday headers */}
                <div className="grid grid-cols-7 mb-2">
                    {WEEKDAYS.map((w, i) => (
                        <div
                            key={w}
                            className={`text-center text-xs font-bold py-1 ${i === 0 ? "text-red-400" : i === 6 ? "text-blue-400" : "text-gray-400"}`}
                        >
                            {w}
                        </div>
                    ))}
                </div>

                {/* Day cells */}
                <div className="grid grid-cols-7 gap-1">
                    {cells.map((cell, idx) => {
                        if (!cell.day || !cell.dateStr) {
                            return <div key={idx} />;
                        }
                        const past = isPast(calYear, calMonth, cell.day);
                        const selected = isSelected(cell.dateStr);
                        const isActive = activeDate === cell.dateStr;
                        const isToday = cell.dateStr === toDateStr(today.getFullYear(), today.getMonth(), today.getDate());
                        const dow = (firstDay + cell.day - 1) % 7;

                        return (
                            <button
                                key={cell.dateStr}
                                type="button"
                                disabled={past}
                                onClick={() => {
                                    toggleDate(cell.dateStr!);
                                    if (!isSelected(cell.dateStr!)) setActiveDate(cell.dateStr);
                                }}
                                className={`
                                    relative aspect-square flex items-center justify-center rounded-xl text-sm font-medium transition-all
                                    ${past ? "opacity-25 cursor-not-allowed" : "cursor-pointer"}
                                    ${selected && isActive ? "bg-text text-white shadow-md scale-105" : ""}
                                    ${selected && !isActive ? "bg-text/20 text-text font-bold" : ""}
                                    ${!selected && !past ? "hover:bg-gray-200" : ""}
                                    ${isToday && !selected ? "ring-2 ring-text/40" : ""}
                                    ${dow === 0 && !selected ? "text-red-400" : ""}
                                    ${dow === 6 && !selected ? "text-blue-400" : ""}
                                `}
                            >
                                {cell.day}
                                {selected && (
                                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-current opacity-60" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Hint */}
            {preferredSlots.length === 0 && (
                <p className="text-sm text-gray-400 text-center">希望する日付をタップしてください（複数選択可）</p>
            )}

            {/* Selected dates as tabs */}
            {preferredSlots.length > 0 && (
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">選択した日付</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {preferredSlots.map((s) => (
                            <button
                                key={s.date}
                                type="button"
                                onClick={() => setActiveDate(s.date)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold transition-all border ${
                                    activeDate === s.date
                                        ? "bg-text text-white border-text"
                                        : "bg-white text-gray-700 border-gray-200 hover:border-text"
                                }`}
                            >
                                {formatDateJp(s.date)}
                                {s.slots.length > 0 && (
                                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${activeDate === s.date ? "bg-white/20" : "bg-accent/10 text-accent"}`}>
                                        {s.slots.length}
                                    </span>
                                )}
                                <span
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setPreferredSlots(preferredSlots.filter((x) => x.date !== s.date));
                                        if (activeDate === s.date) setActiveDate(null);
                                    }}
                                    className="ml-0.5 opacity-50 hover:opacity-100 text-xs"
                                >
                                    ×
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Time slots for active date */}
                    {activeDate && (
                        <div className="bg-white border rounded-xl p-4">
                            <p className="text-sm font-bold mb-3">
                                {formatDateJp(activeDate)} の希望時間帯
                                <span className="text-xs text-gray-400 font-normal ml-2">（複数選択可）</span>
                            </p>
                            <div className="grid grid-cols-3 gap-2">
                                {TIME_SLOTS.map((time) => {
                                    const chosen = activeSlotData?.slots.includes(time);
                                    return (
                                        <button
                                            key={time}
                                            type="button"
                                            onClick={() => toggleTimeSlot(time)}
                                            className={`text-xs px-2 py-2 rounded-lg border font-medium transition-all text-center ${
                                                chosen
                                                    ? "bg-text text-white border-text"
                                                    : "bg-gray-50 text-gray-600 border-gray-200 hover:border-text hover:bg-white"
                                            }`}
                                        >
                                            {time}
                                        </button>
                                    );
                                })}
                            </div>
                            {activeSlotData?.slots.length === 0 && (
                                <p className="text-xs text-gray-400 mt-3 text-center">時間帯を1つ以上選択してください</p>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

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
            if (type === "REVIEW" && file) {
                const applyRes = await fetch("/api/mentor/apply", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        type,
                        message,
                        paymentMethodId: setupIntent.payment_method,
                        stripeCustomerId: siData.customerId,
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
                    stripeCustomerId: siData.customerId,
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
                    <CalendarPicker
                        preferredSlots={preferredSlots}
                        setPreferredSlots={setPreferredSlots}
                    />
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
