import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// 料金取得（全員）
export async function GET() {
    const prices = await prisma.servicePrice.findMany();
    return NextResponse.json(prices);
}

// 料金更新（adminのみ）
export async function POST(req: Request) {
    const { userId, sessionClaims } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (sessionClaims?.publicMetadata as any)?.role;
    if (role !== "admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { type, price } = await req.json();
    if (!type || price === undefined) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const updated = await prisma.servicePrice.update({
        where: { type },
        data: { price: Number(price) },
    });

    return NextResponse.json(updated);
}
