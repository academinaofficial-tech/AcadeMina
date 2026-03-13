import type { Metadata } from "next";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "マイページ | AcadeMina",
};

export default async function MyPage() {
  const user = await currentUser();
  if (!user) {
    return (
      <main className="min-h-screen bg-gray-50 pt-[180px] pb-24 text-center">
        <h1 className="text-2xl font-bold">ログインが必要です</h1>
        <Link href="/account/login" className="text-accent underline">ログイン画面へ</Link>
      </main>
    );
  }

  // プロフィール情報の取得
  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    include: {
      purchases: {
        include: {
          exam: true
        }
      }
    }
  });

  const userName = profile?.firstName ? `${profile.lastName} ${profile.firstName}` : user.firstName || user.username || "ゲスト";
  const purchases = profile?.purchases || [];

  return (
    <main className="min-h-screen bg-gray-50 pt-[180px] pb-24">
      <div className="max-w-[1200px] mx-auto px-5">

        {/* プロフィールセクション (Header) */}
        <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10 mb-8 flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
          {/* 背景の装飾 */}
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

            {/* リアルデータ反映 */}
            <p className="text-gray-700 mb-6 font-bold text-lg">
              {profile ? `${profile.university} ${profile.department || ""} (${profile.grade})` : "プロフィール未設定"}
            </p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <span className="bg-blue-50 border border-blue-100 text-blue-700 px-4 py-2 rounded-xl font-bold text-sm">
                🎯 目標: {profile?.targetUniversity || "未設定"}
              </span>
              <span className="bg-gray-100 border border-gray-200 text-gray-700 px-4 py-2 rounded-xl font-bold text-sm">
                💡 興味: {profile?.interests.join(" / ") || "未設定"}
              </span>
            </div>
          </div>
        </section>

        {/* 2カラムレイアウト */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* 左側カラム (メインコンテンツ) */}
          <div className="lg:col-span-2 space-y-8">

            {/* 購入済みの教材 */}
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

              {/* すべて見るボタン */}
              <div className="mt-6 text-right">
                <Link href="/lab" className="text-sm font-bold text-gray-500 hover:text-black hover:underline group inline-flex items-center gap-1">
                  もっと見る <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            </section>

            {/* 予定・面談 */}
            <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-black border-b-4 border-black pb-3 mb-8 inline-block tracking-tight">
                直近の予定・面談
              </h2>
              <div className="space-y-4">

                {/* 予定がある場合 */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-5 bg-blue-50/50 rounded-2xl border border-blue-100/50 transition-colors hover:bg-blue-50">
                  <div className="bg-white border-2 border-black text-center w-[72px] h-[72px] rounded-xl flex flex-col justify-center shadow-sm shrink-0">
                    <span className="text-[0.65rem] font-black text-gray-600 tracking-widest uppercase">MAY</span>
                    <span className="text-2xl font-black leading-none mt-0.5">15</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="text-xs font-bold text-white bg-red-500 px-2.5 py-0.5 rounded-full">Zoom面談</span>
                    </div>
                    <h3 className="font-extrabold text-lg line-clamp-1">第1回 大学院進学に関する初回カウンセリング</h3>
                    <p className="text-sm font-bold text-blue-700/80 mt-1">19:00 - 20:30 • 担当メンター: 未定</p>
                  </div>
                  <button className="w-full sm:w-auto px-6 py-3 bg-black text-white font-bold rounded-xl text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-md mt-4 sm:mt-0">
                    参加リンク
                  </button>
                </div>

                {/* 予定がない場合のプレースホルダー */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-5 border border-gray-200 border-dashed rounded-2xl opacity-70 hover:opacity-100 transition-opacity">
                  <div className="bg-gray-50 border-2 border-gray-300 text-center w-[72px] h-[72px] rounded-xl flex flex-col justify-center shrink-0">
                    <span className="text-xl font-black text-gray-400">-</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-extrabold text-lg text-gray-600">現在、その他の面談予定はありません</h3>
                    <p className="text-sm font-bold text-gray-500 mt-1">AcadeMinaメンターとの進路相談を予約して、研究の第一歩を踏み出しましょう。</p>
                  </div>
                  <Link href="/order-complete" className="w-full sm:w-auto px-6 py-3 bg-white border-2 border-gray-300 font-bold text-gray-600 rounded-xl text-sm hover:border-black hover:text-black transition-colors text-center mt-4 sm:mt-0">
                    面談を予約
                  </Link>
                </div>

              </div>
            </section>
          </div>

          {/* 右側カラム (サイドバー) */}
          <div className="space-y-8">

            {/* 新着コンテンツ */}
            <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-7">
              <h2 className="text-xl font-black mb-6 flex items-center gap-2">
                ⚡️ おすすめコンテンツ
              </h2>
              <div className="space-y-5">
                <a href="#" className="flex gap-4 group">
                  <div className="w-[84px] h-[84px] bg-gray-100 rounded-xl shrink-0 overflow-hidden relative border border-gray-200 group-hover:border-accent/40 transition-colors">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-bold text-xs bg-gradient-to-br from-gray-50 to-gray-200">IMG</div>
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-[0.65rem] text-accent font-extrabold tracking-wide mb-1 uppercase">動画講義</p>
                    <h3 className="font-extrabold font-sm group-hover:text-accent group-hover:underline line-clamp-2 leading-tight">
                      独学でAI・機械学習をマスターするための絶対王道ロードマップ
                    </h3>
                  </div>
                </a>

                <a href="#" className="flex gap-4 group">
                  <div className="w-[84px] h-[84px] bg-gray-100 rounded-xl shrink-0 overflow-hidden relative border border-gray-200 group-hover:border-black/30 transition-colors">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-bold text-xs bg-gradient-to-br from-gray-50 to-gray-200">IMG</div>
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-[0.65rem] text-gray-500 font-extrabold tracking-wide mb-1 uppercase">インタビュー記事</p>
                    <h3 className="font-extrabold text-sm group-hover:underline line-clamp-2 leading-tight">
                      先輩に聞く！外部院試で上位合格を果たすまでの毎日のスケジュール
                    </h3>
                  </div>
                </a>
              </div>
            </section>

            {/* 運営からのお知らせ */}
            <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-7">
              <h2 className="text-xl font-black mb-6 flex items-center gap-2">
                📢 お知らせ
              </h2>
              <ul className="space-y-4">
                <li className="border-b border-gray-100 pb-4">
                  <span className="text-[0.7rem] bg-red-100 text-red-600 font-extrabold px-2 py-0.5 rounded mb-2 inline-block">重要</span>
                  <a href="#" className="block font-extrabold hover:underline text-sm leading-snug">
                    初回のアンケート入力（オンボーディング）がまだの方は、ご協力をお願いします。
                  </a>
                </li>
                <li className="">
                  <span className="text-[0.7rem] font-bold text-gray-400 mb-1 inline-block">2026.03.10</span>
                  <a href="#" className="block font-bold hover:underline text-sm text-gray-600 leading-snug">
                    AcadeMina β版のマイページ機能がオープンしました。
                  </a>
                </li>
              </ul>
            </section>

          </div>

        </div>
      </div>
    </main>
  );
}
