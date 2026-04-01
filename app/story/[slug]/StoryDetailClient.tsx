"use client";

import { useUser } from "@clerk/nextjs";
import { formatDate } from "@/lib/cms";
import Link from "next/link";

interface StoryDetailClientProps {
    article: any;
}

export default function StoryDetailClient({ article }: StoryDetailClientProps) {
    const { isSignedIn, isLoaded } = useUser();

    if (!article) return <div className="text-center py-20">体験記が見つかりませんでした。</div>;

    const imgUrl = article.eyecatch?.url;
    // 💡 体験記用の大学データを抽出
    const school = article.school_info || article;

    // 未ログイン時：最初のH2タイトルまでだけ表示
    const fullContent = article.content || "<p>記事の中身がここに入ります。</p>";
    const firstH2End = fullContent.indexOf("</h2>");
    const previewContent = firstH2End !== -1
        ? fullContent.slice(0, firstH2End + 5) // "</h2>" を含む
        : fullContent.slice(0, 300);            // H2がない場合は300文字まで

    return (
        <article className="max-w-[860px] mx-auto py-16 px-6 lg:px-0">
            
            {/* 1. アイキャッチ画像 (一番上) */}
            {imgUrl && (
                <div className="mb-8 -mx-6 lg:-mx-10">
                    <img
                        src={imgUrl}
                        alt={article.title}
                        className="w-full h-auto max-h-[500px] bg-gray-100 rounded-3xl shadow-md object-cover"
                    />
                </div>
            )}

            {/* 2. ヘッダーセクション (タイトル → カテゴリ＆日付・著者) */}
            {/* 2. ヘッダーセクション (タイトル → 大学情報 ＆ 日付・著者) */}
            <header className="mb-12">
                {/* タイトル (左寄せ) */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-8 text-gray-900">
                    {article.title}
                </h1>

                {/* 大学情報(左) と 日付・著者(右) を横並びに配置 */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-5">
                    
                    {/* 左側：大学情報 */}
                    <div className="flex flex-wrap items-center gap-3">
                        {/* 🎓 合格体験記ならではの「大学・専攻バッジ」 */}
                        {school.university && (
                            <div className="text-gray-700 font-bold text-sm bg-gray-100 px-4 py-1.5 rounded-full border border-gray-200 flex items-center gap-2">
                                <span>🎓 {school.university}</span>
                                {school.faculty && <span className="text-gray-400">|</span>}
                                {school.faculty && <span>{school.faculty}</span>}
                                {school.major && <span className="text-gray-400">|</span>}
                                {school.major && <span>{school.major}</span>}
                            </div>
                        )}
                    </div>

                    {/* 右側：日付・著者 */}
                    <div className="flex items-center gap-4 text-gray-500 text-sm font-medium">
                        <span>{formatDate(article.publishedAt)}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                        <span>{article.author || "合格体験記"}</span>
                    </div>
                </div>
            </header>

            {/* Content Section */}
            {isLoaded && !isSignedIn ? (
                /* 未ログイン：最初のH2タイトルまで + フェード */
                <div className="relative column-content">
                    <div dangerouslySetInnerHTML={{ __html: previewContent }} />
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
                </div>
            ) : (
                /* ログイン済み：全文 */
                <div className="column-content">
                    <div dangerouslySetInnerHTML={{ __html: fullContent }} />
                </div>
            )}

            {/* 未ログイン時の登録CTA */}
            {isLoaded && !isSignedIn && (
                <div className="mt-4 pb-10 text-center">
                    <p className="text-gray-500 text-sm mb-4">続きを読むには会員登録が必要です</p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            href="/account/signup"
                            className="inline-block px-10 py-3 bg-black text-white rounded-full font-bold hover:opacity-80 transition-opacity"
                        >
                            無料で会員登録する
                        </Link>
                        <Link
                            href="/account/login"
                            className="inline-block px-10 py-3 border-2 border-black rounded-full font-bold hover:bg-black hover:text-white transition-all"
                        >
                            ログイン
                        </Link>
                    </div>
                </div>
            )}

            <footer className="mt-24 pt-10 border-t border-gray-100 text-center">
                <p className="text-gray-400 mb-8 font-medium">最後まで読んでいただきありがとうございます。</p>
                <Link
                    href="/story"
                    className="inline-block px-12 py-4 border-2 border-black rounded-full font-bold transition-all duration-300 hover:bg-black hover:text-white"
                >
                    ← 体験記一覧に戻る
                </Link>
            </footer>
        </article>
    );
}