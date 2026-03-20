import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

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