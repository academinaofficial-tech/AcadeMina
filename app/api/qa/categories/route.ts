import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
    const categories = await prisma.qaCategory.findMany({
        orderBy: { order: "asc" },
    });
    return NextResponse.json(categories);
}

export async function POST(req: Request) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await currentUser();
    const role = (user?.publicMetadata as any)?.role;
    if (role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { name, order } = await req.json();
    if (!name) return NextResponse.json({ error: "Missing name" }, { status: 400 });

    const category = await prisma.qaCategory.create({
        data: { name, order: order ?? 0 },
    });
    return NextResponse.json(category);
}

export async function DELETE(req: Request) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await currentUser();
    const role = (user?.publicMetadata as any)?.role;
    if (role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await prisma.qaCategory.delete({ where: { id } });
    return NextResponse.json({ success: true });
}
