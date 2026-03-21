import { prisma } from "@/lib/prisma";
import CartClient from "./CartClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "カート｜選択中の大学院受験教材を確認・購入手続きへ",
  description:
    "カートに追加した大学院受験教材の内容と合計金額を確認できるページです。購入前に教材の組み合わせや価格を見直し、スムーズに決済へ進めます。",
};

export default async function Page() {
  // カート内の商品情報を紐付けるために全商品データを取得（あるいは必要な分だけ）
  const exams = await prisma.exam.findMany();

  return (
    <main className="mt-20 md:mt-[134px] min-h-screen bg-gray-50/30">
      <CartClient allExams={exams} />
    </main>
  );
}
