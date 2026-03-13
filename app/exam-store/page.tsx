import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ExamStoreClient from "./ExamStoreClient";

export const metadata = {
  title: "教材ストア | AcadeMina",
};

export default async function Page() {
  const exams = await prisma.exam.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mt-20 md:mt-[134px] min-h-screen bg-gray-50/50">
      <ExamStoreClient initialExams={exams} />
    </main>
  );
}
