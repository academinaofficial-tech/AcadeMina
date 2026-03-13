"use client";

import { useState } from "react";
import { Lab } from "@prisma/client";

interface LabInsightClientProps {
    initialLabs: Lab[];
}

export default function LabInsightClient({ initialLabs }: LabInsightClientProps) {
    const [selectedUniv, setSelectedUniv] = useState<string>("すべて");
    const [searchQuery, setSearchQuery] = useState("");

    const universities = ["すべて", ...Array.from(new Set(initialLabs.map((l) => l.university)))];

    const filteredLabs = initialLabs.filter((lab) => {
        const matchesUniv = selectedUniv === "すべて" || lab.university === selectedUniv;
        const matchesSearch =
            lab.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lab.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lab.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesUniv && matchesSearch;
    });

    return (
        <div className="max-w-[1200px] mx-auto py-10 px-5">
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-extrabold mb-4">研究室検索</h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    全国の研究室情報をデータベース化。現役院生の声や研究内容を元に、あなたにぴったりの研究室を見つけましょう。
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-6 mb-10">
                <div className="flex-1 relative">
                    <input
                        type="text"
                        className="w-full p-4 pl-12 bg-white border rounded-2xl shadow-sm focus:ring-2 focus:ring-accent outline-none"
                        placeholder="研究室名、キーワード、大学名で検索..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                    {universities.map((univ) => (
                        <button
                            key={univ}
                            onClick={() => setSelectedUniv(univ)}
                            className={`px-6 py-4 rounded-2xl font-bold whitespace-nowrap transition-all ${selectedUniv === univ
                                ? "bg-accent text-white shadow-lg shadow-accent/20"
                                : "bg-white text-gray-600 border hover:bg-gray-50"
                                }`}
                        >
                            {univ}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredLabs.map((lab) => (
                    <div key={lab.id} className="bg-white border rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all group border-gray-100">
                        <div
                            className="h-52 bg-gray-200 bg-cover bg-center relative"
                            style={{ backgroundImage: `url(${lab.heroImage})` }}
                        >
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-accent">
                                {lab.university}
                            </div>
                        </div>
                        <div className="p-8">
                            <h2 className="text-xl font-extrabold mb-4 group-hover:text-accent transition-colors">
                                {lab.name}
                            </h2>
                            <div className="flex flex-wrap gap-2 mb-6">
                                {lab.tags.map((tag: string) => (
                                    <span key={tag} className="text-[10px] bg-gray-50 text-gray-500 px-2 py-1 rounded-md font-bold uppercase tracking-wider">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                            <p className="text-gray-600 text-sm line-clamp-3 mb-8 h-[4.5em] leading-relaxed">
                                {lab.about}
                            </p>
                            <div className="flex items-center gap-4 pt-6 border-t border-gray-50">
                                <div
                                    className="w-12 h-12 rounded-2xl bg-gray-100 bg-cover"
                                    style={{ backgroundImage: `url(${lab.profImage})` }}
                                />
                                <div>
                                    <div className="text-xs text-gray-400 font-bold uppercase tracking-tight">教授 / Professor</div>
                                    <div className="font-extrabold text-sm">{lab.profName}</div>
                                </div>
                                <button className="ml-auto w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-accent hover:text-white transition-all">
                                    →
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredLabs.length === 0 && (
                <div className="text-center py-32 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                    <div className="text-4xl mb-4">🔬</div>
                    <div className="text-gray-400 font-bold">該当する研究室が見つかりませんでした。</div>
                </div>
            )}
        </div>
    );
}
