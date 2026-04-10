import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import QaNewClient from "./QaNewClient";

export default async function QaNewPage() {
    const { userId } = await auth();
    if (!userId) redirect("/account/login");

    const categories = await prisma.qaCategory.findMany({
        orderBy: { order: "asc" },
    });

    return (
        <main className="mt-20 md:mt-[134px] min-h-screen bg-gray-50">
            <div className="max-w-[720px] mx-auto px-5 py-16">
                <div className="mb-10">
                    <p className="text-xs font-bold tracking-[0.2em] text-accent uppercase mb-2">Q&amp;A Board</p>
                    <h1 className="text-3xl font-extrabold tracking-tight">質問を投稿する</h1>
                </div>
                <QaNewClient categories={categories} />
            </div>
        </main>
    );
}
