import { getArticleById } from "@/lib/cms";
import ColumnDetailClient from "./ColumnDetailClient";
import Link from "next/link";


export async function generateMetadata({ searchParams }: Props) {
  const articleId = searchParams.id as string;
  const article = await getArticleById(articleId);

  return {
    title: `${article?.title || "合格体験記"} | AcadeMina`,
    description: article?.meta_description || "AcadeMinaの合格体験記です。...", // 👈 ここにmicroCMSのデータをセット！
  };
}

export default async function Page({ searchParams }: { searchParams: { id: string } }) {
  const articleId = searchParams.id;
  const article = await getArticleById(articleId);

  return (
    <main className="mt-20 md:mt-[134px] min-h-screen">
      {/* Breadcrumb */}
      <nav className="py-4 px-6 md:px-10 text-xs text-gray-400 bg-gray-50/50 border-b border-gray-100 flex items-center gap-2 overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-accent font-medium transition-colors">TOP</Link>
        <span>&gt;</span>
        <Link href="/column" className="hover:text-accent font-medium transition-colors">Column</Link>
        <span>&gt;</span>
        <span className="font-semibold text-gray-600 truncate max-w-[200px]">{article?.title}</span>
      </nav>

      <ColumnDetailClient article={article} />
    </main>
  );
}
