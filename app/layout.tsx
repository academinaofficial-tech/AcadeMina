import type { Metadata } from "next";
import AppProviders from "@/components/providers/AppProviders";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// ==========================================
// 🚨 ここから最強のSEO・OGP設定（土台） 🚨
// ==========================================
export const metadata: Metadata = {
  metadataBase: new URL("https://academina.com"),
  title: {
    default: "大学院受験対策ならAcadeMina｜過去問・合格体験記・研究室情報",
    template: "%s | AcadeMina",
  },
  description: "AcadeMina（アカデミナ）は、大学院進学を目指す学生のためのプラットフォームです。難関大合格者による過去問解答解説、合格体験記、研究計画書のノウハウや、研究室情報などのナレッジを提供し、あなたの院試突破を後押しします。",
  keywords: ["院試", "大学院入試", "過去問", "研究計画書", "合格体験記", "AcadeMina", "アカデミナ", "研究室"],
  openGraph: {
    title: "大学院受験対策ならAcadeMina｜過去問・合格体験記・研究室情報",
    description: "大学院進学を目指す学生のための総合サポートプラットフォーム。過去問解説や合格体験記で院試突破を後押しします。",
    url: "https://academina.com",
    siteName: "AcadeMina",
    locale: "ja_JP",
    type: "website",
    images: [
      {
        url: "/images/logo.png", // publicの中にある画像を指定
      },
    ],
  },
  twitter: {
    card: "summary", // ロゴが綺麗に四角く収まる設定
    title: "大学院受験対策ならAcadeMina｜過去問・合格体験記・研究室情報",
    description: "大学院進学を目指す学生のための総合サポートプラットフォーム。",
    images: ["/images/logo.png"],
  },
};

// ==========================================
// 🚨 ここから下は元の画面表示用コード（変更なし） 🚨
// ==========================================
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProviders>
      <html lang="ja">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Kaushan+Script&family=Montserrat:wght@900&family=Orbitron:wght@700&family=Playfair+Display:ital,wght@1,700&display=swap"
            rel="stylesheet"
          />
        </head>
        <body>
          <Header />
          {children}
          <Footer />
        </body>
      </html>
    </AppProviders>
  );
}