import { prisma } from "@/lib/prisma";
import ExamStoreClient from "./ExamStoreClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "大学院受験の教材ストア｜過去問・解答・対策問題を探すならAcadeMina",
  description:
    "大学院受験向けの過去問、解答例、院試対策教材を検索・比較できる教材ストアです。大学・研究科・専攻で絞り込みながら、自分に合う教材を効率よく見つけられます。",
};

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