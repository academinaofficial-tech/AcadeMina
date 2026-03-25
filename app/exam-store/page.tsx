import { prisma } from "@/lib/prisma";
import ExamStoreClient from "./ExamStoreClient";
import type { Metadata } from "next";

// 💡 修正箇所：タイトルと説明文を変数にして、OGPにも使い回すようにしました！
const pageTitle = "大学院受験の教材ストア｜過去問・解答・対策問題を探すならAcadeMina";
const pageDescription = "大学院受験向けの過去問、解答例、院試対策教材を検索・比較できる教材ストアです。大学・研究科・専攻で絞り込みながら、自分に合う教材を効率よく見つけられます。";
const imageUrl = "/images/icon.png"; // 💡 もしストア専用のバナー画像があれば、ここにそのパスを入れます

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    images: [imageUrl],
  },
  twitter: {
    card: "summary_large_image", // 💡 SNSで画像を大きく目立たせる
    title: pageTitle,
    description: pageDescription,
    images: [imageUrl],
  },
};

// ==========================================
// 画面表示用コンポーネント（変更なし）
// ==========================================
export default async function Page() {
  const exams = await prisma.exam.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      department: {
        include: {
          faculty: {
            include: {
              university: true,
            },
          },
        },
      },
    },
  });

  return (
    <main className="mt-20 md:mt-[134px] min-h-screen bg-gray-50/50">
      <ExamStoreClient initialExams={exams} />
    </main>
  );
}