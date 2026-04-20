import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error("STRIPE_WEBHOOK_SECRET is missing");
    }

    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook Action Error: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const userId = session.metadata?.userId;
    const cartIds = session.metadata?.cartIds?.split(",") || [];
    const couponCode = session.metadata?.couponCode;

    if (!userId) {
      console.error("No userId found in session metadata");
      return new NextResponse("User ID missing", { status: 400 });
    }

    if (cartIds.length === 0) {
      console.error("No cartIds found in session metadata");
      return new NextResponse("Cart IDs missing", { status: 400 });
    }

    try {
      // 重複処理防止: このセッションで購入済みかチェック
      const existingPurchase = await prisma.purchase.findFirst({
        where: { stripeId: session.id },
      });

      if (!existingPurchase) {
        // 購入レコードを一括作成
        await Promise.all(
          cartIds.map((examId) =>
            prisma.purchase.create({
              data: {
                profileId: userId,
                examId,
                stripeId: session.id,
                couponCode: couponCode ?? null,
              },
            })
          )
        );

        // クーポン使用カウントをインクリメント
        if (couponCode) {
          await prisma.coupon.update({
            where: { code: couponCode },
            data: { usedCount: { increment: 1 } },
          });
        }
      }
    } catch (dbError) {
      console.error("Database Error during webhook processing:", dbError);
      return new NextResponse("Database Error", { status: 500 });
    }
  }

  return new NextResponse(null, { status: 200 });
}
