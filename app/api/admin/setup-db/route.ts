import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
    await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "Coupon" (
            "id" TEXT NOT NULL,
            "code" TEXT NOT NULL,
            "discountType" TEXT NOT NULL,
            "discountValue" INTEGER NOT NULL,
            "minAmount" INTEGER NOT NULL DEFAULT 0,
            "maxUses" INTEGER,
            "usedCount" INTEGER NOT NULL DEFAULT 0,
            "expiresAt" TIMESTAMP(3),
            "isActive" BOOLEAN NOT NULL DEFAULT true,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "Coupon_pkey" PRIMARY KEY ("id")
        )
    `);

    await prisma.$executeRawUnsafe(`
        CREATE UNIQUE INDEX IF NOT EXISTS "Coupon_code_key" ON "Coupon"("code")
    `);

    return NextResponse.json({ ok: true, message: "Couponテーブルを作成しました" });
}
