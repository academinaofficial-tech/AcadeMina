"use client";

import { useSearchParams } from "next/navigation";
import { MentorRequest } from "@prisma/client";
import Link from "next/link";

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
    PENDING: { label: "申込済み・確認中", color: "bg-yellow-100 text-yellow-700" },
    IN_PROGRESS: { label: "対応中", color: "bg-blue-100 text-blue-700" },
    DELIVERED: { label: "完了・お支払い済み", color: "bg-green-100 text-green-700" },
    PAID: { label: "完了・お支払い済み", color: "bg-green-100 text-green-700" },
    CANCELLED: { label: "キャンセル", color: "bg-gray-100 text-gray-500" },
};

export default function MentorHistoryClient({ requests }: { requests: MentorRequest[] }) {
    const searchParams = useSearchParams();
    const applied = searchParams.get("applied");

    return (
        <>
            {applied && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8 text-green-700 font-bold">
                    ✓ 申込を受け付けました。運営より確認のご連絡をお送りします。
                </div>
            )}

            {requests.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                    <p className="mb-4">申込履歴がありません</p>
                    <Link
                        href="/exam/mentor"
                        className="inline-block px-6 py-3 bg-text text-white rounded-full font-bold text-sm hover:bg-accent transition-colors"
                    >
                        サービスを申し込む
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {requests.map((req) => {
                        const status = STATUS_LABEL[req.status] ?? { label: req.status, color: "bg-gray-100 text-gray-500" };
                        const preferredSlots = req.preferredSlots as { date: string; slots: string[] }[] | null;

                        return (
                            <div key={req.id} className="bg-white border rounded-xl p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className="text-xs font-bold text-accent uppercase tracking-widest">
                                            {req.type === "CONSULTATION" ? "面談相談" : "研究計画書添削"}
                                        </span>
                                        <p className="text-xs text-gray-400 mt-1">
                                            申込日：{new Date(req.createdAt).toLocaleDateString("ja-JP")}
                                        </p>
                                    </div>
                                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${status.color}`}>
                                        {status.label}
                                    </span>
                                </div>

                                {req.type === "CONSULTATION" && preferredSlots && preferredSlots.length > 0 && (
                                    <div className="mb-4">
                                        <p className="text-xs font-bold text-gray-500 mb-2">希望日時</p>
                                        <div className="space-y-1">
                                            {preferredSlots.map((s) => (
                                                <div key={s.date} className="text-sm">
                                                    <span className="font-medium">{s.date}</span>
                                                    <span className="text-gray-500 ml-2">{s.slots.join(", ")}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {req.message && (
                                    <p className="text-sm text-gray-600 mb-4 bg-gray-50 rounded-lg p-3">
                                        {req.message}
                                    </p>
                                )}

                                {/* 添削済み書類のダウンロード */}
                                {req.reviewedDocUrl && (
                                    <a
                                        href={req.reviewedDocUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-sm font-bold text-accent hover:underline mb-4"
                                    >
                                        📄 添削済み書類をダウンロード
                                    </a>
                                )}

                                <div className="flex justify-between items-center pt-4 border-t">
                                    <span className="text-lg font-extrabold">
                                        ¥{req.price.toLocaleString()}
                                    </span>
                                    {req.paidAt && (
                                        <span className="text-xs text-gray-400">
                                            支払日：{new Date(req.paidAt).toLocaleDateString("ja-JP")}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </>
    );
}
