"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/cms";

interface StoryClientProps {
    initialArticles: any[];
    masterSchools: any[];
}

export default function StoryClient({ initialArticles, masterSchools }: StoryClientProps) {
    const [selectedUni, setSelectedUni] = useState("");
    const [selectedFaculty, setSelectedFaculty] = useState("");
    const [selectedMajor, setSelectedMajor] = useState("");

    const getSchoolData = (article: any) => {
        const info = article.school_info || article;
        return {
            university: info?.university || "",
            faculty: info?.faculty || "",
            major: info?.major || ""
        };
    };

    const availableUnis = useMemo(() => {
        const unis = masterSchools.map(s => s.university).filter(Boolean);
        return Array.from(new Set(unis));
    }, [masterSchools]);

    const availableFaculties = useMemo(() => {
        if (!selectedUni) return [];
        const faculties = masterSchools
            .filter(s => s.university === selectedUni)
            .map(s => s.faculty)
            .filter(Boolean);
        return Array.from(new Set(faculties));
    }, [masterSchools, selectedUni]);

    const availableMajors = useMemo(() => {
        if (!selectedFaculty) return [];
        const majors = masterSchools
            .filter(s => 
                s.university === selectedUni && 
                s.faculty === selectedFaculty
            )
            .map(s => s.major)
            .filter(Boolean);
        return Array.from(new Set(majors));
    }, [masterSchools, selectedUni, selectedFaculty]);

    const filteredArticles = useMemo(() => {
        return initialArticles.filter(a => {
            const school = getSchoolData(a);
            if (selectedUni && school.university !== selectedUni) return false;
            if (selectedFaculty && school.faculty !== selectedFaculty) return false;
            if (selectedMajor && school.major !== selectedMajor) return false;
            return true;
        });
    }, [initialArticles, selectedUni, selectedFaculty, selectedMajor]);

    const handleReset = () => {
        setSelectedUni("");
        setSelectedFaculty("");
        setSelectedMajor("");
    };

    return (
        <div className="max-w-[1100px] mx-auto py-16 px-5">
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm mb-12">
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="w-full md:flex-1">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">University</label>
                        <select 
                            className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-xl px-4 py-3 font-medium outline-none focus:border-accent transition-colors cursor-pointer"
                            value={selectedUni}
                            onChange={(e) => {
                                setSelectedUni(e.target.value);
                                setSelectedFaculty("");
                                setSelectedMajor("");
                            }}
                        >
                            <option value="">すべての大学</option>
                            {availableUnis.map(uni => (
                                <option key={uni as string} value={uni as string}>{uni as string}</option>
                            ))}
                        </select>
                    </div>

                    <div className="w-full md:flex-1">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Faculty</label>
                        <select 
                            className={`w-full border rounded-xl px-4 py-3 font-medium outline-none transition-colors ${!selectedUni ? 'bg-gray-100 border-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-50 border-gray-200 text-gray-700 focus:border-accent cursor-pointer'}`}
                            value={selectedFaculty}
                            onChange={(e) => {
                                setSelectedFaculty(e.target.value);
                                setSelectedMajor("");
                            }}
                            disabled={!selectedUni}
                        >
                            <option value="">すべての研究科</option>
                            {availableFaculties.map(fac => (
                                <option key={fac as string} value={fac as string}>{fac as string}</option>
                            ))}
                        </select>
                    </div>

                    <div className="w-full md:flex-1">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Major</label>
                        <select 
                            className={`w-full border rounded-xl px-4 py-3 font-medium outline-none transition-colors ${!selectedFaculty ? 'bg-gray-100 border-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-50 border-gray-200 text-gray-700 focus:border-accent cursor-pointer'}`}
                            value={selectedMajor}
                            onChange={(e) => setSelectedMajor(e.target.value)}
                            disabled={!selectedFaculty}
                        >
                            <option value="">すべての専攻</option>
                            {availableMajors.map(maj => (
                                <option key={maj as string} value={maj as string}>{maj as string}</option>
                            ))}
                        </select>
                    </div>

                    {(selectedUni || selectedFaculty || selectedMajor) && (
                        <div className="w-full md:w-auto mt-6 md:mt-0 pt-6">
                            <button 
                                onClick={handleReset}
                                className="w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-xl transition-colors whitespace-nowrap"
                            >
                                クリア
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-extrabold tracking-tight">検索結果</h2>
                <span className="text-accent font-bold bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100">
                    {filteredArticles.length} 件
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {filteredArticles.map((a: any) => (
                    <Link key={a.id} href={`/story/${a.slug || a.id}`} className="group no-underline text-inherit">
                        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1 h-full flex flex-col relative">
                            {getSchoolData(a).university && (
                                <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm text-black text-[10px] font-extrabold px-3 py-1.5 rounded-md shadow-sm">
                                    {getSchoolData(a).university}
                                </div>
                            )}
                            <div
                                className="h-48 bg-gray-100 bg-cover bg-center relative"
                                style={{ backgroundImage: `url(${a.eyecatch?.url || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop'})` }}
                            />
                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="text-lg font-bold leading-snug mb-3 group-hover:text-accent transition-colors line-clamp-2">{a.title}</h3>
                                
                                {(getSchoolData(a).faculty || getSchoolData(a).major) && (
                                    <div className="text-xs text-gray-500 font-medium mb-4 flex flex-wrap gap-1">
                                        {getSchoolData(a).faculty && <span className="bg-gray-100 px-2 py-1 rounded">{getSchoolData(a).faculty}</span>}
                                        {getSchoolData(a).major && <span className="bg-gray-100 px-2 py-1 rounded">{getSchoolData(a).major}</span>}
                                    </div>
                                )}
                                
                                <div className="mt-auto text-xs text-gray-400 flex justify-between font-medium border-t border-gray-50 pt-4">
                                    <span>{formatDate(a.publishedAt)}</span>
                                    <span>{a.author || 'AcadeMina編集部'}</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {filteredArticles.length === 0 && (
                <div className="text-center py-24 bg-white border border-gray-100 rounded-3xl shadow-sm">
                    <span className="text-4xl mb-4 block">🔍</span>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">体験記が見つかりません</h3>
                    <p className="text-gray-500">選択した条件に合致する体験記はまだ投稿されていません。<br/>検索条件をクリアしてお試しください。</p>
                </div>
            )}
        </div>
    );
}