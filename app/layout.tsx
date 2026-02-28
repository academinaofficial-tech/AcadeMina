import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AcadeMina",
  description: "研究者を、増やす。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Kaushan+Script&family=Montserrat:wght@900&family=Orbitron:wght@700&family=Playfair+Display:ital,wght@1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
