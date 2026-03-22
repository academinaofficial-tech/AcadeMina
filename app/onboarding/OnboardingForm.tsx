"use client";

import { useState } from "react";
import { submitOnboarding } from "./action";

export default function OnboardingForm({ universities, themeGroups }: any) {
    // --- 1. 現在の所属に関するState ---
    const [selectedUniv, setSelectedUniv] = useState("");
    const [selectedFaculty, setSelectedFaculty] = useState("");
    const [selectedDept, setSelectedDept] = useState("");
    const [isManual, setIsManual] = useState(false);
    const [manualUniv, setManualUniv] = useState("");
    const [manualFaculty, setManualFaculty] = useState("");
    const [manualDept, setManualDept] = useState("");

    const availableFaculties = universities.find((u: any) => u.name === selectedUniv)?.faculties || [];
    const availableDepts = availableFaculties.find((f: any) => f.name === selectedFaculty)?.departments || [];

    const handleUnivChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        if (val === "other") {
            setIsManual(true);
            setSelectedUniv("");
        } else {
            setIsManual(false);
            setSelectedUniv(val);
        }
        setSelectedFaculty("");
        setSelectedDept("");
    };

    // --- 2. 志望校に関するState (最大3つ) ---
    const [targets, setTargets] = useState([
        { selectedUniv: "", selectedFaculty: "", selectedDept: "", isManual: false, manualUniv: "", manualFaculty: "", manualDept: "" }
    ]);

    const handleTargetChange = (index: number, field: string, value: string) => {
        const newTargets = [...targets];
        const target = newTargets[index];

        if (field === "selectedUniv") {
            if (value === "other") {
                target.isManual = true;
                target.selectedUniv = "";
            } else {
                target.isManual = false;
                target.selectedUniv = value;
            }
            target.selectedFaculty = "";
            target.selectedDept = "";
        } else {
            (target as any)[field] = value;
            if (field === "selectedFaculty") target.selectedDept = "";
        }
        setTargets(newTargets);
    };

    const addTarget = () => {
        if (targets.length < 3) {
            setTargets([...targets, { selectedUniv: "", selectedFaculty: "", selectedDept: "", isManual: false, manualUniv: "", manualFaculty: "", manualDept: "" }]);
        }
    };

    // --- 3. テーマのアコーディオンに関するState ---
    const [openGroups, setOpenGroups] = useState<string[]>([]);
    const toggleGroup = (groupId: string) => {
        setOpenGroups(prev => prev.includes(groupId) ? prev.filter(id => id !== groupId) : [...prev, groupId]);
    };

    return (
        <form action={submitOnboarding} className="space-y-10">
            {/* 隠しフィールド：現在の所属 */}
            <input type="hidden" name="finalUniversity" value={isManual ? manualUniv : selectedUniv} />
            <input type="hidden" name="finalFaculty" value={isManual ? manualFaculty : selectedFaculty} />
            <input type="hidden" name="finalDepartment" value={isManual ? manualDept : selectedDept} />

            {/* 隠しフィールド：志望校（最大3つをJSON用に分割して送る） */}
            {targets.map((t, i) => {
                const u = t.isManual ? t.manualUniv : t.selectedUniv;
                const f = t.isManual ? t.manualFaculty : t.selectedFaculty;
                const d = t.isManual ? t.manualDept : t.selectedDept;
                
                return (
                    <div key={`hidden_target_${i}`}>
                        <input type="hidden" name={`target_${i}_univ`} value={u} />
                        <input type="hidden" name={`target_${i}_faculty`} value={f} />
                        <input type="hidden" name={`target_${i}_dept`} value={d} />
                    </div>
                );
            })}

            {/* === 1. 現在の所属 === */}
            <div className="space-y-4">
                <label className="block font-bold text-lg mb-3 border-b pb-2">現在の所属 <span className="text-red-500">*</span></label>
                <select className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent outline-none" value={isManual ? "other" : selectedUniv} onChange={handleUnivChange} required={!isManual}>
                    <option value="">大学を選択してください</option>
                    {universities.map((u: any) => <option key={u.id} value={u.name}>{u.name}</option>)}
                    <option value="other">その他（手入力）</option>
                </select>

                {isManual ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <input placeholder="大学名" required value={manualUniv} onChange={e => setManualUniv(e.target.value)} className="w-full p-4 bg-gray-50 border rounded-xl" />
                        <input placeholder="学部名" required value={manualFaculty} onChange={e => setManualFaculty(e.target.value)} className="w-full p-4 bg-gray-50 border rounded-xl" />
                        <input placeholder="学科・専攻名" required value={manualDept} onChange={e => setManualDept(e.target.value)} className="w-full p-4 bg-gray-50 border rounded-xl" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <select className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl disabled:opacity-50" value={selectedFaculty} onChange={e => { setSelectedFaculty(e.target.value); setSelectedDept(""); }} disabled={!selectedUniv} required>
                            <option value="">学部・研究科を選択</option>
                            {availableFaculties.map((f: any) => <option key={f.id} value={f.name}>{f.name}</option>)}
                        </select>
                        <select className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl disabled:opacity-50" value={selectedDept} onChange={e => setSelectedDept(e.target.value)} disabled={!selectedFaculty} required>
                            <option value="">学科・専攻を選択</option>
                            {availableDepts.map((d: any) => <option key={d.id} value={d.name}>{d.name}</option>)}
                        </select>
                    </div>
                )}

                <select name="grade" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl mt-4" required>
                    <option value="">学年を選択してください</option>
                    <option value="B1">学部1年</option>
                    <option value="B2">学部2年</option>
                    <option value="B3">学部3年</option>
                    <option value="B4">学部4年</option>
                    <option value="M1">修士1年</option>
                    <option value="M2">修士2年</option>
                    <option value="D">博士</option>
                    <option value="Other">その他</option>
                </select>
            </div>

            {/* === 2. 志望校 === */}
            <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                    <label className="font-bold text-lg">志望大学院・専攻（任意 / 最大3つ）</label>
                    {targets.length < 3 && (
                        <button type="button" onClick={addTarget} className="text-sm bg-gray-100 text-gray-700 font-semibold px-4 py-2 rounded-full hover:bg-gray-200 transition">
                            + 志望校を追加
                        </button>
                    )}
                </div>
                
                {targets.map((target, index) => {
                    const tFaculties = universities.find((u: any) => u.name === target.selectedUniv)?.faculties || [];
                    const tDepts = tFaculties.find((f: any) => f.name === target.selectedFaculty)?.departments || [];

                    return (
                        <div key={index} className="p-5 border border-gray-200 rounded-2xl bg-gray-50/50 space-y-4 relative mt-4">
                            <span className="absolute -top-3 left-4 bg-white px-2 text-sm font-bold text-gray-500 border border-gray-200 rounded-full">第{index + 1}志望</span>
                            
                            <select className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent outline-none" value={target.isManual ? "other" : target.selectedUniv} onChange={e => handleTargetChange(index, "selectedUniv", e.target.value)}>
                                <option value="">大学を選択してください</option>
                                {universities.map((u: any) => <option key={u.id} value={u.name}>{u.name}</option>)}
                                <option value="other">その他（手入力）</option>
                            </select>

                            {target.isManual ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input placeholder="学部名" value={target.manualFaculty} onChange={e => handleTargetChange(index, "manualFaculty", e.target.value)} className="w-full p-4 bg-white border rounded-xl" />
                                    <input placeholder="学科・専攻名" value={target.manualDept} onChange={e => handleTargetChange(index, "manualDept", e.target.value)} className="w-full p-4 bg-white border rounded-xl" />
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <select className="w-full p-4 bg-white border border-gray-200 rounded-xl disabled:opacity-50" value={target.selectedFaculty} onChange={e => handleTargetChange(index, "selectedFaculty", e.target.value)} disabled={!target.selectedUniv}>
                                        <option value="">学部・研究科を選択</option>
                                        {tFaculties.map((f: any) => <option key={f.id} value={f.name}>{f.name}</option>)}
                                    </select>
                                    <select className="w-full p-4 bg-white border border-gray-200 rounded-xl disabled:opacity-50" value={target.selectedDept} onChange={e => handleTargetChange(index, "selectedDept", e.target.value)} disabled={!target.selectedFaculty}>
                                        <option value="">学科・専攻を選択</option>
                                        {tDepts.map((d: any) => <option key={d.id} value={d.name}>{d.name}</option>)}
                                    </select>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* === 3. 興味のある分野 (アコーディオン) === */}
            <div>
                <label className="block font-bold text-lg mb-3 border-b pb-2">興味のある分野・テーマ（複数選択可）</label>
                <div className="space-y-3">
                    {themeGroups.map((group: any) => {
                        const isOpen = openGroups.includes(group.id);
                        return (
                            <div key={group.id} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                                <button
                                    type="button"
                                    onClick={() => toggleGroup(group.id)}
                                    className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition"
                                >
                                    <span className="font-bold text-gray-700">{group.name}</span>
                                    <span className="text-gray-400 font-mono text-xl">{isOpen ? "−" : "＋"}</span>
                                </button>
                                
                                {isOpen && (
                                    <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-3 border-t border-gray-100">
                                        {group.themes.map((theme: any) => (
                                            <label key={theme.id} className="flex items-start gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition">
                                                <input type="checkbox" name="themes" value={theme.id} className="w-5 h-5 mt-0.5 accent-accent flex-shrink-0" />
                                                <span className="text-sm font-semibold text-gray-800 leading-snug">{theme.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* === 4. キャリアパス === */}
            <div>
                <label className="block font-bold text-lg mb-3 border-b pb-2">将来のキャリアパス <span className="text-red-500">*</span></label>
                <select name="careerPath" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl" required>
                    <option value="">選択してください</option>
                    <option value="Corporate">修士卒で企業就職</option>
                    <option value="Academia">博士進学 (アカデミア志望)</option>
                    <option value="R&D">博士進学 (企業R&D志望)</option>
                    <option value="Startup">起業・スタートアップ</option>
                    <option value="Undecided">未定</option>
                </select>
            </div>

            <button type="submit" className="w-full p-5 bg-text text-white text-xl font-bold rounded-full transition-all hover:bg-accent hover:scale-[1.01] shadow-lg">
                回答してマイページへ
            </button>
        </form>
    );
}