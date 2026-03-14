import { prisma } from "@/lib/prisma";
import CartClient from "./CartClient";

export const metadata = {
  title: "カート | AcadeMina",
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
