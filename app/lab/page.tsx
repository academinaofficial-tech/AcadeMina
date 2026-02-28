import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lab Insight（準備中）",
};

export default function Page() {
  return (
    <div style={{
      maxWidth: 900,
      margin: "120px auto 80px",
      padding: "0 20px",
      lineHeight: 1.8,
    }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: 16 }}>Lab Insight（準備中）</h1>
      <div dangerouslySetInnerHTML={{ __html: "<p>このページは後続フェーズで移植します（lab.html が未添付）。</p>" }} />
    </div>
  );
}
