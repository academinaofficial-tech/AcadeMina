import { getArticleBySlug } from "@/lib/cms";
import StoryDetailClient from "./StoryDetailClient";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const articleSlug = params.slug;
  const article = await getArticleBySlug(articleSlug);

  const title = article?.title || "合格体験記";
  const school = article?.school_info || article;
  const descParts = [
    school?.university,
    school?.faculty,
    school?.major,
  ].filter(Boolean).join(" ");
  const description = descParts
    ? `${descParts}への合格体験記。${title} | AcadeMina`
    : `${title} | 大学院合格者の体験記 | AcadeMina`;
  const ogImage = article?.eyecatch?.url;

  return {
    title: `${title} | AcadeMina`,
    description,
    openGraph: {
      title: `${title} | AcadeMina`,
      description,
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | AcadeMina`,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

export default async function Page({ params }: { params: { slug: string } }) {
  // ✅ ログイン済みかチェック（middlewareで強制されるが念のため）
  const { userId } = auth();
  if (!userId) {
    redirect("/account/login");
  }

  // ✅ オンボーディング済みかチェック（Profileレコードの有無）
  const profile = await prisma.profile.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  if (!profile) {
    // 未回答 → オンボーディングへ飛ばす（戻りURLをクエリで渡す）
    redirect(`/onboarding?redirect=/story/${params.slug}`);
  }

  // ✅ 記事データ取得
  const articleSlug = params.slug;
  const article = await getArticleBySlug(articleSlug);

  return (
    <main className="mt-20 md:mt-[134px] min-h-screen">
      <nav className="py-4 px-6 md:px-10 text-xs text-gray-400 bg-gray-50/50 border-b border-gray-100 flex items-center gap-2 overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-accent font-medium transition-colors">TOP</Link>
        <span>&gt;</span>
        <Link href="/story" className="hover:text-accent font-medium transition-colors">Story</Link>
        <span>&gt;</span>
        <span className="font-semibold text-gray-600 truncate max-w-[200px]">{article?.title}</span>
      </nav>

      <StoryDetailClient article={article} />
    </main>
  );
}