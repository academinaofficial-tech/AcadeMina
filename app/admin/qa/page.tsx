import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminQaClient from "./AdminQaClient";

export default async function AdminQaPage() {
    const { userId } = await auth();
    if (!userId) redirect("/account/login");

    const user = await currentUser();
    const role = (user?.publicMetadata as any)?.role;
    if (role !== "admin") redirect("/");

    const categories = await prisma.qaCategory.findMany({
        orderBy: { order: "asc" },
        include: { _count: { select: { questions: true } } },
    });

    return (
        <main className="mt-20 md:mt-[134px] min-h-screen bg-gray-50">
            <div className="max-w-[800px] mx-auto px-5 py-16">
                <h1 className="text-2xl font-extrabold mb-10">管理画面 / 掲示板カテゴリ管理</h1>
                <AdminQaClient categories={categories as any} />
            </div>
        </main>
    );
}
