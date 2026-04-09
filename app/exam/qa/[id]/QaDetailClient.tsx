"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Profile = { firstName: string; lastName: string };
type Answer = {
    id: string;
    body: string;
    createdAt: string;
    profileId: string;
    profile: Profile;
};
type Question = {
    id: string;
    title: string;
    body: string;
    anonymous: boolean;
    createdAt: string;
    profileId: string;
    profile: Profile;
    category: { id: string; name: string };
    answers: Answer[];
};

export default function QaDetailClient({
    question: initialQuestion,
    currentUserId,
    role,
}: {
    question: Question;
    currentUserId: string;
    role: string;
}) {
    const router = useRouter();
    const [question, setQuestion] = useState(initialQuestion);
    const [answerBody, setAnswerBody] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [deletingAnswerId, setDeletingAnswerId] = useState<string | null>(null);

    const submitAnswer = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!answerBody.trim()) return;
        setSubmitting(true);
        const res = await fetch("/api/qa/answers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ body: answerBody, questionId: question.id }),
        });
        if (res.ok) {
            const newAnswer = await res.json();
            setQuestion((q) => ({ ...q, answers: [...q.answers, newAnswer] }));
            setAnswerBody("");
        }
        setSubmitting(false);
    };

    const deleteAnswer = async (answerId: string) => {
        if (!confirm("この回答を削除しますか？")) return;
        setDeletingAnswerId(answerId);
        const res = await fetch(`/api/qa/answers/${answerId}`, { method: "DELETE" });
        if (res.ok) {
            setQuestion((q) => ({ ...q, answers: q.answers.filter((a) => a.id !== answerId) }));
        }
        setDeletingAnswerId(null);
    };

    const deleteQuestion = async () => {
        if (!confirm("この質問を削除しますか？")) return;
        const res = await fetch(`/api/qa/questions/${question.id}`, { method: "DELETE" });
        if (res.ok) router.push("/exam/qa");
    };

    const canDeleteQuestion = question.profileId === currentUserId || role === "admin";
    const authorName = question.anonymous ? "匿名" : `${question.profile.lastName} ${question.profile.firstName}`;

    return (
        <div className="space-y-8">
            {/* 質問カード */}
            <div className="bg-white border border-gray-100 rounded-2xl p-8">
                <div className="flex items-start justify-between mb-4">
                    <span className="inline-block text-xs font-bold text-accent tracking-wide bg-accent/10 px-3 py-1 rounded-full">
                        {question.category.name}
                    </span>
                    {canDeleteQuestion && (
                        <button
                            onClick={deleteQuestion}
                            className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                        >
                            削除
                        </button>
                    )}
                </div>

                <h1 className="text-2xl font-extrabold tracking-tight mb-5 leading-snug break-words">
                    {question.title}
                </h1>

                <div className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap break-words mb-6">
                    {question.body}
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-400 pt-5 border-t border-gray-50">
                    <span>{authorName}</span>
                    <span>·</span>
                    <span>{new Date(question.createdAt).toLocaleDateString("ja-JP")}</span>
                </div>
            </div>

            {/* 回答一覧 */}
            <section>
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    回答
                    <span className="bg-text text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                        {question.answers.length}
                    </span>
                </h2>

                {question.answers.length === 0 && (
                    <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center text-gray-400">
                        <p className="font-bold mb-1">まだ回答がありません</p>
                        <p className="text-sm">最初の回答を投稿してみましょう</p>
                    </div>
                )}

                <div className="space-y-4">
                    {question.answers.map((answer, idx) => {
                        const canDelete = answer.profileId === currentUserId || role === "admin";
                        return (
                            <div key={answer.id} className="bg-white border border-gray-100 rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-text text-white rounded-full flex items-center justify-center text-xs font-bold">
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">
                                                {answer.profile.lastName} {answer.profile.firstName}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {new Date(answer.createdAt).toLocaleDateString("ja-JP")}
                                            </p>
                                        </div>
                                    </div>
                                    {canDelete && (
                                        <button
                                            onClick={() => deleteAnswer(answer.id)}
                                            disabled={deletingAnswerId === answer.id}
                                            className="text-xs text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                                        >
                                            削除
                                        </button>
                                    )}
                                </div>
                                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                    {answer.body}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* 回答フォーム：mentor/admin のみ */}
            {(role === "mentor" || role === "admin") ? (
                <section className="bg-white border border-gray-100 rounded-2xl p-8">
                    <h2 className="text-lg font-bold mb-5">回答を投稿する</h2>
                    <form onSubmit={submitAnswer} className="space-y-4">
                        <textarea
                            value={answerBody}
                            onChange={(e) => setAnswerBody(e.target.value)}
                            placeholder="回答を入力してください..."
                            rows={6}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-text transition-colors resize-none leading-relaxed"
                        />
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={submitting || !answerBody.trim()}
                                className="px-8 py-3 bg-text text-white rounded-full font-bold text-sm hover:opacity-80 transition-opacity disabled:opacity-50"
                            >
                                {submitting ? "投稿中..." : "回答する"}
                            </button>
                        </div>
                    </form>
                </section>
            ) : (
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 text-center text-sm text-gray-400">
                    回答はメンターが行います。質問への返答をお待ちください。
                </div>
            )}
        </div>
    );
}
