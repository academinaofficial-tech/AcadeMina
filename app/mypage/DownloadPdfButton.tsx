"use client";

import { useState } from "react";

interface DownloadPdfButtonProps {
    examId: string;
    hasPdfKey: boolean;
}

export default function DownloadPdfButton({ examId, hasPdfKey }: DownloadPdfButtonProps) {
    const [loading, setLoading] = useState(false);

    if (!hasPdfKey) {
        return (
            <div className="mt-4 text-xs font-bold text-gray-400 bg-gray-50 px-3 py-2 rounded-lg inline-block border border-gray-100">
                PDF準備中...
            </div>
        );
    }

    const handleDownload = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        setLoading(true);
        try {
            const res = await fetch(`/api/exam/${examId}/download`);
            const data = await res.json();
            
            if (data.url) {
                // Presinged URLへリダイレクト（別タブまたは現在のタブでダウンロード）
                window.location.href = data.url;
            } else {
                alert(data.error || "ダウンロードURLの取得に失敗しました。");
            }
        } catch (err) {
            console.error(err);
            alert("通信エラーが発生しました");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button 
           onClick={handleDownload}
           disabled={loading}
           className="mt-4 bg-accent text-white px-4 py-2 rounded-lg text-xs font-bold hover:brightness-110 shadow-sm active:scale-95 disabled:opacity-50 transition-all inline-flex items-center gap-2"
        >
            {loading ? (
                <>
                    <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    準備中...
                </>
            ) : (
                "↓ PDFをダウンロード"
            )}
        </button>
    );
}
