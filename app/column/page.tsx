import { getArticles } from "@/lib/cms";
import Link from "next/link";
import ColumnClient from "./ColumnClient";
import Typography from "@/components/ui/Typography";
import { Section, Container } from "@/components/ui/Section";

export const metadata = {
  title: "Column | AcadeMina",
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
      <Section spacing="none" className="pt-20 pb-16 px-10 text-center bg-white border-b border-gray-100">
        <Typography variant="h1" className="mb-4">Column</Typography>
        <Typography variant="body-lg" className="max-w-2xl mx-auto">
          院試対策の戦略、合格者の体験、研究室選びのリアル。<br />
          あなたの挑戦を後押しするナレッジを発信しています。
        </Typography>
      </Section>

      <ColumnClient
        initialArticles={columnArticles}
        featuredArticle={featuredArticle}
      />

      <Section className="bg-black text-white text-center">
        <Container variant="narrow">
          <Typography variant="h2" className="mb-6">教材ストアもチェック</Typography>
          <Typography variant="body-lg" className="text-gray-400 mb-10">
            過去問解説、研究計画書テンプレなど、院試の「武器」はこちら。
          </Typography>
          <Link
            className="inline-block bg-white text-black px-12 py-5 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 hover:bg-gray-100"
            href="/exam-store"
          >
            教材ストアへ →
          </Link>
        </Container>
      </Section>
    </main>
  );
}