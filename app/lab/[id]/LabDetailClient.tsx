"use client";

import { Lab, University, Department } from "@prisma/client";
import Link from "next/link";

interface LabWithRelations extends Lab {
    university: University | null;
    department: Department | null;
}

interface LabDetailClientProps {
    lab: LabWithRelations;
}

export default function LabDetailClient({ lab }: LabDetailClientProps) {
    const stats = (lab.stats as any) || { gender: 0, international: 0, working: 0 };
    const papers = (lab.papers as any[]) || [];
    const contact = (lab.contact as any) || { prof: "", assistant: "" };

    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section */}
            <section
                className="h-[50vh] relative bg-cover bg-center"
                style={{ backgroundImage: `url(${lab.heroImage})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 flex items-end py-16 px-5 md:px-10">
                    <div className="max-w-[1000px] mx-auto w-full text-white">
                        <div className="text-sm md:text-lg font-bold opacity-90 mb-2">
                            {lab.universityName || lab.university?.name}
                        </div>
                        <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-6">
                            {lab.name}
                        </h1>
                        <div className="flex gap-2.5 flex-wrap">
                            {lab.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="bg-white/10 backdrop-blur-md py-1.5 px-4 rounded-full text-xs md:text-sm font-bold border border-white/20"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-[900px] mx-auto py-20 px-5">
                {/* Basic Information & Buttons */}
                <section className="mb-20">
                    <h2 className="text-3xl font-extrabold mb-10 pb-3 border-b-4 border-text inline-block">
                        Basic Information
                    </h2>
                    <div className="text-center mb-16">
                        {lab.website && (
                            <Link
                                href={lab.website}
                                target="_blank"
                                className="inline-block bg-text text-white py-4 px-10 rounded-full font-bold transition-all hover:scale-105"
                            >
                                Visit Official Website ↗
                            </Link>
                        )}
                    </div>

                    <div className="flex justify-around flex-wrap gap-8 bg-gray-50 p-10 md:p-14 rounded-3xl">
                        {[
                            { label: "女性比率", value: stats.gender },
                            { label: "留学生比率", value: stats.international },
                            { label: "社会人比率", value: stats.working },
                        ].map((stat) => (
                            <div key={stat.label} className="text-center">
                                <div
                                    className="w-32 h-32 rounded-full mx-auto mb-4 relative flex items-center justify-center bg-gray-200"
                                    style={{
                                        background: `conic-gradient(var(--accent) 0% ${stat.value}%, #e5e7eb ${stat.value}% 100%)`,
                                    }}
                                >
                                    <div className="absolute inset-2 bg-gray-50 rounded-full flex items-center justify-center">
                                        <span className="text-2xl font-extrabold text-text">
                                            {stat.value}%
                                        </span>
                                    </div>
                                </div>
                                <div className="font-bold text-sm text-gray-500">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Research & Papers */}
                <section className="mb-20">
                    <h2 className="text-3xl font-extrabold mb-10 pb-3 border-b-4 border-text inline-block">
                        Research & Papers
                    </h2>
                    <p className="text-lg leading-relaxed text-gray-700 mb-16 whitespace-pre-wrap">
                        {lab.about}
                    </p>

                    <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                        <span className="w-2 h-6 bg-accent rounded-full"></span>
                        Selected Papers
                    </h3>
                    <div className="space-y-8">
                        {papers.length > 0 ? (
                            papers.map((paper, idx) => (
                                <div key={idx} className="pb-8 border-b border-gray-100 last:border-0">
                                    <span className="text-xl font-bold mb-3 block text-text">
                                        {paper.title}
                                    </span>
                                    <p className="text-gray-600 mb-4 leading-relaxed">
                                        {paper.summary}
                                    </p>
                                    <Link
                                        href={paper.link}
                                        target="_blank"
                                        className="text-sm text-accent font-bold hover:underline inline-flex items-center gap-1"
                                    >
                                        Read Paper <span className="text-lg">→</span>
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 italic">登録された論文情報はありません。</p>
                        )}
                    </div>
                </section>

                {/* Professor's Message */}
                <section className="mb-20">
                    <h2 className="text-3xl font-extrabold mb-10 pb-3 border-b-4 border-text inline-block">
                        Professor's Message
                    </h2>
                    <div className="flex flex-col md:flex-row gap-10 items-center md:items-start bg-white border border-gray-100 p-10 rounded-3xl shadow-sm">
                        <div className="min-w-[150px] text-center">
                            <div
                                className="w-32 h-32 rounded-full mx-auto mb-4 bg-gray-100 bg-cover border-4 border-gray-50 shadow-inner"
                                style={{ backgroundImage: `url(${lab.profImage})` }}
                            />
                            <div className="font-extrabold text-lg">{lab.profName}</div>
                            <div className="text-xs text-gray-400 font-bold uppercase mt-1">Professor</div>
                        </div>
                        <div className="relative">
                            <span className="absolute -top-8 -left-4 text-8xl text-gray-100 font-serif pointer-events-none">“</span>
                            <p className="relative z-10 italic text-xl text-gray-600 leading-relaxed pt-4">
                                {lab.message}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Contact */}
                <section className="mb-20">
                    <h2 className="text-3xl font-extrabold mb-10 pb-3 border-b-4 border-text inline-block">
                        Contact
                    </h2>
                    <div className="bg-text text-white p-12 md:p-16 rounded-3xl text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
                        <div className="relative z-10">
                            <div className="mb-10">
                                <div className="text-sm font-bold opacity-60 mb-2 uppercase tracking-widest">Professor's Email</div>
                                <span className="text-2xl md:text-3xl font-extrabold break-all">
                                    {contact.prof || "未登録"}
                                </span>
                            </div>
                            <div className="mb-12">
                                <div className="text-sm font-bold opacity-60 mb-2 uppercase tracking-widest">Lab Office / Assistant</div>
                                <span className="text-2xl md:text-3xl font-extrabold break-all">
                                    {contact.assistant || "未登録"}
                                </span>
                            </div>
                            <div className="p-4 bg-white/10 rounded-xl inline-block">
                                <p className="text-sm opacity-80">
                                    ※お問い合わせの際は、件名に「研究室見学希望」等と明記してください。
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
