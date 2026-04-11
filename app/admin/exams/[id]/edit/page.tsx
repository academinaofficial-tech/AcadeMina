import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import AdminExamEditClient from "./AdminExamEditClient";

export const metadata = {
    title: "教材編集 | Admin | AcadeMina",
};

export default async function AdminExamEditPage({ params }: { params: { id: string } }) {
    const user = await currentUser();
    const role = (user?.publicMetadata as any)?.role;
    if (role !== "admin") redirect("/");

    const [exam, universities] = await Promise.all([
        prisma.exam.findUnique({
            where: { id: params.id },
            include: {
                department: {
                    include: {
                        faculty: {
                            include: { university: true },
                        },
                    },
                },
            },
        }),
        prisma.university.findMany({
            include: {
                faculties: {
                    include: { departments: true },
                },
            },
        }),
    ]);

    if (!exam) notFound();

    return (
        <main className="mt-20 md:mt-[134px] min-h-screen bg-gray-50/50 py-12 px-5">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-extrabold mb-2 text-text">教材を編集</h1>
                <p className="text-sm text-gray-400 mb-8">{exam.title}</p>
                <AdminExamEditClient exam={exam} hierarchy={universities} />
            </div>
        </main>
    );
}
