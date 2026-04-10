import { prisma } from "@/lib/prisma";
import ExamStoreClient from "./ExamStoreClient";

export const metadata = {
  title: "教材ストア | AcadeMina",
};

export const revalidate = 60; // 60秒ごとに裏側でキャッシュを最新化する（DBアクセス負荷を激減）

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