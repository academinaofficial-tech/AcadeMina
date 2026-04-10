import Link from "next/link";

export const metadata = {
  title: "購入キャンセル | AcadeMina",
};

export default function Page() {
  return (
    <main className="mt-20 md:mt-[134px] min-h-screen bg-gray-50/50 flex items-center justify-center">
      <div className="max-w-[500px] mx-auto py-24 px-5 text-center">
        <div className="text-6xl mb-8">↩️</div>
        <h1 className="text-2xl font-bold text-gray-700 mb-4">購入をキャンセルしました</h1>
        <p className="text-gray-500 mb-10">
          決済がキャンセルされました。<br />
          引き続き教材をご覧いただけます。
        </p>
        <Link
          href="/exam-store"
          className="inline-block bg-text text-white py-4 px-10 rounded-full font-bold hover:bg-gray-800 transition-colors"
        >
          教材ストアへ戻る
        </Link>
      </div>
    </main>
  );
}
