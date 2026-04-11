"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Department { id: string; name: string; }
interface Faculty { id: string; name: string; departments: Department[]; }
interface University { id: string; name: string; faculties: Faculty[]; }

interface Exam {
    id: string;
    title: string;
    price: number;
    category: string;
    description: string | null;
    contents: string[];
    pdfKey: string | null;
    image: string | null;
    deptId: string | null;
    department: {
        id: string;
        name: string;
        faculty: {
            id: string;
            name: string;
            university: { id: string; name: string };
        };
    } | null;
}

const CATEGORY_IMAGES: Record<string, string> = {
    "過去問解答解説": "/exam-categories/past-exam-solutions.png",
    "予想問題": "/exam-categories/practice-questions.png",
    "対策問題集": "/exam-categories/exam-prep-workbook.png",
};

export default function AdminExamEditClient({
    exam,
    hierarchy,
}: {
    exam: Exam;
    hierarchy: University[];
}) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState("");

    const [title, setTitle] = useState(exam.title);
    const [price, setPrice] = useState(String(exam.price));
    const [examType, setExamType] = useState(exam.category);
    const [description, setDescription] = useState(exam.description || "");
    const [contentsInput, setContentsInput] = useState(exam.contents.join("\n"));
    const [pdfFile, setPdfFile] = useState<File | null>(null);

    const [selectedUnivId, setSelectedUnivId] = useState(
        exam.department?.faculty?.university?.id || ""
    );
    const [selectedFacId, setSelectedFacId] = useState(
        exam.department?.faculty?.id || ""
    );
    const [selectedDeptId, setSelectedDeptId] = useState(exam.deptId || "");

    const selectedUniv = hierarchy.find((u) => u.id === selectedUnivId);
    const faculties = selectedUniv?.faculties || [];
    const selectedFac = faculties.find((f) => f.id === selectedFacId);
    const departments = selectedFac?.departments || [];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !price || !examType) {
            alert("必須項目が入力されていません。");
            return;
        }

        setLoading(true);

        const contentsArray = contentsInput
            .split("\n")
            .map((l) => l.trim())
            .filter((l) => l.length > 0);

        let pdfKey = exam.pdfKey;

        try {
            if (pdfFile) {
                setUploadProgress("PDFをアップロード中...");
                const formData = new FormData();
                formData.append("file", pdfFile);

                const uploadRes = await fetch("/api/admin/upload", {
                    method: "POST",
                    body: formData,
                });
                if (!uploadRes.ok) throw new Error("ファイルのアップロードに失敗しました");
                pdfKey = (await uploadRes.json()).pdfKey;
            }

            setUploadProgress("更新中...");

            const res = await fetch(`/api/admin/exams/${exam.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    price,
                    category: examType,
                    deptId: selectedDeptId || null,
                    description,
                    contents: contentsArray,
                    pdfKey,
                    image: CATEGORY_IMAGES[examType] || exam.image,
                }),
            });

            if (!res.ok) throw new Error(await res.text());

            alert("更新しました！");
            router.push("/exam-store");
            router.refresh();
        } catch (err: any) {
            alert("エラーが発生しました: " + err.message);
        } finally {
            setLoading(false);
            setUploadProgress("");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl space-y-8">

            {/* 階層選択 */}
            <div className="space-y-4 p-6 bg-gray-50 rounded-xl border">
                <h2 className="text-xl font-bold border-b pb-2 mb-4">紐付けとタイトル</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold mb-1">大学</label>
                        <select
                            className="w-full p-3 border rounded-lg"
                            value={selectedUnivId}
                            onChange={(e) => {
                                setSelectedUnivId(e.target.value);
                                setSelectedFacId("");
                                setSelectedDeptId("");
                            }}
                        >
                            <option value="">-- 選択 --</option>
                            {hierarchy.map((u) => (
                                <option key={u.id} value={u.id}>{u.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-1">学部</label>
                        <select
                            className="w-full p-3 border rounded-lg disabled:bg-gray-200"
                            value={selectedFacId}
                            onChange={(e) => { setSelectedFacId(e.target.value); setSelectedDeptId(""); }}
                            disabled={!selectedUnivId}
                        >
                            <option value="">-- 選択 --</option>
                            {faculties.map((f) => (
                                <option key={f.id} value={f.id}>{f.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-1">専攻</label>
                        <select
                            className="w-full p-3 border rounded-lg disabled:bg-gray-200"
                            value={selectedDeptId}
                            onChange={(e) => setSelectedDeptId(e.target.value)}
                            disabled={!selectedFacId}
                        >
                            <option value="">-- 選択 --</option>
                            {departments.map((d) => (
                                <option key={d.id} value={d.id}>{d.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-1 text-accent">
                            種類 / Category <span className="text-red-500">*</span>
                        </label>
                        <select
                            className="w-full p-3 border rounded-lg border-accent/30"
                            value={examType}
                            onChange={(e) => setExamType(e.target.value)}
                            required
                        >
                            <option value="">-- 選択 --</option>
                            {["予想問題", "過去問解答解説", "対策問題集"].map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                    <label className="block text-sm font-bold mb-2">タイトル <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        required
                        className="w-full p-3 border rounded-lg"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold mb-1">価格 (円) <span className="text-red-500">*</span></label>
                    <input
                        type="number"
                        required
                        className="w-full p-3 border rounded-lg"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold mb-1">教材PDFファイル（差し替え）</label>
                    <input
                        type="file"
                        accept="application/pdf"
                        className="w-full p-2 border rounded-lg bg-white"
                        onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                    />
                    {exam.pdfKey && (
                        <p className="text-xs text-green-600 mt-1">✓ 現在のPDF: {exam.pdfKey.split("/").pop()}</p>
                    )}
                    {!exam.pdfKey && (
                        <p className="text-xs text-gray-400 mt-1">PDFは未登録です</p>
                    )}
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold mb-1">概要説明</label>
                <textarea
                    className="w-full p-3 border rounded-lg h-32"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="この教材の概要を入力..."
                />
            </div>

            <div>
                <label className="block text-sm font-bold mb-1">学習内容（改行区切りで入力）</label>
                <textarea
                    className="w-full p-3 border rounded-lg h-32"
                    value={contentsInput}
                    onChange={(e) => setContentsInput(e.target.value)}
                    placeholder={"2021年の過去問解答\n2022年の過去問解答\n面接の頻出質問10選"}
                />
            </div>

            <div className="pt-6 border-t">
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-accent text-white font-bold text-lg rounded-full hover:brightness-110 disabled:opacity-50 transition-all shadow-lg flex flex-col items-center justify-center"
                >
                    <span>{loading ? "処理中..." : "変更を保存する"}</span>
                    {uploadProgress && <span className="text-sm font-normal opacity-80 mt-1">{uploadProgress}</span>}
                </button>
            </div>
        </form>
    );
}
