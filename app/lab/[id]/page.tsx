import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import LabDetailClient from "./LabDetailClient";

interface PageProps {
    params: {
        id: string;
    };
}

export default async function Page({ params }: PageProps) {
    const lab = await prisma.lab.findUnique({
        where: { id: params.id },
        include: {
            university: true,
            department: true,
        },
    });

    if (!lab) {
        notFound();
    }

    return (
        <main className="mt-20 md:mt-[134px]">
            <LabDetailClient lab={lab} />
        </main>
    );
}
