import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");

    const questions = await prisma.question.findMany({
        where: categoryId ? { categoryId } : undefined,
        include: {
            category: true,
            profile: { select: { firstName: true, lastName: true } },
            _count: { select: { answers: true } },
        },
        orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(questions);
}

export async function POST(req: Request) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { title, body, categoryId, anonymous } = await req.json();
    if (!title || !body || !categoryId) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const profile = await prisma.profile.findUnique({ where: { id: userId } });
    if (!profile) {
        return NextResponse.json({ error: "プロフィールが見つかりません。オンボーディングを完了してください。" }, { status: 404 });
    }

    try {
        const question = await prisma.question.create({
            data: { title, body, categoryId, profileId: userId, anonymous: anonymous ?? false },
            include: {
                category: true,
                profile: { select: { firstName: true, lastName: true } },
            },
        });
        return NextResponse.json(question);
    } catch (e: any) {
        console.error("question create error:", e);
        return NextResponse.json({ error: e.message ?? "DB error" }, { status: 500 });
    }
}
