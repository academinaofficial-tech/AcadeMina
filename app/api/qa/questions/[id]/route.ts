import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
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
    if (!question) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(question);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await currentUser();
    const role = (user?.publicMetadata as any)?.role;

    const question = await prisma.question.findUnique({ where: { id: params.id } });
    if (!question) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (question.profileId !== userId && role !== "admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.question.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
}
