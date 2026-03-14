import { getArticles, getSchools } from "@/lib/cms";
import StoryClient from "./StoryClient";

export const metadata = {
    title: "合格体験記 | AcadeMina",
};

export default async function Page() {
    // 1. 体験記の記事を取得
    const data = await getArticles({ limit: 100 });
    const storyArticles = data.contents.filter((a: any) => {
        return a.category?.article_type === "story";
    });

    // 2. 大学・専攻マスタの全データを取得
    const schoolData = await getSchools(); // 💡引数なしでOKです！
    const masterSchools = schoolData.contents || [];

    return (
        <main className="mt-20 md:mt-[134px] bg-gray-50/30 min-h-screen">
            <section className="pt-20 pb-16 px-10 text-center bg-white border-b border-gray-100">
                <h1 className="text-5xl font-extrabold mb-4 tracking-tight">Success Stories</h1>
                <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
                    難関大学院を突破した先輩たちのリアルな軌跡。<br />
                    志望校の体験記を絞り込んで、合格へのヒントを見つけましょう。
                </p>
            </section>

            <StoryClient 
                initialArticles={storyArticles} 
                masterSchools={masterSchools} 
            />
        </main>
    );
}