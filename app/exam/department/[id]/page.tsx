import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ExamDetailClient from "./ExamDetailClient";

interface PageProps {
    params: {
        id: string;
    };
}

export default async function Page({ params }: PageProps) {
    const department = await prisma.department.findUnique({
        where: { id: params.id },
        include: {
            university: true,
        },
    });

    if (!department) {
        notFound();
    }

    const products = await prisma.exam.findMany({
        where: { deptId: department.id },
    });

    const recommendations = await prisma.department.findMany({
        where: {
            theme: department.theme,
            NOT: { id: department.id }
        },
        include: { university: true },
        take: 3
    });

    return (
        <main className="mt-20 md:mt-[134px]">
            <ExamDetailClient
                department={department}
                products={products}
                recommendations={recommendations}
            />
        </main>
    );
}
