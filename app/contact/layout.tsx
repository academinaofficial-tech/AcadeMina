// app/contact/layout.tsx
import type { Metadata } from "next";

// サーバー側で処理されるSEO設定
export const metadata: Metadata = {
  title: "お問い合わせ",
  description: "AcadeMina（アカデミナ）に関するお問い合わせ、教材に関するご質問、メディア掲載や協業に関するご相談はこちらのフォームからご連絡ください。",
};

// 中身（page.tsxのフォーム）をそのまま表示するだけの枠組み
export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}