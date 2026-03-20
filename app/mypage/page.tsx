import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma"; // ※ご自身のPrismaのパスに合わせてください

export default async function ExamDetailPage() {
    // 1. ClerkからユーザーIDを取得
    const { userId } = auth();

    // （念のため）userIdがなければログイン画面へ
    if (!userId) {
        redirect("/account/login");
    }

    // 2. Prismaで「Profile（オンボーディングデータ）」が存在するかチェック
    const profile = await prisma.profile.findUnique({
        where: { id: userId }
    });

    // 3. プロフィールが無ければ、強制的にオンボーディング画面へ飛ばす
    if (!profile) {
        redirect("/onboarding"); // ※実際のオンボーディングページのURLにしてください
    }

    // ========== ここから下は通常のページ描画 ==========
    return (
        <div>
            <h1>教材の詳細コンテンツ（オンボーディング完了者だけが見れる）</h1>
        </div>
    );
}