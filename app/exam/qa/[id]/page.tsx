import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import QaDetailClient from "./QaDetailClient";

export const dynamic = "force-dynamic";

export default async function QaDetailPage({ params }: { params: { id: string } }) {
    const { userId } = await auth();
    if (!userId) redirect("/account/login");

    const user = await currentUser();
    const role = (user?.publicMetadata as any)?.role ?? "user";

    const question = await prisma.question.findUnique({
        where: { id: params.id },
        include: {
            category: true,
            profile: { select: { firstName: true, lastName: true } },
            answers: {
                include: {
                    profile: { select: { firstName: true, lastName: true } },
                },
                orderBy: { createdAt: "asc" },
            },
        },
    });

    if (!question) notFound();

    return (
        <main className="mt-20 md:mt-[134px] min-h-screen bg-gray-50">
            <div className="max-w-[860px] mx-auto px-5 py-12">
                {/* パンくず */}
                <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
                    <Link href="/exam/qa" className="hover:text-text transition-colors">掲示板</Link>
                    <span>/</span>
                    <span className="text-gray-600 line-clamp-1">{question.title}</span>
                </nav>

                <QaDetailClient
                    question={question as any}
                    currentUserId={userId}
                    role={role}
                />
            </div>
        </main>
    );
}
