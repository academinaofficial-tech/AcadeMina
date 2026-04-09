import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await currentUser();
    const role = (user?.publicMetadata as any)?.role;

    const answer = await prisma.answer.findUnique({ where: { id: params.id } });
    if (!answer) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (answer.profileId !== userId && role !== "admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.answer.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
}
