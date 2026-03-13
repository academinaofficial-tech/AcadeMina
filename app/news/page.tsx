import { getLatestNews, formatDate } from "@/lib/cms";
import Link from "next/link";

export const metadata = {
    title: "News | AcadeMina",
};

export default async function Page() {
    const data = await getLatestNews(20);

    return (
        <main className="mt-20 md:mt-[134px] bg-white min-h-screen">
            <section className="pt-20 pb-16 px-10 text-center bg-gray-50 border-b border-gray-100">
                <h1 className="text-5xl font-extrabold mb-4 tracking-tight">News</h1>
                <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
                    AcadeMinaからのお知らせ、イベント情報、データベースの更新情報などをお届けします。
                </p>
            </section>

            <div className="max-w-[900px] mx-auto py-16 px-6">
                <div className="space-y-2">
                    {data.contents.map((n: any) => (
                        <Link
                            key={n.id}
                            href={`/column-detail?id=${n.id}`}
                            className="group flex flex-col md:flex-row md:items-center py-8 border-b border-gray-100 hover:bg-gray-50/50 transition-all px-4 -mx-4 rounded-xl"
                        >
                            <div className="flex items-center gap-4 mb-4 md:mb-0 md:w-[200px] shrink-0">
                                <span className="text-gray-400 font-bold text-sm tracking-tighter">{formatDate(n.publishedAt)}</span>
                                <span className="bg-black text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                    {n.subcategory || "Info"}
                                </span>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-xl font-bold group-hover:text-accent transition-colors leading-snug">
                                    {n.title}
                                </h2>
                            </div>
                            <div className="hidden md:block ml-4 text-gray-300 group-hover:text-accent transition-all group-hover:translate-x-1">
                                →
                            </div>
                        </Link>
                    ))}
                </div>

                {data.contents.length === 0 && (
                    <div className="text-center py-20 text-gray-400 font-bold">
                        現在、お知らせはありません。
                    </div>
                )}
            </div>
        </main>
    );
}
