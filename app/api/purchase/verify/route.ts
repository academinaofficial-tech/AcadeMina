import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { session_id } = await req.json();

        if (!session_id) {
            return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
        }

        // Stripeからセッションの詳細を取得
        const session = await stripe.checkout.sessions.retrieve(session_id);

        if (session.payment_status !== "paid") {
            return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
        }

        // メタデータから購入した教材IDを取得
        const cartIds = session.metadata?.cartIds?.split(",") || [];

        if (cartIds.length === 0) {
            return NextResponse.json({ error: "No products found in session" }, { status: 400 });
        }

        // データベースに購入記録を作成
        // すでに記録がある場合は重複させない（upsertまわりの考慮）
        const purchases = await Promise.all(
            cartIds.map(async (examId) => {
                // 同じユーザーが同じ教材を二重に購入記録しないようにチェック
                const existing = await prisma.purchase.findFirst({
                    where: {
                        profileId: userId,
                        examId: examId,
                    },
                });

                if (existing) return existing;

                return prisma.purchase.create({
                    data: {
                        profileId: userId,
                        examId: examId,
                        stripeId: session.id,
                    },
                });
            })
        );

        return NextResponse.json({ success: true, purchases, examIds: cartIds });
    } catch (err: any) {
        console.error("Verification Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
