import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "大学院受験の過去問・対策教材詳細｜AcadeMina",
  description:
    "教材の内容、対象大学・研究科、価格、特徴を詳しく確認できる商品詳細ページです。自分の志望先や対策テーマに合う教材かを比較しながら検討できます。",
};

export default async function ExamDetailPage({ params }: { params: { id: string } }) {
    const { userId } = auth();

    // 1. ログインチェック
    if (!userId) {
        redirect("/sign-in");
    }

    // 2. オンボーディング（プロフィール作成）済みチェック
    const profile = await prisma.profile.findUnique({
        where: { id: userId } // ClerkのuserIdをProfileのidとして保存している場合 [cite: 1]
    });

    if (!profile) {
        redirect("/onboarding");
    }

    // ここから詳細ページの表示ロジック
    return <div>教材の詳細内容...</div>;
}