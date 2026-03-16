import { getArticleById, formatDate } from "@/lib/cms";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata = {
    title: "合格体験記 | AcadeMina",
};

export default async function StoryDetailPage({ searchParams }: { searchParams: { id: string } }) {
    const id = searchParams.id;
    
    if (!id) {
        notFound();
    }

    const article = await getArticleById(id);

    if (!article) {
        notFound();
    }

    const school = article.school_info || article;

    return (
        <main className="mt-20 md:mt-[134px] bg-gray-50/80 min-h-screen pb-24 font-sans">
            {/* ヒーローセクション（より重厚感のあるグラデーションに） */}
            <div className="relative w-full h-[45vh] md:h-[55vh] bg-slate-900">
                <div 
                    className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity"
                    style={{ backgroundImage: `url(${article.eyecatch?.url || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop'})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
                
                <div className="absolute bottom-0 left-0 w-full px-5 pb-12">
                    <div className="max-w-4xl mx-auto">
                        {/* 大学バッジ（ゴールド系のアクセントで高級感を） */}
                        {school.university && (
                            <div className="inline-flex items-center bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-bold px-5 py-2 rounded-full mb-6 shadow-xl">
                                <span className="text-yellow-400 mr-2">✦</span>
                                {school.university}
                                {school.faculty && <span className="ml-3 text-gray-300 font-medium border-l border-white/30 pl-3">{school.faculty}</span>}
                                {school.major && <span className="ml-3 text-gray-300 font-medium border-l border-white/30 pl-3">{school.major}</span>}
                            </div>
                        )}
                        <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-6 tracking-tight">
                            {article.title}
                        </h1>
                        <div className="flex items-center text-gray-400 text-sm font-medium">
                            <span className="bg-slate-800 px-3 py-1 rounded-md mr-4 border border-slate-700">{formatDate(article.publishedAt)}</span>
                            <span>{article.author || '合格体験記'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 本文セクション（コラム級のリッチな装飾） */}
            <div className="max-w-4xl mx-auto px-5 -mt-8 relative z-10">
                <div className="bg-white rounded-t-3xl rounded-b-3xl p-8 md:p-14 shadow-xl shadow-slate-200/50 border border-gray-100">
                    
                    <div 
                        className={`
                            prose prose-lg max-w-none text-gray-700 leading-loose tracking-wide
                            
                            /* pタグ（本文） */
                            [&>p]:mb-8 [&>p]:text-[17px]
                            
                            /* h2（大見出し）：背景色＋左線＋角丸で豪華なリボン風に */
                            [&>h2]:bg-blue-50 [&>h2]:border-l-4 [&>h2]:border-accent [&>h2]:text-gray-900 [&>h2]:font-bold [&>h2]:text-2xl [&>h2]:px-5 [&>h2]:py-4 [&>h2]:rounded-r-xl [&>h2]:mt-16 [&>h2]:mb-8 [&>h2]:shadow-sm
                            
                            /* h3（小見出し）：下線とアクセントカラーでスッキリと */
                            [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-gray-800 [&>h3]:border-b-2 [&>h3]:border-gray-100 [&>h3]:pb-3 [&>h3]:mt-12 [&>h3]:mb-6 [&>h3]:relative [&>h3]:before:content-[''] [&>h3]:before:absolute [&>h3]:before:bottom-[-2px] [&>h3]:before:left-0 [&>h3]:before:w-12 [&>h3]:before:h-0.5 [&>h3]:before:bg-accent
                            
                            /* ul（箇条書き）：背景をグレーにして囲み枠風に */
                            [&>ul]:bg-gray-50 [&>ul]:p-6 [&>ul]:rounded-2xl [&>ul]:border [&>ul]:border-gray-100 [&>ul]:my-8 [&>ul>li]:mb-3 [&>ul>li]:marker:text-accent [&>ul>li]:font-medium
                            
                            /* blockquote（参考書の紹介）：カード風のリッチなデザインに */
                            [&>blockquote]:bg-white [&>blockquote]:border [&>blockquote]:border-gray-200 [&>blockquote]:border-l-4 [&>blockquote]:border-l-accent [&>blockquote]:rounded-r-2xl [&>blockquote]:p-6 [&>blockquote]:my-10 [&>blockquote]:shadow-md [&>blockquote]:not-italic [&>blockquote>p]:m-0 [&>blockquote_strong]:text-lg [&>blockquote_strong]:text-gray-900 [&>blockquote_strong]:block [&>blockquote_strong]:mb-2 [&>blockquote_a]:inline-block [&>blockquote_a]:bg-accent [&>blockquote_a]:text-white [&>blockquote_a]:px-4 [&>blockquote_a]:py-2 [&>blockquote_a]:rounded-lg [&>blockquote_a]:text-sm [&>blockquote_a]:font-bold [&>blockquote_a]:no-underline hover:[&>blockquote_a]:bg-blue-700 [&>blockquote_a]:transition-colors
                            
                            /* 画像 */
                            [&>img]:rounded-2xl [&>img]:shadow-lg [&>img]:my-12
                        `}
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />
                </div>

                {/* 戻るボタン（豪華版） */}
                <div className="mt-16 mb-12 text-center">
                    <Link href="/story" className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl shadow-lg shadow-slate-900/20 transition-all hover:-translate-y-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        体験記一覧に戻る
                    </Link>
                </div>
            </div>
        </main>
    );
}