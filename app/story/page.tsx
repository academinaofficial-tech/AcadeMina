import { getArticles, getSchools } from "@/lib/cms";
import StoryClient from "./StoryClient";
import { prisma } from "@/lib/prisma";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "大学院の合格体験記一覧｜大学・研究科別に先輩のリアルな院試対策を検索",
  description:
    "大学院受験を突破した先輩たちの合格体験記を一覧で読めるページです。大学・研究科・専攻ごとに絞り込みながら、勉強法、面接対策、研究計画書の実例を探せます。",
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