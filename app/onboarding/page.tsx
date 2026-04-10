import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import OnboardingForm from "./OnboardingForm";

export default async function OnboardingPage() {
    // 0. すでにプロフィールがある場合はマイページへ
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) redirect("/account/login");
    const userEmail = user.emailAddresses[0].emailAddress;

    const profile = await prisma.profile.findFirst({
        where: {
            OR: [
                { id: userId },
                { email: userEmail }
            ]
        }
    });

    if (profile) {
        // もし「1メアド1アカウント」でClerkのID(userId)が変わってしまっていた場合、
        // 既存プロフィールのIDを最新のClerk IDに同期させてマイページへ飛ばす
        if (profile.id !== userId) {
            try {
                await prisma.profile.update({
                    where: { email: userEmail },
                    data: { id: userId }
                });
            } catch (err) {
                console.error("Failed to sync profile ID:", err);
            }
        }
        redirect("/mypage");
    }

    // 1. 大学・学部・専攻のマスターデータを取得
    const universities = await prisma.university.findMany({
        include: {
            faculties: {
                include: {
                    departments: true,
                },
            },
        },
        orderBy: { name: "asc" },
    });

    // 2. テーマグループとテーマのマスターデータを取得
    const themeGroups = await prisma.themeGroup.findMany({
        include: {
            themes: true,
        },
        orderBy: { name: "asc" },
    });

    return (
        <main className="min-h-screen pt-[180px] pb-[100px] px-5 bg-white">
            <div className="max-w-[800px] mx-auto bg-white p-10 rounded-2xl shadow-xl">
                <h1 className="text-3xl font-extrabold text-center mb-8">
                    アンケートにご協力ください
                </h1>
                <p className="text-center text-gray-600 mb-10">
                    あなたに最適なキャリアパスと教材を提案するために、現在の状況を教えてください。
                </p>

                {/* クライアントコンポーネントにデータを渡す */}
                <OnboardingForm universities={universities} themeGroups={themeGroups} />
            </div>
        </main>
    );
}