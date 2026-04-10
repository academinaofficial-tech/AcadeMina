import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";
import { auth } from "@clerk/nextjs/server";

interface PageProps {
    params: {
        id: string;
    };
}

export default async function Page({ params }: PageProps) {
    const exam = await prisma.exam.findUnique({
        where: { id: params.id },
    });

    if (!exam) {
        notFound();
    }

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
