import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import QaListClient from "./QaListClient";

export default async function QaPage() {
    const { userId } = await auth();
    if (!userId) redirect("/account/login");

    const [categories, questions] = await Promise.all([
        prisma.qaCategory.findMany({ orderBy: { order: "asc" } }),
        prisma.question.findMany({
            include: {
                category: true,
                profile: { select: { firstName: true, lastName: true } },
                _count: { select: { answers: true } },
            },
            orderBy: { createdAt: "desc" },
        }),
    ]);

    return (
        <main className="mt-20 md:mt-[134px] min-h-screen bg-gray-50">
            <section className="pt-16 pb-12 px-6 text-center bg-white border-b border-gray-100">
                <p className="text-xs font-bold tracking-[0.2em] text-accent uppercase mb-3">Q&amp;A Board</p>
                <h1 className="text-4xl font-extrabold tracking-tight mb-4">掲示板</h1>
                <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
                    大学院受験に関する質問・疑問を投稿しよう。<br />
                    先輩や仲間からの回答が届きます。
                </p>
            </section>

            <QaListClient
                initialQuestions={questions as any}
                categories={categories}
                currentUserId={userId}
            />
        </main>
    );
}
