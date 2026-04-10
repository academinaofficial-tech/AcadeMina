import type { Metadata } from "next";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
// 👇 波括弧付きの正しいインポート！
import { prisma } from "@/lib/prisma";
import DownloadPdfButton from "./DownloadPdfButton";

export const metadata: Metadata = {
  title: "マイページ | AcadeMina",
};

// コンテンツを混ぜるための共通の型
type MixedContent = {
  id: string;
  title: string;
  category: string;
  imageUrl: string | null;
  date: Date;
  link: string;
  source: "exam" | "microcms";
};

export default async function MyPage() {
  // ==========================================
  // 🚨 1. 関所（ログイン＆オンボーディング確認）
  // ==========================================
  const user = await currentUser();
  if (!user) {
    return (
      <main className="min-h-screen bg-gray-50 pt-[180px] pb-24 text-center">
        <h1 className="text-2xl font-bold">ログインが必要です</h1>
        <Link href="/account/login" className="text-accent underline">ログイン画面へ</Link>
      </main>
    );
  }

  const email = user.emailAddresses[0]?.emailAddress;
  const profile = await prisma.profile.findFirst({
    where: { OR: [{ id: user.id }, ...(email ? [{ email }] : [])] },
    include: { purchases: { include: { exam: true } } }
  });

  if (!profile) {
    redirect("/onboarding");
  }

  // 自分が投稿した質問 & 回答した質問
  const [myQuestions, answeredQuestions] = await Promise.all([
    prisma.question.findMany({
      where: { profileId: user.id },
      include: {
        category: true,
        _count: { select: { answers: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.question.findMany({
      where: { answers: { some: { profileId: user.id } } },
      include: {
        category: true,
        _count: { select: { answers: true } },
      },
      orderBy: { updatedAt: "desc" },
      take: 20,
    }),
  ]);

  // ==========================================
  // 2. コンテンツの取得（Prisma ＋ microCMS）
  // ==========================================
  let mixedContents: MixedContent[] = [];

  // ① Prismaから「新着教材」を取得
  const latestExams = await prisma.exam.findMany({
    orderBy: { createdAt: "desc" },
    take: 3,
  });
  
  const examContents: MixedContent[] = latestExams.map(exam => ({
    id: exam.id,
    title: exam.title,
    category: exam.category || "教材",
    imageUrl: exam.image,
    date: exam.createdAt,
    link: `/exam/product/${exam.id}`,
    source: "exam",
  }));
  mixedContents = [...mixedContents, ...examContents];

  // ② microCMSから「コラム・合格体験記」を取得
  const endpoint = "columns"; 
  const domain = process.env.MICROCMS_SERVICE_ID;
  const apiKey = process.env.MICROCMS_API_KEY;

  if (domain && apiKey) {
    try {
      const res = await fetch(`https://${domain}.microcms.io/api/v1/${endpoint}?limit=3`, {
        headers: { "X-MICROCMS-API-KEY": apiKey },
        next: { revalidate: 60 } 
      });

      if (res.ok) {
        const data = await res.json();
        const cmsContents: MixedContent[] = data.contents.map((item: any) => {
          const articleType = item.category?.article_type || "";
          const displayCategory = item.category?.category || articleType || "コンテンツ";

          let linkPath = `/column-detail?id=${item.id}`; 
          if (articleType === "合格体験記" || articleType === "合格体験機") {
            linkPath = `/story-detail?id=${item.id}`;
          }

          return {
            id: item.id,
            title: item.title,
            category: displayCategory,
            imageUrl: item.eyecatch?.url || null,
            date: new Date(item.publishedAt || item.createdAt),
            link: linkPath,
            source: "microcms",
          };
        });
        
        mixedContents = [...mixedContents, ...cmsContents];
      }
    } catch (error) {
      console.error("❌ 通信に失敗しました:", error);
    }
  }

  // ③ 混ぜたコンテンツを「日付の新しい順」に並び替えて、上位3件だけ残す
  mixedContents.sort((a, b) => b.date.getTime() - a.date.getTime());
  const displayContents = mixedContents.slice(0, 3);

  // 表示用の変数準備
  const userName = profile.firstName ? `${profile.lastName} ${profile.firstName}` : user.firstName || user.username || "ゲスト";
  const purchases = profile.purchases || [];

  return (
    <main className="min-h-screen bg-gray-50 pt-[180px] pb-24">
      <div className="max-w-[1200px] mx-auto px-5">

        {/* --- プロフィールセクション --- */}
        <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10 mb-8 flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
          <div className="w-28 h-28 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full flex items-center justify-center text-accent text-4xl font-extrabold shadow-inner shrink-0 z-10">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 text-center md:text-left z-10 w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <h1 className="text-3xl md:text-4xl font-extrabold text-black tracking-tight">
                ようこそ、{userName} さん
              </h1>
              <Link href="/onboarding" className="text-sm font-bold text-gray-500 hover:text-black underline transition-colors whitespace-nowrap">
                ⚙️ プロフィール編集
              </Link>
            </div>
            <p className="text-gray-700 mb-6 font-bold text-lg">
              {profile.university} {profile.faculty || ""} {profile.department || ""} ({profile.grade})
            </p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <span className="bg-blue-50 border border-blue-100 text-blue-700 px-4 py-2 rounded-xl font-bold text-sm">
                🎯 目標: {profile.targetUniversity || "未設定"}
              </span>
              <span className="bg-gray-100 border border-gray-200 text-gray-700 px-4 py-2 rounded-xl font-bold text-sm">
                💡 興味: {profile.interests.length > 0 ? profile.interests.join(" / ") : "未設定"}
              </span>
            </div>
          </div>
        </section>

        {/* 2カラムレイアウト */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 左側カラム (購入履歴) */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 relative overflow-hidden group">
              <h2 className="text-2xl font-black border-b-4 border-black pb-3 mb-8 inline-block tracking-tight">
                購入済みの教材
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 z-10 relative">
                {purchases.length > 0 ? (
                  purchases.map(p => (
                    <Link key={p.id} href={`/exam/product/${p.examId}`} className="block border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:border-accent/30 transition-all bg-white group/card">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-accent text-white text-[0.7rem] font-bold px-2 py-1 rounded-md tracking-wider">PURCHASED</span>
                      </div>
                      <h3 className="font-extrabold text-lg mb-3 leading-snug group-hover/card:text-accent transition-colors">{p.exam.title}</h3>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{p.exam.category}</div>
                      <div className="mt-4 text-xs text-gray-400 font-bold">購入日: {new Date(p.createdAt).toLocaleDateString()}</div>
                      
                      <DownloadPdfButton examId={p.examId} hasPdfKey={!!p.exam.pdfKey} />
                    </Link>
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center border-2 border-dashed border-gray-100 rounded-2xl">
                    <p className="text-gray-400 font-bold">購入済みの教材はありません</p>
                    <Link href="/exam-store" className="inline-block mt-4 text-sm font-black text-accent hover:underline">
                      教材ストアへ進む →
                    </Link>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* 右側カラム */}
          <div className="space-y-8">
            {/* 投稿した質問 */}
            <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-7">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black">📝 投稿した質問</h2>
                <Link href="/exam/qa/new" className="text-xs font-bold text-accent hover:underline">
                  ＋ 質問する
                </Link>
              </div>
              {myQuestions.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-400 mb-3">まだ質問がありません</p>
                  <Link href="/exam/qa/new" className="text-sm font-bold text-accent hover:underline">
                    最初の質問を投稿する →
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {myQuestions.map((q) => (
                    <Link key={q.id} href={`/exam/qa/${q.id}`} className="block group">
                      <div className="border border-gray-100 rounded-xl p-4 hover:border-text/20 transition-colors">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-bold text-accent">{q.category.name}</span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                            q._count.answers > 0
                              ? "bg-accent/10 text-accent"
                              : "bg-gray-100 text-gray-400"
                          }`}>
                            {q._count.answers > 0 ? `回答${q._count.answers}件` : "未回答"}
                          </span>
                        </div>
                        <p className="text-sm font-bold line-clamp-2 group-hover:text-text transition-colors leading-snug">
                          {q.title}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            {/* 回答した質問 */}
            <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-7">
              <h2 className="text-xl font-black mb-6">💬 回答した質問</h2>
              {answeredQuestions.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">まだ回答した質問はありません</p>
              ) : (
                <div className="space-y-3">
                  {answeredQuestions.map((q) => (
                    <Link key={q.id} href={`/exam/qa/${q.id}`} className="block group">
                      <div className="border border-gray-100 rounded-xl p-4 hover:border-text/20 transition-colors">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-bold text-accent">{q.category.name}</span>
                          <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">{q._count.answers}件</span>
                        </div>
                        <p className="text-sm font-bold line-clamp-2 group-hover:text-text transition-colors leading-snug">
                          {q.title}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-7">
              <h2 className="text-xl font-black mb-6 flex items-center gap-2">
                ⚡️ おすすめコンテンツ
              </h2>
              <div className="space-y-5">
                {displayContents.length > 0 ? (
                  displayContents.map(content => (
                    <Link key={content.id} href={content.link} className="flex gap-4 group">
                      <div className="w-[84px] h-[84px] bg-gray-100 rounded-xl shrink-0 overflow-hidden relative border border-gray-200 group-hover:border-accent/40 transition-colors">
                        {content.imageUrl ? (
                          <img src={content.imageUrl} alt={content.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-bold text-xs bg-gradient-to-br from-gray-50 to-gray-200">IMG</div>
                        )}
                      </div>
                      <div className="flex flex-col justify-center">
                        <p className={`text-[0.65rem] font-extrabold tracking-wide mb-1 uppercase ${content.source === 'microcms' ? 'text-blue-500' : 'text-accent'}`}>
                          {content.category}
                        </p>
                        <h3 className="font-extrabold text-sm group-hover:text-accent group-hover:underline line-clamp-2 leading-tight">
                          {content.title}
                        </h3>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 font-bold text-center py-4">コンテンツはまだありません。</p>
                )}
              </div>
            </section>
          </div>

        </div>
      </div>
    </main>
  );
}