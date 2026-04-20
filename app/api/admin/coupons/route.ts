import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
    const user = await currentUser();
    if ((user?.publicMetadata as any)?.role !== "admin") return null;
    return user;
}

// GET: クーポン一覧
export async function GET() {
    if (!(await requireAdmin())) {
        return new NextResponse("Forbidden", { status: 403 });
    }
    const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(coupons);
}

// POST: クーポン作成
export async function POST(req: Request) {
    if (!(await requireAdmin())) {
        return new NextResponse("Forbidden", { status: 403 });
    }

    const body = await req.json();
    const { code, discountType, discountValue, minAmount, maxUses, expiresAt } = body;

    if (!code || !discountType || !discountValue) {
        return NextResponse.json({ error: "必須項目が不足しています" }, { status: 400 });
    }

    const coupon = await prisma.coupon.create({
        data: {
            code: code.toUpperCase(),
            discountType,
            discountValue: Number(discountValue),
            minAmount: Number(minAmount ?? 0),
            maxUses: maxUses ? Number(maxUses) : null,
            expiresAt: expiresAt ? new Date(expiresAt) : null,
        },
    });

    return NextResponse.json(coupon);
}

// PATCH: 有効/無効の切り替え
export async function PATCH(req: Request) {
    if (!(await requireAdmin())) {
        return new NextResponse("Forbidden", { status: 403 });
    }

    const { id, isActive } = await req.json();
    const coupon = await prisma.coupon.update({
        where: { id },
        data: { isActive },
    });
    return NextResponse.json(coupon);
}
