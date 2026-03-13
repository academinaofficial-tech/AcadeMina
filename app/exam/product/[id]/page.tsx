import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";

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

    return (
        <main className="mt-20 md:mt-[134px]">
            <ProductDetailClient exam={exam} />
        </main>
    );
}
