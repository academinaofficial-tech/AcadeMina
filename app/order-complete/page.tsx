import { prisma } from "@/lib/prisma";
import OrderCompleteClient from "./OrderCompleteClient";

export const metadata = {
  title: "購入完了 | AcadeMina",
};

export default async function Page() {
  const exams = await prisma.exam.findMany();

  return (
    <main className="mt-20 md:mt-[134px] min-h-screen bg-gray-50/50">
      <OrderCompleteClient allExams={exams} />
    </main>
  );
}
