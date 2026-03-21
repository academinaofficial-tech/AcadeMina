import { prisma } from "@/lib/prisma";
import OrderCompleteClient from "./OrderCompleteClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "購入完了｜大学院受験教材のご購入ありがとうございます",
  description:
    "大学院受験教材の購入が完了しました。購入済み教材の確認方法や次に進むべき学習ステップも案内しており、受験準備をすぐに始められます。",
};

export default async function Page() {
  const exams = await prisma.exam.findMany();

  return (
    <main className="mt-20 md:mt-[134px] min-h-screen bg-gray-50/50">
      <OrderCompleteClient allExams={exams} />
    </main>
  );
}
