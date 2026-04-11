import { auth } from "@clerk/nextjs/server";
import { currentUser } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import ProductDetailClient from "./ProductDetailClient";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const exam = await prisma.exam.findUnique({
        where: { id: params.id },
        include: { department: { include: { faculty: { include: { university: true } } } } },
    });
    return {
        title: exam?.title ? `${exam.title} | AcadeMina` : "教材詳細 | AcadeMina",
        description: exam?.description || "大学院受験の過去問・対策教材詳細ページです。",
    };
}

export default async function ExamDetailPage({ params }: { params: { id: string } }) {
    const { userId } = await auth();
    if (!userId) redirect(`/account/login?redirect_url=/exam/product/${params.id}`);

    const profile = await prisma.profile.findUnique({ where: { id: userId } });
    if (!profile) redirect(`/onboarding?redirect=/exam/product/${params.id}`);

    const exam = await prisma.exam.findUnique({
        where: { id: params.id },
        include: {
            department: { include: { faculty: { include: { university: true } } } },
        },
    });
    if (!exam) notFound();

    const [purchase, user] = await Promise.all([
        prisma.purchase.findFirst({ where: { profileId: userId, examId: params.id } }),
        currentUser(),
    ]);
    const hasPurchased = !!purchase;
    const isAdmin = (user?.publicMetadata as any)?.role === "admin";

    return (
        <main className="mt-20 md:mt-[134px]">
            <ProductDetailClient exam={exam} hasPurchased={hasPurchased} isAdmin={isAdmin} />
        </main>
    );
}
