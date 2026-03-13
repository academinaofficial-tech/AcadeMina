import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "マイページ（準備中）",
};

export default function Page() {
  return (
    <div className="max-w-[900px] my-[120px] mx-auto mb-[80px] px-5 leading-[1.8]">
      <h1 className="text-[2rem] font-extrabold mb-4">マイページ（準備中）</h1>
      <p>ログイン機能（Clerk）導入後に実装します。</p>
    </div>
  );
}
