import Link from "next/link";
import { getArticles, formatDate } from "@/lib/cms";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "お知らせ一覧｜AcadeMinaの最新情報・機能追加・更新情報",
  description:
    "AcadeMinaの最新ニュースや機能追加、コンテンツ更新、重要なお知らせをまとめたページです。サービスの変更点や新着情報をすばやく確認できます。",
};

export default async function NewsListPage() {
    const data = await getArticles({ limit: 100 });

    // ① "news" タイプの記事のみを抽出
    const newsArticles = data.contents.filter((a: any) => {
        return a.category?.article_type === "news";
    });

    return (
        <main className="mt-20 md:mt-[134px] bg-white min-h-screen pb-24">
            
            <div className="bg-gray-50 border-b border-gray-100 py-16 px-5 text-center">
                <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight text-gray-900">News</h1>
                <p className="text-gray-500 font-medium tracking-wide">運営からのお知らせ・最新情報</p>
            </div>

            <div className="max-w-4xl mx-auto px-5 pt-12">
                {newsArticles.length === 0 ? (
                    <div className="text-center text-gray-500 py-20 font-medium">
                        現在、お知らせはありません。
                    </div>
                ) : (
                    <ul className="list-none border-t border-gray-200">
                        {newsArticles.map((news: any) => (
                            <li key={news.id} className="border-b border-gray-200 transition-colors duration-200 hover:bg-gray-50 group">
                                {/* ✅ 修正ポイント：
                                    リンク先を /news/スラッグ に変更 
                                */}
                                <Link 
                                    href={`/news/${news.slug || news.id}`} 
                                    className="flex flex-col md:flex-row md:items-center py-6 px-4 md:px-2 w-full"
                                >
                                    <span className="font-bold text-sm text-gray-500 md:w-[120px] shrink-0 mb-2 md:mb-0">
                                        {formatDate(news.publishedAt)}
                                    </span>
                                    
                                    <span className="bg-gray-800 text-white py-1 px-3 text-xs font-bold md:mr-6 rounded-sm min-w-[80px] text-center w-fit mb-3 md:mb-0 shrink-0 tracking-wider">
                                        {news.subcategory || 'INFO'}
                                    </span>
                                    
                                    <span className="text-lg font-bold text-gray-900 flex-1 group-hover:text-blue-600 transition-colors leading-relaxed">
                                        {news.title}
                                    </span>
                                    
                                    <span className="ml-0 md:ml-6 text-xl hidden md:block opacity-0 group-hover:opacity-100 transition-opacity text-blue-600">
                                        →
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </main>
    );
}