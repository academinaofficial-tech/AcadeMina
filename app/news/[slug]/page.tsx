import { getArticleBySlug } from "@/lib/cms";
import NewsDetailClient from "./NewsDetailClient";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const article = await getArticleBySlug(params.slug);
    return {
        title: `${article?.title || "お知らせ"} | AcadeMina`,
    };
}

export default async function NewsDetailPage({ params }: { params: { slug: string } }) {
    const article = await getArticleBySlug(params.slug);

    if (!article) {
        notFound();
    }

    // 💡 データの取得だけやって、実際の表示はすべて Client に任せる！
    return <NewsDetailClient article={article} />;
}