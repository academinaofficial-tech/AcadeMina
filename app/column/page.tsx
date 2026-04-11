import { getArticles } from "@/lib/cms";
import Link from "next/link";
import ColumnClient from "./ColumnClient";

export const metadata = {
  title: "大学院受験コラム｜院試対策・研究室選び・研究計画書の書き方まとめ",
  description: "院試の勉強法、研究室選びのポイント、研究計画書の書き方など、大学院受験に役立つコラムを発信しています。難関大合格者のリアルな経験をもとにした情報で、院試突破をサポートします。",
};

export default async function Page() {
  const data = await getArticles({ limit: 100 });

  // ① categoryの中にある article_type が "column" のものだけを抽出する
  const columnArticles = data.contents.filter((a: any) => {
    return a.category?.article_type === "column";
  });

  const featuredArticle = columnArticles.length > 0 ? columnArticles[0] : null;

  return (
    <main className="mt-20 md:mt-[134px] bg-gray-50/30 min-h-screen">
      <section className="pt-20 pb-16 px-10 text-center bg-white border-b border-gray-100">
        <h1 className="text-5xl font-extrabold mb-4 tracking-tight">
          Column
          <span className="sr-only">｜大学院受験コラム</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
          院試対策の戦略、合格者の体験、研究室選びのリアル。<br />
          あなたの挑戦を後押しするナレッジを発信しています。
        </p>
      </section>

      <ColumnClient
        initialArticles={columnArticles}
        featuredArticle={featuredArticle}
      />

      <section className="bg-black text-white py-24 px-10 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6">教材ストアもチェック</h2>
          <p className="text-lg text-gray-400 mb-10 leading-relaxed">
            過去問解説、研究計画書テンプレなど、院試の「武器」はこちら。
          </p>
          <Link
            className="inline-block bg-white text-black px-12 py-5 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 hover:bg-gray-100"
            href="/exam-store"
          >
            教材ストアへ →
          </Link>
        </div>
      </section>
    </main>
  );
}