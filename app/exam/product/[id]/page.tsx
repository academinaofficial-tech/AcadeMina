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
    title: exam?.title ? `${exam.title} | AcadeMina` : "教材詳細 | AcadeMina",
    description: exam?.description || "大学院受験の過去問・対策教材詳細ページです。",
  };
}

export default async function ExamDetailPage({ params }: { params: { id: string } }) {
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  const profile = await prisma.profile.findUnique({ where: { id: userId } });
  if (!profile) redirect(`/onboarding?redirect=/exam/product/${params.id}`);

  const exam = await prisma.exam.findUnique({
    where: { id: params.id },
    include: {
      department: {
        include: { faculty: { include: { university: true } } },
      },
    },
  });

  if (!exam) redirect("/exam-store");

  const university = exam.department?.faculty?.university?.name;
  const faculty = exam.department?.faculty?.name;
  const department = exam.department?.name;

  const purchase = await prisma.purchase.findFirst({
    where: { profileId: userId, examId: exam.id },
  });
  const isPurchased = !!purchase;

  return (
    <main className="mt-20 md:mt-[134px] min-h-screen bg-white">

      {/* パンくず */}
      <div className="border-b border-gray-100">
        <nav className="max-w-[1100px] mx-auto py-3 px-5 md:px-10 text-xs text-gray-400 flex items-center gap-2">
          <Link href="/" className="hover:text-black transition-colors">TOP</Link>
          <span>/</span>
          <Link href="/exam-store" className="hover:text-black transition-colors">教材ストア</Link>
          <span>/</span>
          <span className="text-gray-600 truncate max-w-[240px]">{exam.title}</span>
        </nav>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-[1100px] mx-auto px-5 md:px-10 py-16">
        <div className="flex flex-col lg:flex-row gap-16">

          {/* 左：画像 */}
          <div className="w-full lg:w-[480px] shrink-0">
            <div
              className="w-full aspect-[4/3] bg-gray-100 bg-cover bg-center"
              style={{ backgroundImage: `url(${exam.image || "/placeholder.png"})` }}
            />
            {/* 大学バッジ群 */}
            {(university || faculty || department) && (
              <div className="flex flex-wrap gap-2 mt-5">
                {university && (
                  <span className="text-xs font-bold bg-black text-white px-3 py-1.5 rounded-sm tracking-wide">
                    {university}
                  </span>
                )}
                {faculty && (
                  <span className="text-xs font-bold border border-gray-300 text-gray-600 px-3 py-1.5 rounded-sm">
                    {faculty}
                  </span>
                )}
                {department && (
                  <span className="text-xs font-bold border border-gray-300 text-gray-600 px-3 py-1.5 rounded-sm">
                    {department}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* 右：情報 */}
          <div className="flex-1 flex flex-col">

            {/* カテゴリ */}
            <p className="text-[0.75rem] font-bold tracking-[0.2em] uppercase text-gray-400 mb-3">
              {exam.category}
            </p>

            {/* タイトル */}
            <h1 className="text-[1.8rem] md:text-[2.2rem] font-extrabold leading-[1.25] mb-6 text-black">
              {exam.title}
            </h1>

            {/* 著者 */}
            {exam.author && (
              <p className="text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">
                著者：<span className="text-black font-semibold">{exam.author}</span>
              </p>
            )}

            {/* 説明 */}
            {exam.description && (
              <p className="text-[0.95rem] text-gray-600 leading-[1.9] mb-8">
                {exam.description}
              </p>
            )}

            {/* 収録内容 */}
            {exam.contents && exam.contents.length > 0 && (
              <div className="mb-8">
                <p className="text-[0.7rem] font-bold tracking-[0.2em] uppercase text-gray-400 mb-4">
                  収録内容
                </p>
                <ul className="space-y-2.5">
                  {exam.contents.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-black shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 価格・購入 */}
            <div className="mt-auto pt-8 border-t border-gray-100">
              <div className="flex items-center justify-between mb-5">
                <span className="text-[0.75rem] font-bold tracking-widest uppercase text-gray-400">価格</span>
                <span className="text-[2rem] font-extrabold text-black tracking-tight">
                  ¥{exam.price.toLocaleString()}
                  <span className="text-sm font-normal text-gray-400 ml-1">（税込）</span>
                </span>
              </div>

              {isPurchased ? (
                <div className="w-full py-4 text-center border-2 border-green-500 text-green-600 font-bold rounded-sm text-sm tracking-wide">
                  ✓ 購入済み
                </div>
              ) : (
                <AddToCartButton examId={exam.id} />
              )}

              <p className="text-xs text-gray-400 text-center mt-3">
                カートに追加後、購入手続きへ進めます
              </p>
            </div>
          </div>
        </div>

        {/* プレビュー */}
        {exam.preview && (
          <div className="mt-20 pt-16 border-t border-gray-100">
            <p className="text-[0.75rem] font-bold tracking-[0.2em] uppercase text-gray-400 mb-6">
              Sample Preview
            </p>
            <h2 className="text-xl font-extrabold mb-8">サンプル・プレビュー</h2>
            <div className="bg-gray-50 p-8 md:p-12 text-[0.9rem] text-gray-700 leading-[2] whitespace-pre-wrap">
              {exam.preview}
            </div>
          </div>
        )}

        {/* 戻るリンク */}
        <div className="mt-16 pt-10 border-t border-gray-100">
          <Link
            href="/exam-store"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-black transition-colors font-medium"
          >
            ← 教材ストアに戻る
          </Link>
        </div>
      </div>
    </main>
  );
}
