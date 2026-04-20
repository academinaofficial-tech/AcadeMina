import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    const { code, subtotal } = await req.json();

    if (!code || typeof subtotal !== "number") {
        return NextResponse.json({ error: "パラメータが不正です" }, { status: 400 });
    }

    const coupon = await prisma.coupon.findUnique({ where: { code } });

    if (!coupon || !coupon.isActive) {
        return NextResponse.json({ error: "クーポンコードが無効です" }, { status: 400 });
    }

    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
        return NextResponse.json({ error: "クーポンの有効期限が切れています" }, { status: 400 });
    }

    if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
        return NextResponse.json({ error: "このクーポンはすでに使用済みです" }, { status: 400 });
    }

    if (subtotal < coupon.minAmount) {
        return NextResponse.json(
            { error: `¥${coupon.minAmount.toLocaleString()}以上のご購入で適用できます` },
            { status: 400 }
        );
    }

    const discountAmount =
        coupon.discountType === "PERCENT"
            ? Math.floor((subtotal * coupon.discountValue) / 100)
            : Math.min(coupon.discountValue, subtotal);

    return NextResponse.json({
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount,
    });
}
