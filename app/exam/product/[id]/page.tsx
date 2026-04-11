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

    const uni = exam?.department?.faculty?.university?.name ?? "";
    const fac = exam?.department?.faculty?.name ?? "";
    const prefix = [uni, fac].filter(Boolean).join(" ");
    const suffix = exam?.description ? exam.description.slice(0, 100) + (exam.description.length > 100 ? "…" : "") : "院試対策教材の詳細・購入ページです。";
    const description = prefix ? `${prefix}の院試対策教材。${suffix}` : suffix;

    return {
        title: exam?.title ? `${exam.title} | AcadeMina` : "教材詳細 | AcadeMina",
        description,
    };
}

export default async function ExamDetailPage({ params }: { params: { id: string } }) {
    const { userId } = await auth();

    const exam = await prisma.exam.findUnique({
        where: { id: params.id },
        include: {
            department: { include: { faculty: { include: { university: true } } } },
        },
    });
    if (!exam) notFound();

    let hasPurchased = false;
    let isAdmin = false;

    if (userId) {
        const [purchase, user] = await Promise.all([
            prisma.purchase.findFirst({ where: { profileId: userId, examId: params.id } }),
            currentUser(),
        ]);
        hasPurchased = !!purchase;
        isAdmin = (user?.publicMetadata as any)?.role === "admin";
    }

    return (
        <main className="mt-20 md:mt-[134px]">
            <ProductDetailClient exam={exam} hasPurchased={hasPurchased} isAdmin={isAdmin} />
        </main>
    );
}
