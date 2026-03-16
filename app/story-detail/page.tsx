import { getArticleById, formatDate } from "@/lib/cms";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata = {
    title: "合格体験記 | AcadeMina",
};

export default async function StoryDetailPage({ searchParams }: { searchParams: { id: string } }) {
    const id = searchParams.id;
    
    // IDがない場合は404ページへ
    if (!id) {
        notFound();
    }

    const article = await getArticleById(id);

    // 記事がない場合も404ページへ
    if (!article) {
        notFound();
    }

    // 大学データを抽出
    const school = article.school_info || article;

    return (
        <main className="mt-20 md:mt-[134px] bg-gray-50/50 min-h-screen pb-24">
            {/* ヒーローセクション（画像とタイトル） */}
            <div className="relative w-full h-[40vh] md:h-[50vh] bg-gray-900">
                <div 
                    className="absolute inset-0 bg-cover bg-center opacity-60"
                    style={{ backgroundImage: `url(${article.eyecatch?.url || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop'})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                
                <div className="absolute bottom-0 left-0 w-full px-5 pb-10">
                    <div className="max-w-4xl mx-auto">
                        {/* 大学バッジ */}
                        {school.university && (
                            <div className="inline-block bg-white text-gray-900 text-sm font-extrabold px-4 py-1.5 rounded-full mb-4 shadow-lg">
                                {school.university}
                                {school.faculty && <span className="ml-2 text-gray-500 font-medium">| {school.faculty}</span>}
                                {school.major && <span className="ml-2 text-gray-500 font-medium">| {school.major}</span>}
                            </div>
                        )}
                        <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-4">
                            {article.title}
                        </h1>
                        <div className="flex items-center text-gray-300 text-sm font-medium">
                            <span className="mr-4">{formatDate(article.publishedAt)}</span>
                            <span>{article.author || '合格者インタビュー'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 本文セクション */}
            <div className="max-w-4xl mx-auto px-5 mt-12">
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
                    {/* 本文（リッチエディタの内容） */}
                    <div 
                        className="prose prose-lg max-w-none text-gray-700 leading-loose [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:border-b-2 [&>h2]:border-blue-100 [&>h2]:pb-2 [&>h2]:mt-10 [&>h2]:mb-6 [&>h3]:text-xl [&>h3]:font-bold [&>h3]:mt-8 [&>h3]:mb-4 [&>p]:mb-6 [&>img]:rounded-xl [&>img]:my-8"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />

                    {/* 執筆者・先輩プロフィール（仮置き・拡張用） */}
                    <div className="mt-16 pt-8 border-t border-gray-100 bg-gray-50 rounded-2xl p-6 flex items-center gap-6">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop')` }} />
                        <div>
                            <h4 className="text-lg font-bold text-gray-900 mb-1">{article.author || '匿名希望の先輩'}</h4>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                この体験記が少しでも皆さんの大学院選び・院試対策の参考になれば嬉しいです。応援しています！
                            </p>
                        </div>
                    </div>
                </div>

                {/* 戻るボタン */}
                <div className="mt-12 text-center">
                    <Link href="/story" className="inline-block px-8 py-4 bg-white hover:bg-gray-50 text-gray-800 font-bold rounded-xl shadow-sm border border-gray-200 transition-all">
                        体験記一覧に戻る
                    </Link>
                </div>
            </div>
        </main>
    );
}