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

    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
  } catch (err: any) {
    console.error(`Webhook Action Error: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // 決済完了イベントのハンドリング
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // 購入したユーザーID（Checkout作成時にmetadataにuser_idを含める必要があります）
    // ※現在は無いため、セッション情報から顧客を特定できるか要確認ですが、
    // ここでは安全に実装するため、checkout.route.ts に修正が必要です。
    const userId = session.metadata?.userId;
    const cartIds = session.metadata?.cartIds?.split(",") || [];

    if (!userId) {
      console.error("No userId found in session metadata");
      return new NextResponse("User ID missing", { status: 400 });
    }

    if (cartIds.length === 0) {
      console.error("No cartIds found in session metadata");
      return new NextResponse("Cart IDs missing", { status: 400 });
    }

    try {
      // 重複登録を防ぐため、存在しない場合のみ作成
      await Promise.all(
        cartIds.map(async (examId) => {
          const existing = await prisma.purchase.findFirst({
            where: {
              profileId: userId,
              examId: examId,
            },
          });

          if (!existing) {
            await prisma.purchase.create({
              data: {
                profileId: userId,
                examId: examId,
                stripeId: session.id,
              },
            });
            console.log(`Created purchase: profileId=${userId}, examId=${examId}`);
          }
        })
      );
    } catch (dbError) {
      console.error("Database Error during webhook processing:", dbError);
      return new NextResponse("Database Error", { status: 500 });
    }
  }

  return new NextResponse(null, { status: 200 });
}
