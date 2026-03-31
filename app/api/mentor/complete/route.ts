import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

// 運営が「完了」にして引き落としを実行するAPI
export async function POST(req: Request) {
    const { userId, sessionClaims } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const role = (sessionClaims?.publicMetadata as any)?.role;
    if (role !== "admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { requestId, adminNote } = await req.json();
    if (!requestId) {
        return NextResponse.json({ error: "Missing requestId" }, { status: 400 });
    }

    const request = await prisma.mentorRequest.findUnique({ where: { id: requestId } });
    if (!request) {
        return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }
    if (request.status === "DELIVERED" || request.status === "PAID") {
        return NextResponse.json({ error: "Already completed" }, { status: 400 });
    }
    if (!request.stripeCustomerId || !request.stripePaymentMethodId) {
        return NextResponse.json({ error: "No payment method on file" }, { status: 400 });
    }

    // 保存済みカードに引き落とし
    const paymentIntent = await stripe.paymentIntents.create({
        amount: request.price,
        currency: "jpy",
        customer: request.stripeCustomerId,
        payment_method: request.stripePaymentMethodId,
        confirm: true,
        off_session: true,
        description: request.type === "CONSULTATION" ? "AcadeMina 面談サービス" : "AcadeMina 研究計画書添削",
    });

    await prisma.mentorRequest.update({
        where: { id: requestId },
        data: {
            status: "DELIVERED",
            stripePaymentIntentId: paymentIntent.id,
            adminNote: adminNote ?? null,
            paidAt: new Date(),
        },
    });

    return NextResponse.json({ success: true });
}
