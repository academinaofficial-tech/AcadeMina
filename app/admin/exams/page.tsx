import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import DownloadPdfButton from "@/app/mypage/DownloadPdfButton";

export const metadata = { title: "教材一覧 | Admin | AcadeMina" };

export default async function AdminExamsPage() {
  const user = await currentUser();
  const isAdmin = (user?.publicMetadata as any)?.role === "admin";
  if (!isAdmin) redirect("/");

  const exams = await prisma.exam.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      department: {
        include: { faculty: { include: { university: true } } },
      },
    },
  });

  return (
    <main className="mt-20 md:mt-[134px] min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-800">教材一覧</h1>
          <Link
            href="/admin/exams/new"
            className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + 教材を追加
          </Link>
        </div>

        {exams.length === 0 ? (
          <p className="text-gray-400 text-center py-20">教材がまだ登録されていません</p>
        ) : (
          <div className="space-y-3">
            {exams.map((exam) => {
              const university = exam.department?.faculty?.university?.name;
              const faculty = exam.department?.faculty?.name;
              const dept = exam.department?.name;
              const location = [university, faculty, dept].filter(Boolean).join(" › ");

              return (
                <div
                  key={exam.id}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-4 flex items-center gap-4"
                >
                  {exam.image && (
                    <img
                      src={exam.image}
                      alt={exam.title}
                      className="w-14 h-14 object-cover rounded-lg flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate">{exam.title}</p>
                    {location && (
                      <p className="text-xs text-gray-400 mt-0.5">{location}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-0.5">¥{exam.price.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <DownloadPdfButton examId={exam.id} hasPdfKey={!!exam.pdfKey} />
                    <Link
                      href={`/admin/exams/${exam.id}/edit`}
                      className="text-sm text-gray-500 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      編集
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
