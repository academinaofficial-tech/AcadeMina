"use client";

import { Exam } from "@prisma/client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import DownloadPdfButton from "@/app/mypage/DownloadPdfButton";

interface ProductDetailClientProps {
    exam: Exam;
    hasPurchased?: boolean;
    isAdmin?: boolean;
}

export default function ProductDetailClient({ exam, hasPurchased = false, isAdmin = false }: ProductDetailClientProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const buyNow = async () => {
        if (loading) return;
        setLoading(true);

        try {
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ examId: exam.id }),
            });

            const data = await response.json();

            if (data.url) {
                window.location.href = data.url;
            } else if (response.status === 401) {
                // 未ログインの場合はログインページへ
                window.location.href = `/account/login?redirect_url=/exam/product/${exam.id}`;
            } else {
                alert("エラーが発生しました。時間を置いて再度お試しください。");
                setLoading(false);
            }
        } catch (error) {
            console.error("Checkout error:", error);
            alert("通信エラーが発生しました。");
            setLoading(false);
        }
    };

    return (
        <div className="bg-white min-h-screen">
            {/* Breadcrumb */}
            <div className="py-4 px-5 md:px-10 text-xs text-gray-400 bg-gray-50 border-b">
                <div className="max-w-[1100px] mx-auto flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <Link href="/" className="hover:text-accent">TOP</Link>
                        <span>&gt;</span>
                        <Link href="/exam-store" className="hover:text-accent">教材ストア</Link>
                        <span>&gt;</span>
                        <span className="text-gray-600 font-medium truncate">{exam.title}</span>
                    </div>
                    {isAdmin && (
                        <Link
                            href={`/admin/exams/${exam.id}/edit`}
                            className="text-xs font-bold px-3 py-1.5 border border-gray-300 rounded-full hover:border-accent hover:text-accent transition-colors"
                        >
                            編集
                        </Link>
                    )}
                </div>
            </div>

            <div className="max-w-[1100px] mx-auto py-12 px-5 flex flex-col md:flex-row gap-12 items-start">
                {/* Main Content */}
                <div className="flex-1">
                    <div className="w-full aspect-video rounded-3xl overflow-hidden bg-gray-100 mb-10 shadow-sm">
                        <img src={exam.image || "/placeholder.png"} alt={exam.title} className="w-full h-full object-cover" />
                    </div>

                    <div className="mb-10">
                        <div className="text-sm font-bold text-accent uppercase tracking-widest mb-3">
                            {exam.category}
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-6">
                            {exam.title}
                        </h1>
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
                                    (exam.contents as string[]).map((item: string, idx: number) => (
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
                    </div>
                </div>

                {/* Pricing / CTA Panel */}
                <aside className="w-full md:w-[350px] shrink-0 md:sticky md:top-[160px]">
                    <div className="bg-white border-2 border-gray-100 rounded-3xl p-8 shadow-xl">
                        <div className="mb-8">
                            <div className="text-3xl font-black text-text mb-1">
                                ¥{exam.price.toLocaleString()}
                            </div>
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">税込料金</div>
                        </div>

                        {hasPurchased ? (
                            <div className="space-y-4">
                                <div className="bg-green-50 text-green-700 font-bold px-4 py-3 rounded-xl text-center text-sm border border-green-200">
                                    ✓ 購入済みです
                                </div>
                                <DownloadPdfButton examId={exam.id} hasPdfKey={!!(exam as any).pdfKey} />
                            </div>
                        ) : (
                            <button
                                onClick={buyNow}
                                disabled={loading}
                                className="w-full py-5 bg-accent text-white rounded-full font-bold text-lg shadow-lg shadow-accent/20 transition-all hover:scale-[1.02] hover:brightness-110 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? "処理中..." : "今すぐ購入"}
                            </button>
                        )}

                        {!hasPurchased && (
                            <p className="text-center text-xs text-gray-400 mt-4">
                                ログインしていない場合はログイン画面へ移動します
                            </p>
                        )}
                    </div>

                    <div className="mt-8 p-6 bg-gray-50 rounded-2xl border border-gray-200">
                        <h4 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                            <span>⚠️</span> 免責事項
                        </h4>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            本教材の内容の正確性については万全を期しておりますが、誤りが含まれている場合でも当方は一切の責任を負いかねます。あらかじめご了承の上、ご購入をお願いいたします。
                        </p>
                    </div>
                </aside>
            </div>
        </div>
    );
}
