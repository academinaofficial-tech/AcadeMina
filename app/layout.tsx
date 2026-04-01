import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import AppProviders from "@/components/providers/AppProviders";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
  variable: "--font-noto",
});

// ==========================================
// SEO・OGP設定
// ==========================================
export const metadata: Metadata = {
  metadataBase: new URL("https://www.academina.com"),
  title: {
    default: "AcadeMina（アカデミナ）｜大学院受験の過去問・合格体験記・研究室情報",
    template: "%s | AcadeMina",
  },
  description:
    "AcadeMina（アカデミナ）は大学院進学を目指す学生のためのプラットフォーム。難関大合格者による院試過去問の解答解説、合格体験記、研究計画書のノウハウ、研究室情報を提供し、あなたの院試突破を後押しします。",
  keywords: [
    "院試", "大学院入試", "大学院 過去問", "大学院 過去問 解答",
    "研究計画書 書き方", "合格体験記 大学院", "研究室 選び方",
    "大学院 受験対策", "院試 勉強法", "大学院 進学",
  ],
  icons: {
    icon: "/images/icon.png",
    apple: "/images/icon.png",
  },
  openGraph: {
    title: "AcadeMina（アカデミナ）｜大学院受験の過去問・合格体験記・研究室情報",
    description:
      "大学院進学を目指す学生のための総合サポートプラットフォーム。過去問解説や合格体験記で院試突破を後押しします。",
    url: "https://www.academina.com",
    siteName: "AcadeMina",
    locale: "ja_JP",
    type: "website",
    images: [
      {
        url: "/images/ogp.png",
        width: 1200,
        height: 630,
        alt: "AcadeMina - 大学院受験対策プラットフォーム",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AcadeMina（アカデミナ）｜大学院受験の過去問・合格体験記・研究室情報",
    description:
      "大学院進学を目指す学生のための総合サポートプラットフォーム。",
    images: ["/images/ogp.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://www.academina.com",
  },
};

// ==========================================
// レイアウト
// ==========================================
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppProviders>
      <html lang="ja" className={notoSansJP.variable}>
        <head>
          {/* 構造化データ */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify([
                {
                  "@context": "https://schema.org",
                  "@type": "Organization",
                  name: "AcadeMina",
                  alternateName: "アカデミナ",
                  description: "大学院進学を目指す学生のための総合プラットフォーム",
                  url: "https://www.academina.com",
                  logo: "https://www.academina.com/images/icon.png",
                  sameAs: [
                    "https://x.com/AcadeMina_ofc",
                    "https://www.instagram.com/academina.official/",
                    "https://note.com/grand_avocet7665",
                  ],
                },
                {
                  "@context": "https://schema.org",
                  "@type": "WebSite",
                  name: "AcadeMina",
                  url: "https://www.academina.com",
                  potentialAction: {
                    "@type": "SearchAction",
                    target: {
                      "@type": "EntryPoint",
                      urlTemplate: "https://www.academina.com/search?q={search_term_string}",
                    },
                    "query-input": "required name=search_term_string",
                  },
                },
                {
                  "@context": "https://schema.org",
                  "@type": "EducationalOrganization",
                  name: "AcadeMina",
                  url: "https://www.academina.com",
                  description: "大学院受験対策に特化した教育プラットフォーム",
                },
              ]),
            }}
          />
        </head>
        <body className={notoSansJP.className}>
          <Header />
          {children}
          <Footer />
        </body>
      </html>
    </AppProviders>
  );
}
