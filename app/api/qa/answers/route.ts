import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await currentUser();
    const role = (user?.publicMetadata as any)?.role;
    if (role !== "mentor" && role !== "admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { body, questionId } = await req.json();
    if (!body || !questionId) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const profile = await prisma.profile.findUnique({ where: { id: userId } });
    if (!profile) {
        return NextResponse.json({ error: "プロフィールが見つかりません。オンボーディングを完了してください。" }, { status: 404 });
    }

    const answer = await prisma.answer.create({
        data: { body, questionId, profileId: userId },
        include: {
            profile: { select: { firstName: true, lastName: true } },
        },
    });
    return NextResponse.json(answer);
}
