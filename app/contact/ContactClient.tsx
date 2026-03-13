"use client";

import { useState } from "react";

export default function ContactClient() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulating API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsSubmitting(false);
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (submitted) {
        return (
            <div className="max-w-[700px] mx-auto py-24 px-5 text-center">
                <div className="w-20 h-20 rounded-full bg-accent text-white flex items-center justify-center text-4xl mx-auto mb-8 shadow-lg shadow-accent/20">
                    ✓
                </div>
                <h2 className="text-3xl font-black mb-6">お問い合わせを受け付けました</h2>
                <p className="text-gray-500 leading-relaxed mb-12">
                    お問い合わせありがとうございます。内容を確認の上、担当者より数日以内にご連絡させていただきます。
                </p>
                <button
                    onClick={() => setSubmitted(false)}
                    className="inline-block bg-text text-white py-4 px-10 rounded-full font-bold transition-all hover:scale-105"
                >
                    フォームに戻る
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-[800px] mx-auto my-16 bg-white p-10 md:p-16 rounded-[40px] shadow-2xl shadow-gray-200/50 border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-10">
                {/* Type Selection */}
                <section>
                    <label className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-6">
                        お問い合わせの種類 <span className="text-accent ml-1">*</span>
                    </label>
                    <div className="flex flex-wrap gap-3">
                        {["学生として", "研究室・教員として", "大学・企業として", "その他"].map((type) => (
                            <label key={type} className="relative group flex-1 min-w-[150px]">
                                <input
                                    type="radio"
                                    name="type"
                                    value={type}
                                    required
                                    className="peer absolute inset-0 opacity-0 cursor-pointer z-10"
                                />
                                <div className="py-4 px-6 border-2 border-gray-50 rounded-2xl text-center font-bold text-sm bg-gray-50/30 peer-checked:border-accent peer-checked:bg-blue-50/50 peer-checked:text-accent transition-all group-hover:border-gray-200">
                                    {type}
                                </div>
                            </label>
                        ))}
                    </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-3">
                            氏名 <span className="text-accent ml-1">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="例：山田 太郎"
                            className="w-full p-4 rounded-2xl border border-gray-100 font-bold focus:border-accent outline-none bg-gray-50/30 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-3">
                            所属 <span className="text-accent ml-1">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="例：〇〇大学 / 株式会社〇〇"
                            className="w-full p-4 rounded-2xl border border-gray-100 font-bold focus:border-accent outline-none bg-gray-50/30 transition-all"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-3">
                        メールアドレス <span className="text-accent ml-1">*</span>
                    </label>
                    <input
                        type="email"
                        required
                        placeholder="yourname@example.com"
                        className="w-full p-4 rounded-2xl border border-gray-100 font-bold focus:border-accent outline-none bg-gray-50/30 transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-3">
                        件名 <span className="text-accent ml-1">*</span>
                    </label>
                    <input
                        type="text"
                        required
                        placeholder="例：研究室情報の掲載について"
                        className="w-full p-4 rounded-2xl border border-gray-100 font-bold focus:border-accent outline-none bg-gray-50/30 transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-3">
                        お問い合わせ内容 <span className="text-accent ml-1">*</span>
                    </label>
                    <textarea
                        required
                        rows={6}
                        placeholder="詳細内容をご記入ください。"
                        className="w-full p-6 rounded-2xl border border-gray-100 font-bold focus:border-accent outline-none bg-gray-50/30 transition-all resize-none"
                    ></textarea>
                </div>

                <div className="pt-4">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" required className="w-5 h-5 accent-accent" />
                        <span className="text-sm font-bold text-gray-400 group-hover:text-gray-600 transition-colors">
                            プライバシーポリシーに同意する
                        </span>
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-6 bg-text text-white rounded-full font-black text-xl shadow-xl shadow-black/10 transition-all hover:scale-[1.02] hover:bg-accent disabled:bg-gray-200 disabled:scale-100 active:scale-95"
                >
                    {isSubmitting ? "送信中..." : "送信する →"}
                </button>
            </form>
        </div>
    );
}
