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

        const { examIds, couponCode } = await req.json();

        const ids: string[] = Array.isArray(examIds) ? examIds : [];
        if (ids.length === 0) {
            return NextResponse.json({ error: "商品が選択されていません" }, { status: 400 });
        }

        const exams = await prisma.exam.findMany({ where: { id: { in: ids } } });
        if (exams.length === 0) {
            return NextResponse.json({ error: "商品が見つかりません" }, { status: 404 });
        }

        // クーポン検証（サーバー側で再検証）
        let stripeCouponId: string | undefined;
        let resolvedCouponCode: string | undefined;

        if (couponCode) {
            const coupon = await prisma.coupon.findUnique({ where: { code: couponCode } });
            const subtotal = exams.reduce((s, e) => s + e.price, 0);

            if (
                coupon &&
                coupon.isActive &&
                (!coupon.expiresAt || coupon.expiresAt > new Date()) &&
                (coupon.maxUses === null || coupon.usedCount < coupon.maxUses) &&
                subtotal >= coupon.minAmount
            ) {
                const discountAmount =
                    coupon.discountType === "PERCENT"
                        ? Math.floor((subtotal * coupon.discountValue) / 100)
                        : Math.min(coupon.discountValue, subtotal);

                // Stripe側にクーポンを動的作成
                const stripeCoupon = await stripe.coupons.create({
                    amount_off: discountAmount,
                    currency: "jpy",
                    duration: "once",
                    name: `クーポン: ${coupon.code}`,
                });
                stripeCouponId = stripeCoupon.id;
                resolvedCouponCode = coupon.code;
            }
        }

        const lineItems = exams.map((exam) => ({
            price_data: {
                currency: "jpy",
                product_data: {
                    name: exam.title,
                    description: exam.category,
                    images: [
                        exam.image
                            ? exam.image.startsWith("http")
                                ? exam.image
                                : `${process.env.NEXT_PUBLIC_APP_URL}${exam.image}`
                            : `${process.env.NEXT_PUBLIC_APP_URL}/placeholder.png`,
                    ],
                },
                unit_amount: exam.price,
            },
            quantity: 1,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            ...(stripeCouponId ? { discounts: [{ coupon: stripeCouponId }] } : {}),
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/order-complete?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
            metadata: {
                cartIds: ids.join(","),
                userId,
                ...(resolvedCouponCode ? { couponCode: resolvedCouponCode } : {}),
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (err: any) {
        console.error("Stripe Checkout Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
