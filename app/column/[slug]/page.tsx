import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticles } from "@/lib/cms"; // 🔥 張本さんの自作関数を読み込む！
import ColumnDetailClient from "./ColumnDetailClient";

// ==========================================
// 📦 型定義
// ==========================================
type ColumnArticle = {
  id: string;
  title: string;
  metaDescription: string;
  eyecatch?: { url: string; width: number; height: number };
  slug: string;
  content: string;
  publishedAt: string;
  category?: { category: string; article_type: string };
  author?: string;
};

// ==========================================
// 🔍 microCMSから「スラッグ」で記事を検索・取得する関数
// ==========================================
async function getColumnBySlug(slug: string): Promise<ColumnArticle | null> {
  // 🔥 張本さんの getArticles 関数を使ってスラッグ検索をかける
  const data = await getArticles({
    filters: `slug[equals]${slug}`,
    limit: 1,
  });
  
  if (data && data.contents && data.contents.length > 0) {
    return data.contents[0];
  }
  return null;
}

// ==========================================
// 🌍 SEO（メタディスクリプション・OGP）の自動設定
// ==========================================
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await getColumnBySlug(params.slug);

  if (!article) {
    return { title: "記事が見つかりません | AcadeMina" };
  }

  return {
    title: `${article.title} | AcadeMina`,
    description: article.metaDescription, // メタディスクリプション反映
    openGraph: {
      title: `${article.title} | AcadeMina`,
      description: article.metaDescription,
      images: article.eyecatch ? [article.eyecatch.url] : [],
    },
  };
}

// ==========================================
// 📄 ページ本体の表示処理
// ==========================================
export default async function ColumnDetailPage({ params }: { params: { slug: string } }) {
  const article = await getColumnBySlug(params.slug);

  if (!article) {
    notFound();
  }

  // クライアントコンポーネントへデータを渡す
  return <ColumnDetailClient article={article} />;
}