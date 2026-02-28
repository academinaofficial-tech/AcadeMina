import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "利用規約・プライバシーポリシー（準備中）",
};

export default function Page() {
  return (
    <div style={{
      maxWidth: 900,
      margin: "120px auto 80px",
      padding: "0 20px",
      lineHeight: 1.8,
    }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: 16 }}>利用規約・プライバシーポリシー（準備中）</h1>
      <div dangerouslySetInnerHTML={{ __html: "<p>本文は後で追加してください。</p>" }} />
    </div>
  );
}
