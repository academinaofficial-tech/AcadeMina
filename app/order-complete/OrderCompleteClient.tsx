"use client";

import { Exam } from "@prisma/client";
import Link from "next/link";
import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import { useSearchParams } from "next/navigation";

interface OrderCompleteClientProps {
    allExams: Exam[];
}

export default function OrderCompleteClient({ allExams }: OrderCompleteClientProps) {
    const [order, setOrder] = useState<{ orderId: string; items: string[] } | null>(null);
    const [mounted, setMounted] = useState(false);
    const [verifying, setVerifying] = useState(false);

    const searchParams = useSearchParams();

    useEffect(() => {
        setMounted(true);
        const savedOrder = JSON.parse(localStorage.getItem("am_order") || "null");
        setOrder(savedOrder);

        const verifyPayment = async () => {
            const sessionId = searchParams.get("session_id");

            if (sessionId) {
                setVerifying(true);
                try {
                    await fetch("/api/purchase/verify", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ session_id: sessionId }),
                    });
                } catch (error) {
                    console.error("Verification failed:", error);
                } finally {
                    setVerifying(false);
                }
            }
        };

        verifyPayment();
    }, []);

    if (!mounted) return null;

    if (!order) {
        return (
            <div className="max-w-[700px] mx-auto py-24 px-5 text-center">
                <div className="text-6xl mb-8">🤔</div>
                <h1 className="text-2xl font-bold text-gray-400 mb-10">注文情報が見つかりませんでした。</h1>
                <Button href="/exam-store" variant="solid">
                    教材ストアへ戻る
                </Button>
            </div>
        );
    }

    const purchasedItems = order.items
        .map(id => allExams.find(e => e.id === id))
        .filter((e): e is Exam => !!e);

    const recommendations = allExams
        .filter(e => !order.items.includes(e.id))
        .slice(0, 3);

    return (
        <div className="max-w-[800px] mx-auto py-12 px-5">
            {/* Success Card */}
            <div className="bg-white rounded-[40px] p-10 md:p-16 text-center border border-gray-100 shadow-2xl shadow-blue-500/5 mb-16">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent to-blue-400 flex items-center justify-center mx-auto mb-10 text-4xl text-white shadow-lg shadow-accent/20 animate-bounce">
                    ✓
                </div>

                <h1 className="text-3xl md:text-4xl font-black mb-4">ご購入ありがとうございます！</h1>
                <p className="text-lg text-gray-500 mb-12 leading-relaxed">
                    決済が正常に完了しました。<br />
                    教材のダウンロードが可能です。
                </p>

                <div className="inline-flex items-center gap-2 bg-gray-50 px-6 py-3 rounded-2xl text-sm font-bold border border-gray-100 mb-12">
                    <span className="text-gray-400 uppercase tracking-widest">Order ID:</span>
                    <span className="text-accent italic font-black text-lg">{order.orderId}</span>
                </div>

                <div className="bg-blue-50/50 border-2 border-blue-100 rounded-[32px] p-8 md:p-10 text-left mb-12">
                    <h2 className="text-xl font-black mb-6 flex items-center gap-3">
                        <span className="w-2 h-6 bg-accent rounded-full"></span>
                        購入した教材
                    </h2>
                    <div className="space-y-4">
                        {purchasedItems.map(item => (
                            <div key={item.id} className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-blue-100 shadow-sm">
                                <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center text-white text-xl shrink-0">
                                    📄
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-bold leading-tight mb-1">{item.title}</div>
                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">PDF Content</div>
                                </div>
                                <button
                                    onClick={() => alert("デモ：ファイルをダウンロードします")}
                                    className="px-6 py-2.5 bg-accent text-white rounded-full text-xs font-bold hover:brightness-110 transition-all shadow-md active:scale-95"
                                >
                                    Download
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 justify-center">
                    <Button href="/mypage" variant="solid">
                        マイページで確認する
                    </Button>
                    <Button href="/exam-store" variant="outline">
                        教材ストアに戻る
                    </Button>
                </div>
            </div>

            {/* Cross-sell */}
            {recommendations.length > 0 && (
                <div>
                    <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                        こちらもおすすめ
                        <span className="text-[10px] font-bold text-gray-300 bg-gray-100 px-2 py-1 rounded">Recommended</span>
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recommendations.map(rec => (
                            <Link
                                key={rec.id}
                                href={`/exam/product/${rec.id}`}
                                className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all group"
                            >
                                <div className="h-32 bg-gray-100 bg-cover bg-center" style={{ backgroundImage: `url(${rec.image})` }}></div>
                                <div className="p-4">
                                    <div className="text-[10px] font-bold text-accent mb-2 uppercase tracking-widest">{rec.category}</div>
                                    <div className="text-sm font-bold line-clamp-2 h-10 group-hover:text-accent transition-colors leading-tight mb-4">
                                        {rec.title}
                                    </div>
                                    <div className="text-lg font-black italic">¥{rec.price.toLocaleString()}</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
