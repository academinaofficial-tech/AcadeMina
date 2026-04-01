import { getArticleBySlug } from "@/lib/cms";
import NewsDetailClient from "./NewsDetailClient";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const article = await getArticleBySlug(params.slug);
    const title = article?.title || "お知らせ";
    const description = article?.metaDescription || article?.description || undefined;
    const ogImage = article?.eyecatch?.url;

    return {
        title: `${title} | AcadeMina`,
        ...(description ? { description } : {}),
        openGraph: {
            title: `${title} | AcadeMina`,
            ...(description ? { description } : {}),
            ...(ogImage ? { images: [{ url: ogImage }] } : {}),
        },
        twitter: {
            card: "summary_large_image",
            title: `${title} | AcadeMina`,
            ...(ogImage ? { images: [ogImage] } : {}),
        },
    };
}

export default async function NewsDetailPage({ params }: { params: { slug: string } }) {
    const article = await getArticleBySlug(params.slug);

    if (!article) {
        notFound();
    }

    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.title,
        datePublished: article.publishedAt,
        author: { "@type": "Organization", name: "AcadeMina" },
        publisher: {
            "@type": "Organization",
            name: "AcadeMina",
            logo: { "@type": "ImageObject", url: "https://www.academina.com/images/icon.png" },
        },
        ...(article.eyecatch ? { image: article.eyecatch.url } : {}),
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            />
            <NewsDetailClient article={article} />
        </>
    );
}