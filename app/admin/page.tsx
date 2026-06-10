import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

const adminMenus = [
  {
    category: "教材",
    items: [
      { href: "/admin/exams/new", label: "教材を追加", description: "新しい教材・PDFをアップロード" },
    ],
  },
  {
    category: "クーポン",
    items: [
      { href: "/admin/coupons", label: "クーポン一覧", description: "発行済みクーポンの確認・有効/無効切り替え" },
      { href: "/admin/coupons/new", label: "クーポンを発行", description: "新しい割引クーポンを作成" },
    ],
  },
  {
    category: "メンターサービス",
    items: [
      { href: "/admin/mentor", label: "申込一覧", description: "面談・添削の申込確認・完了処理・書類アップロード" },
    ],
  },
  {
    category: "Q&A",
    items: [
      { href: "/admin/qa", label: "Q&A管理", description: "質問・回答の管理" },
    ],
  },
];

export default async function AdminTopPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const user = await currentUser();
  const isAdmin = (user?.publicMetadata as any)?.role === "admin";
  if (!isAdmin) redirect("/");

  return (
    <main className="mt-20 md:mt-[134px] min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">管理画面</h1>

        <div className="space-y-8">
          {adminMenus.map((section) => (
            <div key={section.category}>
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                {section.category}
              </h2>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
                {section.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors group"
                  >
                    <div>
                      <p className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                        {item.label}
                      </p>
                      <p className="text-sm text-gray-400 mt-0.5">{item.description}</p>
                    </div>
                    <span className="text-gray-300 group-hover:text-blue-400 transition-colors text-lg">›</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
