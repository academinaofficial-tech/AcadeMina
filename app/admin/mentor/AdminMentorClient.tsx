"use client";

import { useState } from "react";

type Request = {
    id: string;
    type: "CONSULTATION" | "REVIEW";
    status: string;
    price: number;
    message: string | null;
    adminNote: string | null;
    documentUrl: string | null;
    reviewedDocUrl: string | null;
    preferredSlots: { date: string; slots: string[] }[] | null;
    paidAt: string | null;
    createdAt: string;
    profile: { firstName: string; lastName: string; email: string };
};

const STATUS_LABEL: Record<string, string> = {
    PENDING: "申込済み",
    IN_PROGRESS: "対応中",
    DELIVERED: "完了済み",
    PAID: "支払済み",
    CANCELLED: "キャンセル",
};

export default function AdminMentorClient({
    requests: initialRequests,
    consultationPrice: initConsultationPrice,
    reviewPrice: initReviewPrice,
}: {
    requests: Request[];
    consultationPrice: number;
    reviewPrice: number;
}) {
    const [requests, setRequests] = useState(initialRequests);
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [consultationPrice, setConsultationPrice] = useState(initConsultationPrice);
    const [reviewPrice, setReviewPrice] = useState(initReviewPrice);
    const [savingPrice, setSavingPrice] = useState(false);
    const [filter, setFilter] = useState<string>("ALL");

    // ステータス更新（対応中にする）
    const markInProgress = async (id: string) => {
        setLoadingId(id);
        await fetch(`/api/mentor/status`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ requestId: id, status: "IN_PROGRESS" }),
        });
        setRequests(requests.map((r) => r.id === id ? { ...r, status: "IN_PROGRESS" } : r));
        setLoadingId(null);
    };

    // 完了＋引き落とし
    const complete = async (id: string, adminNote: string) => {
        setLoadingId(id);
        const res = await fetch("/api/mentor/complete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ requestId: id, adminNote }),
        });
        if (res.ok) {
            setRequests(requests.map((r) =>
                r.id === id ? { ...r, status: "DELIVERED", adminNote, paidAt: new Date().toISOString() } : r
            ));
        } else {
            const data = await res.json();
            alert(`エラー: ${data.error}`);
        }
        setLoadingId(null);
    };

    // 添削済みファイルアップロード
    const uploadReviewed = async (id: string, file: File) => {
        setLoadingId(id);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("requestId", id);
        formData.append("role", "admin");

        const res = await fetch("/api/mentor/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (res.ok) {
            setRequests(requests.map((r) => r.id === id ? { ...r, reviewedDocUrl: data.url } : r));
            // 添削済みアップロード後に自動で完了＋引き落とし
            await complete(id, "添削済み書類を提出しました");
        } else {
            alert(`アップロードエラー: ${data.error}`);
            setLoadingId(null);
        }
    };

    // 料金更新
    const savePrice = async (type: "CONSULTATION" | "REVIEW", price: number) => {
        setSavingPrice(true);
        await fetch("/api/mentor/price", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type, price }),
        });
        setSavingPrice(false);
    };

    const filtered = filter === "ALL" ? requests : requests.filter((r) => r.status === filter);

    return (
        <div className="space-y-10">
            {/* 料金設定 */}
            <section className="bg-white rounded-xl border p-6">
                <h2 className="text-lg font-bold mb-4">サービス料金設定</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold mb-2">面談料金（円）</label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                value={consultationPrice}
                                onChange={(e) => setConsultationPrice(Number(e.target.value))}
                                className="flex-1 border rounded-lg p-2"
                            />
                            <button
                                onClick={() => savePrice("CONSULTATION", consultationPrice)}
                                disabled={savingPrice}
                                className="px-4 py-2 bg-text text-white rounded-lg font-bold text-sm disabled:opacity-50"
                            >
                                保存
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2">添削料金（円）</label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                value={reviewPrice}
                                onChange={(e) => setReviewPrice(Number(e.target.value))}
                                className="flex-1 border rounded-lg p-2"
                            />
                            <button
                                onClick={() => savePrice("REVIEW", reviewPrice)}
                                disabled={savingPrice}
                                className="px-4 py-2 bg-text text-white rounded-lg font-bold text-sm disabled:opacity-50"
                            >
                                保存
                            </button>
                        </div>
                    </div>
                </div>
                <p className="text-xs text-gray-400 mt-3">※ 料金変更は新規申込から適用されます。既存の申込には影響しません。</p>
            </section>

            {/* 申込一覧 */}
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">申込一覧（{filtered.length}件）</h2>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="border rounded-lg p-2 text-sm"
                    >
                        <option value="ALL">すべて</option>
                        <option value="PENDING">申込済み</option>
                        <option value="IN_PROGRESS">対応中</option>
                        <option value="DELIVERED">完了済み</option>
                        <option value="CANCELLED">キャンセル</option>
                    </select>
                </div>

                <div className="space-y-4">
                    {filtered.map((req) => (
                        <RequestCard
                            key={req.id}
                            req={req}
                            loading={loadingId === req.id}
                            onMarkInProgress={() => markInProgress(req.id)}
                            onComplete={(note) => complete(req.id, note)}
                            onUploadReviewed={(file) => uploadReviewed(req.id, file)}
                        />
                    ))}
                    {filtered.length === 0 && (
                        <p className="text-center py-16 text-gray-400">該当する申込はありません</p>
                    )}
                </div>
            </section>
        </div>
    );
}

function RequestCard({
    req,
    loading,
    onMarkInProgress,
    onComplete,
    onUploadReviewed,
}: {
    req: Request;
    loading: boolean;
    onMarkInProgress: () => void;
    onComplete: (note: string) => void;
    onUploadReviewed: (file: File) => void;
}) {
    const [adminNote, setAdminNote] = useState(req.adminNote ?? "");
    const [showNote, setShowNote] = useState(false);

    return (
        <div className="bg-white border rounded-xl p-6">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <span className="text-xs font-bold text-accent uppercase tracking-widest">
                            {req.type === "CONSULTATION" ? "面談相談" : "研究計画書添削"}
                        </span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            req.status === "PENDING" ? "bg-yellow-100 text-yellow-700" :
                            req.status === "IN_PROGRESS" ? "bg-blue-100 text-blue-700" :
                            req.status === "DELIVERED" || req.status === "PAID" ? "bg-green-100 text-green-700" :
                            "bg-gray-100 text-gray-500"
                        }`}>
                            {STATUS_LABEL[req.status]}
                        </span>
                    </div>
                    <p className="font-bold">{req.profile.lastName} {req.profile.firstName}</p>
                    <p className="text-sm text-gray-400">{req.profile.email}</p>
                </div>
                <div className="text-right">
                    <p className="text-lg font-extrabold">¥{req.price.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">
                        {new Date(req.createdAt).toLocaleDateString("ja-JP")}
                    </p>
                </div>
            </div>

            {/* 希望日時 */}
            {req.type === "CONSULTATION" && req.preferredSlots && req.preferredSlots.length > 0 && (
                <div className="mb-4 bg-gray-50 rounded-lg p-3">
                    <p className="text-xs font-bold text-gray-500 mb-2">希望日時</p>
                    {req.preferredSlots.map((s) => (
                        <div key={s.date} className="text-sm">
                            <span className="font-medium">{s.date}</span>
                            <span className="text-gray-500 ml-2">{s.slots.join(", ")}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* メッセージ */}
            {req.message && (
                <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 mb-4">{req.message}</p>
            )}

            {/* 提出書類 */}
            {req.documentUrl && (
                <a
                    href={req.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-bold text-accent hover:underline mb-4 block"
                >
                    📄 提出書類を確認
                </a>
            )}

            {/* 添削済み書類 */}
            {req.reviewedDocUrl && (
                <p className="text-sm text-green-600 mb-4">✓ 添削済み書類アップロード済み</p>
            )}

            {/* アクションボタン */}
            {req.status === "PENDING" && (
                <button
                    onClick={onMarkInProgress}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? "処理中..." : "対応開始"}
                </button>
            )}

            {req.status === "IN_PROGRESS" && (
                <div className="space-y-3">
                    {req.type === "CONSULTATION" ? (
                        <>
                            <button
                                onClick={() => setShowNote(!showNote)}
                                className="text-sm text-gray-500 hover:text-gray-700 underline"
                            >
                                {showNote ? "メモを閉じる" : "メモを追加"}
                            </button>
                            {showNote && (
                                <textarea
                                    value={adminNote}
                                    onChange={(e) => setAdminNote(e.target.value)}
                                    placeholder="面談メモ（任意）"
                                    rows={3}
                                    className="w-full border rounded-lg p-2 text-sm resize-none"
                                />
                            )}
                            <button
                                onClick={() => onComplete(adminNote)}
                                disabled={loading}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold text-sm hover:bg-green-700 disabled:opacity-50"
                            >
                                {loading ? "処理中..." : "面談完了 → 引き落とし実行"}
                            </button>
                        </>
                    ) : (
                        <div>
                            <label className="block text-sm font-bold mb-2">添削済み書類をアップロード</label>
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                disabled={loading}
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) onUploadReviewed(file);
                                }}
                                className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-green-600 file:text-white hover:file:bg-green-700 cursor-pointer disabled:opacity-50"
                            />
                            <p className="text-xs text-gray-400 mt-1">アップロードと同時に引き落としが実行されます</p>
                        </div>
                    )}
                </div>
            )}

            {(req.status === "DELIVERED" || req.status === "PAID") && req.paidAt && (
                <p className="text-sm text-green-600 font-bold">
                    ✓ 支払い完了：{new Date(req.paidAt).toLocaleDateString("ja-JP")}
                </p>
            )}
        </div>
    );
}
