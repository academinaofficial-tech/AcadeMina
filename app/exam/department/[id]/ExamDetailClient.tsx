"use client";

import { Department, University, Exam } from "@prisma/client";
import Link from "next/link";
import { useState } from "react";

interface DeptWithRelations extends Department {
    university: University;
}

interface ExamDetailClientProps {
    department: DeptWithRelations;
    products: Exam[];
    recommendations: any[];
}

export default function ExamDetailClient({ department, products, recommendations }: ExamDetailClientProps) {
    const [selectedCategory, setSelectedCategory] = useState("all");

    const filteredProducts = selectedCategory === "all"
        ? products
        : products.filter(p => p.category === selectedCategory);

    const categories = [
        { id: "all", name: "All" },
        { id: "past-exam", name: "過去問解説" },
        { id: "practice", name: "対策問題" },
        { id: "forecast", name: "予想問題" },
        { id: "story", name: "合格体験記" },
        { id: "plan", name: "研究計画書" },
    ];

    return (
        <div className="bg-white min-h-screen">
            {/* Header Tier */}
            <div className="bg-white py-16 px-5 text-center border-b border-gray-100">
                <div className="max-w-[1000px] mx-auto">
                    <div className="text-sm md:text-base font-bold text-gray-400 mb-3 uppercase tracking-widest">
                        {department.university.name}
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black mb-8 leading-tight">
                        {department.name}
                    </h1>
                    <div className="flex justify-center gap-3 flex-wrap">
                        {department.university.tags.map(tag => (
                            <span key={tag} className="text-xs md:text-sm px-4 py-2 rounded-full border border-gray-200 font-bold bg-gray-50/50 text-gray-500">
                                {tag}
                            </span>
                        ))}
                        <span className="text-xs md:text-sm px-4 py-2 rounded-full border border-blue-100 font-bold bg-blue-50 text-accent">
                            {department.theme}
                        </span>
                    </div>
                </div>
            </div>

            <div className="max-w-[1000px] mx-auto py-12 px-5">
                {/* Category Filters */}
                <div className="flex gap-3 overflow-x-auto pb-6 mb-10 scrollbar-none no-scrollbar">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`whitespace-nowrap px-6 py-3 rounded-full font-bold text-sm transition-all duration-300 border ${selectedCategory === cat.id
                                    ? "bg-text text-white border-text shadow-lg transform scale-105"
                                    : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Product List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map(p => (
                            <Link
                                key={p.id}
                                href={`/exam/product/${p.id}`}
                                className="bg-white border border-gray-100 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group"
                            >
                                <div className="h-44 bg-gray-100 bg-cover bg-center" style={{ backgroundImage: `url('${p.image}')` }}></div>
                                <div className="p-6">
                                    <div className="text-[0.7rem] font-bold text-accent mb-2 uppercase tracking-tight">
                                        {categories.find(c => c.id === p.category)?.name || p.category}
                                    </div>
                                    <div className="text-base font-bold leading-relaxed mb-6 h-12 line-clamp-2 group-hover:text-accent transition-colors">
                                        {p.title}
                                    </div>
                                    <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                                        <span className="text-lg font-black italic">¥{p.price.toLocaleString()}</span>
                                        <span className="text-xs font-bold text-gray-400">View Details →</span>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                            <p className="text-gray-400 font-bold">現在販売中の商材はありません。</p>
                        </div>
                    )}
                </div>

                {/* Recommendations */}
                <div className="border-t border-gray-100 pt-16">
                    <h2 className="flex items-center gap-4 text-2xl font-black mb-12">
                        Recommended
                        <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1.5 rounded-lg flex items-center gap-1">
                            <span>💡</span> 同じテーマ・偏差値帯の学科
                        </span>
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recommendations.map(rec => (
                            <Link
                                key={rec.id}
                                href={`/exam/department/${rec.id}`}
                                className="bg-white p-6 rounded-2xl border border-gray-100 flex flex-col justify-between transition-all duration-300 hover:border-accent hover:bg-gray-50/50 hover:shadow-lg group"
                            >
                                <div>
                                    <div className="text-xs text-gray-400 font-bold mb-1">{rec.university.name}</div>
                                    <div className="text-lg font-bold mb-4 group-hover:text-accent transition-colors">{rec.name}</div>
                                    <div className="flex gap-2 flex-wrap">
                                        <span className="text-[0.65rem] px-2 py-1 border border-blue-100 bg-blue-50 text-accent rounded-md font-bold">{rec.theme}</span>
                                        <span className="text-[0.65rem] px-2 py-1 border border-gray-200 rounded-md text-gray-400 font-bold">{rec.university.level}ランク</span>
                                        <span className="text-[0.65rem] px-2 py-1 border border-gray-200 rounded-md text-gray-400 font-bold">{rec.university.area}</span>
                                    </div>
                                </div>
                                <div className="text-right text-xs font-bold text-gray-300 mt-6 group-hover:text-accent transition-colors">
                                    詳細を見る ↗
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
