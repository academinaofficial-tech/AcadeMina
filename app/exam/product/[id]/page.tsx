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

  // 関連商材：同じdepartmentまたは同じcategoryから最大4件
  const related = await prisma.exam.findMany({
    where: {
      id: { not: exam.id },
      OR: [
        ...(exam.deptId ? [{ deptId: exam.deptId }] : []),
        { category: exam.category },
      ],
    },
    include: {
      department: { include: { faculty: { include: { university: true } } } },
    },
    take: 4,
  });

  return (
    <main className="mt-20 md:mt-[134px] min-h-screen bg-white">

      {/* パンくず */}
      <div className="border-b border-gray-100">
        <nav className="max-w-[1200px] mx-auto py-3 px-5 md:px-10 text-xs text-gray-400 flex items-center gap-2">
          <Link href="/" className="hover:text-black transition-colors">TOP</Link>
          <span>/</span>
          <Link href="/exam-store" className="hover:text-black transition-colors">教材ストア</Link>
          <span>/</span>
          <span className="text-gray-600 truncate max-w-[240px]">{exam.title}</span>
        </nav>
      </div>

      {/* ヒーロー：フルワイド画像 */}
      <div
        className="w-full h-[300px] md:h-[420px] bg-gray-900 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${exam.image || "/placeholder.png"})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-[1200px] mx-auto px-5 md:px-10 pb-10">
          <p className="text-[0.7rem] font-bold tracking-[0.25em] uppercase text-white/60 mb-3">
            {exam.category}
          </p>
          <h1 className="text-[1.8rem] md:text-[2.6rem] font-extrabold text-white leading-[1.2] max-w-[700px]">
            {exam.title}
          </h1>
          {(university || faculty || department) && (
            <div className="flex flex-wrap gap-2 mt-4">
              {university && (
                <span className="text-xs font-bold bg-white text-black px-3 py-1.5 tracking-wide">
                  {university}
                </span>
              )}
              {faculty && (
                <span className="text-xs font-bold border border-white/50 text-white/80 px-3 py-1.5">
                  {faculty}
                </span>
              )}
              {department && (
                <span className="text-xs font-bold border border-white/50 text-white/80 px-3 py-1.5">
                  {department}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 本体 */}
      <div className="max-w-[1200px] mx-auto px-5 md:px-10">
        <div className="flex flex-col lg:flex-row gap-16 py-16">

          {/* 左：説明 + 収録内容 */}
          <div className="flex-1 min-w-0">

            {/* 著者 */}
            {exam.author && (
              <p className="text-sm text-gray-400 mb-10">
                著者：<span className="text-black font-semibold">{exam.author}</span>
              </p>
            )}

            {/* 説明文 */}
            {exam.description && (
              <section className="mb-14">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-[0.65rem] font-bold tracking-[0.25em] uppercase text-gray-400">Overview</span>
                  <div className="flex-1 h-px bg-gray-100" />
                </div>
                <p className="text-[1rem] text-gray-700 leading-[2.1]">
                  {exam.description}
                </p>
              </section>
            )}

            {/* 収録内容 */}
            {exam.contents && exam.contents.length > 0 && (
              <section className="mb-14">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-[0.65rem] font-bold tracking-[0.25em] uppercase text-gray-400">Contents</span>
                  <div className="flex-1 h-px bg-gray-100" />
                </div>
                <ul className="space-y-0 border-t border-gray-100">
                  {exam.contents.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-4 py-4 border-b border-gray-100 text-sm text-gray-700"
                    >
                      <span className="text-[0.65rem] font-bold text-gray-300 w-5 shrink-0 text-right">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* プレビュー */}
            {exam.preview && (
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-[0.65rem] font-bold tracking-[0.25em] uppercase text-gray-400">Sample</span>
                  <div className="flex-1 h-px bg-gray-100" />
                </div>
                <div className="bg-gray-50 border-l-4 border-black px-8 py-8 text-[0.9rem] text-gray-700 leading-[2] whitespace-pre-wrap">
                  {exam.preview}
                </div>
              </section>
            )}
          </div>

          {/* 右：購入ボックス（sticky） */}
          <div className="w-full lg:w-[300px] shrink-0">
            <div className="lg:sticky lg:top-[160px] border border-gray-200 p-8">
              <p className="text-[0.65rem] font-bold tracking-[0.25em] uppercase text-gray-400 mb-2">Price</p>
              <p className="text-[2.4rem] font-extrabold text-black mb-1 leading-none">
                ¥{exam.price.toLocaleString()}
              </p>
              <p className="text-xs text-gray-400 mb-8">税込</p>

              {isPurchased ? (
                <div className="w-full py-4 text-center border-2 border-green-500 text-green-600 font-bold text-sm tracking-widest">
                  ✓ 購入済み
                </div>
              ) : (
                <AddToCartButton examId={exam.id} />
              )}

              <p className="text-xs text-gray-400 text-center mt-4 leading-relaxed">
                カートに追加後、<br />購入手続きへ進めます
              </p>

              {/* 区切り */}
              <div className="border-t border-gray-100 mt-8 pt-6 space-y-3 text-xs text-gray-400">
                {university && (
                  <div className="flex justify-between">
                    <span>大学</span>
                    <span className="text-black font-semibold">{university}</span>
                  </div>
                )}
                {faculty && (
                  <div className="flex justify-between">
                    <span>研究科</span>
                    <span className="text-black font-semibold">{faculty}</span>
                  </div>
                )}
                {department && (
                  <div className="flex justify-between">
                    <span>専攻</span>
                    <span className="text-black font-semibold">{department}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>カテゴリ</span>
                  <span className="text-black font-semibold">{exam.category}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* こちらもおすすめ */}
      {related.length > 0 && (
        <div className="border-t border-gray-100">
          <div className="max-w-[1200px] mx-auto px-5 md:px-10 py-16">
            <div className="flex items-center gap-4 mb-10">
              <span className="text-[0.65rem] font-bold tracking-[0.25em] uppercase text-gray-400">Related</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>
            <h2 className="text-xl font-extrabold mb-10">こちらもおすすめ</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {related.map((item) => {
                const itemUniv = item.department?.faculty?.university?.name;
                return (
                  <Link
                    key={item.id}
                    href={`/exam/product/${item.id}`}
                    className="group block"
                  >
                    <div
                      className="w-full aspect-[4/3] bg-gray-100 bg-cover bg-center mb-4 overflow-hidden"
                      style={{ backgroundImage: `url(${item.image || "/placeholder.png"})` }}
                    >
                      <div className="w-full h-full group-hover:scale-105 transition-transform duration-500 bg-cover bg-center"
                        style={{ backgroundImage: `url(${item.image || "/placeholder.png"})` }}
                      />
                    </div>
                    <p className="text-[0.65rem] font-bold tracking-widest uppercase text-gray-400 mb-1">{item.category}</p>
                    <p className="text-sm font-bold text-black leading-snug line-clamp-2 mb-2 group-hover:opacity-60 transition-opacity">{item.title}</p>
                    {itemUniv && <p className="text-xs text-gray-400">{itemUniv}</p>}
                    <p className="text-sm font-extrabold text-black mt-1">¥{item.price.toLocaleString()}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
