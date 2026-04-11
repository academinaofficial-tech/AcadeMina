import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import QaListClient from "./QaListClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "大学院受験Q&A掲示板｜院試の疑問を先輩・仲間に質問",
    description: "大学院受験に関する疑問・質問を投稿できる掲示板。研究室選び、研究計画書の書き方、院試勉強法、TOEIC・英語対策まで、先輩や仲間からの回答が届きます。AcadeMinaのQ&Aボードで院試の悩みを解決しましょう。",
};

export default async function QaPage() {
    const { userId } = await auth();

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
