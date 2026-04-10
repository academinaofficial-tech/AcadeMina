import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import MentorHistoryClient from "./MentorHistoryClient";

export default async function MentorHistoryPage() {
    const { userId } = auth();
    if (!userId) redirect("/account/login");

    const requests = await prisma.mentorRequest.findMany({
        where: { profileId: userId },
        orderBy: { createdAt: "desc" },
    });

    return (
        <main className="mt-20 md:mt-[134px] min-h-screen bg-gray-50">
            <div className="max-w-[800px] mx-auto px-5 py-16">
                <h1 className="text-2xl font-extrabold mb-8">メンターサービス 申込履歴</h1>
                <MentorHistoryClient requests={requests} />
            </div>
        </main>
    );
}
