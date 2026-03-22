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
        
        const { cartIds } = await req.json();

        if (!cartIds || !Array.isArray(cartIds) || cartIds.length === 0) {
            return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
        }

        // データベースから最新の価格情報を取得（フロントエンドからの価格を信用しないため）
        const exams = await prisma.exam.findMany({
            where: {
                id: { in: cartIds },
            },
        });

        if (exams.length === 0) {
            return NextResponse.json({ error: "Products not found" }, { status: 404 });
        }

        // StripeのLine Itemsを作成
        const lineItems = exams.map((exam) => ({
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
        }));

        // Checkout Sessionを作成
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/order-complete?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout`,
            metadata: {
                cartIds: cartIds.join(","),
                userId: userId,
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (err: any) {
        console.error("Stripe Checkout Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
