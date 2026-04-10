import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        
        const { examId } = await req.json();

        if (!examId || typeof examId !== "string") {
            return NextResponse.json({ error: "examId is required" }, { status: 400 });
        }

        // データベースから最新の価格情報を取得（フロントエンドからの価格を信用しないため）
        const exam = await prisma.exam.findUnique({
            where: { id: examId },
        });

        if (!exam) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        // Checkout Sessionを作成
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "jpy",
                        product_data: {
                            name: exam.title,
                            description: exam.category,
                            images: [
                                exam.image
                                    ? (exam.image.startsWith("http") ? exam.image : `${process.env.NEXT_PUBLIC_APP_URL}${exam.image}`)
                                    : `${process.env.NEXT_PUBLIC_APP_URL}/placeholder.png`
                            ],
                        },
                        unit_amount: exam.price,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/order-complete?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/exam/product/${examId}`,
            metadata: {
                cartIds: examId, // Stripe webhookとの後方互換のため同じキーを維持
                userId: userId,
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (err: any) {
        console.error("Stripe Checkout Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

