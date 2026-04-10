import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";
import { auth } from "@clerk/nextjs/server";

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

    if (!userId) redirect("/sign-in");

    let hasPurchased = false;
    const { userId } = await auth();
    if (userId) {
        const profile = await prisma.profile.findUnique({
            where: { id: userId },
            include: { purchases: { where: { examId: params.id } } }
        });
        if (profile && profile.purchases.length > 0) {
            hasPurchased = true;
        }
    }

    return (
        <main className="mt-20 md:mt-[134px]">
            <ProductDetailClient exam={exam} hasPurchased={hasPurchased} />
        </main>
    );
}
