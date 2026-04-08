import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import Link from "next/link";
import AddToCartButton from "./AddToCartButton";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const exam = await prisma.exam.findUnique({
    where: { id: params.id },
    include: { department: { include: { faculty: { include: { university: true } } } } },
  });
  return {
    title: exam?.title
      ? `${exam.title} | AcadeMina`
      : "教材詳細 | AcadeMina",
    description: exam?.description || "大学院受験の過去問・対策教材詳細ページです。",
  };
}

export default async function ExamDetailPage({ params }: { params: { id: string } }) {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const profile = await prisma.profile.findUnique({ where: { id: userId } });
  if (!profile) {
    redirect(`/onboarding?redirect=/exam/product/${params.id}`);
  }

  const exam = await prisma.exam.findUnique({
    where: { id: params.id },
    include: {
      department: {
        include: {
          faculty: {
            include: { university: true },
          },
        },
      },
    },
  });

  if (!exam) {
    redirect("/exam-store");
  }

  const university = exam.department?.faculty?.university?.name;
  const faculty = exam.department?.faculty?.name;
  const department = exam.department?.name;

  // 購入済みかチェック
  const purchase = await prisma.purchase.findFirst({
    where: { profileId: userId, examId: exam.id },
  });
  const isPurchased = !!purchase;

  return (
    <main className="mt-20 md:mt-[134px] min-h-screen bg-gray-50/50">
      {/* パンくず */}
      <nav className="py-4 px-6 md:px-10 text-xs text-gray-400 bg-white border-b border-gray-100 flex items-center gap-2">
        <Link href="/" className="hover:text-accent transition-colors">TOP</Link>
        <span>&gt;</span>
        <Link href="/exam-store" className="hover:text-accent transition-colors">教材ストア</Link>
        <span>&gt;</span>
        <span className="text-gray-600 truncate max-w-[200px]">{exam.title}</span>
      </nav>

      <div className="max-w-[1000px] mx-auto py-12 px-5">
        <div className="flex flex-col md:flex-row gap-10">

          {/* 左：画像 */}
          <div className="w-full md:w-[380px] shrink-0">
            <div
              className="w-full aspect-[4/3] rounded-xl bg-gray-200 bg-cover bg-center shadow"
              style={{ backgroundImage: `url(${exam.image || "/placeholder.png"})` }}
            />
          </div>

          {/* 右：詳細 */}
          <div className="flex-1">
            {/* カテゴリ */}
            <div className="text-xs font-bold text-accent uppercase mb-2">{exam.category}</div>

            {/* タイトル */}
            <h1 className="text-2xl md:text-3xl font-extrabold mb-4 leading-tight">{exam.title}</h1>

            {/* 大学バッジ */}
            {(university || faculty || department) && (
              <div className="flex flex-wrap gap-2 mb-5">
                {university && <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full">{university}</span>}
                {faculty && <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">{faculty}</span>}
                {department && <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">{department}</span>}
              </div>
            )}

            {/* 著者 */}
            {exam.author && (
              <p className="text-sm text-gray-500 mb-4">著者：{exam.author}</p>
            )}

            {/* 説明 */}
            {exam.description && (
              <p className="text-gray-700 leading-relaxed mb-6">{exam.description}</p>
            )}

            {/* 収録内容 */}
            {exam.contents && exam.contents.length > 0 && (
              <div className="mb-6">
                <h2 className="font-bold text-sm mb-2 text-gray-500 uppercase tracking-wide">収録内容</h2>
                <ul className="space-y-1">
                  {exam.contents.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-accent font-bold mt-0.5">→</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 価格 + カートボタン */}
            <div className="border-t pt-6 mt-2 flex items-center gap-6">
              <span className="text-3xl font-extrabold">¥{exam.price.toLocaleString()}</span>
              {isPurchased ? (
                <span className="px-6 py-3 bg-green-100 text-green-700 rounded-full font-bold text-sm">購入済み</span>
              ) : (
                <AddToCartButton examId={exam.id} />
              )}
            </div>
          </div>
        </div>

        {/* プレビュー */}
        {exam.preview && (
          <div className="mt-14">
            <h2 className="text-xl font-extrabold mb-4 border-b-2 border-text pb-3">サンプル・プレビュー</h2>
            <div className="bg-white rounded-xl border p-6 text-gray-700 leading-relaxed whitespace-pre-wrap">
              {exam.preview}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
