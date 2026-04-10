import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { type, price: priceOverride, preferredSlots, message, paymentMethodId, stripeCustomerId: passedCustomerId } = body;

    if (!type || !paymentMethodId) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses[0]?.emailAddress;
    const profile = await prisma.profile.findFirst({
        where: { OR: [{ id: userId }, ...(email ? [{ email }] : [])] },
    });
    if (!profile) {
        return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }
    const profileId = profile.id;

    // 料金はフロントから渡された値を優先、なければDBから取得
    let finalPrice: number;
    if (typeof priceOverride === "number" && priceOverride > 0) {
        finalPrice = priceOverride;
    } else {
        const servicePrice = await prisma.servicePrice.findUnique({ where: { type } });
        if (!servicePrice) {
            return NextResponse.json({ error: "Service price not found" }, { status: 404 });
        }
        finalPrice = servicePrice.price;
    }

    // setup-intentで作成したCustomerIDを優先使用
    let stripeCustomerId: string;
    if (passedCustomerId) {
        stripeCustomerId = passedCustomerId;
    } else {
        const existingRequests = await prisma.mentorRequest.findFirst({
            where: { profileId, stripeCustomerId: { not: null } },
            select: { stripeCustomerId: true },
        });
        if (existingRequests?.stripeCustomerId) {
            stripeCustomerId = existingRequests.stripeCustomerId;
        } else {
            const customer = await stripe.customers.create({
                email: profile.email,
                name: `${profile.lastName} ${profile.firstName}`,
            });
            stripeCustomerId = customer.id;
        }
    }

    // SetupIntentで既にCustomerに紐付いているのでattachは不要
    // デフォルト支払い方法として設定するだけ
    await stripe.customers.update(stripeCustomerId, {
        invoice_settings: { default_payment_method: paymentMethodId },
    });

    // 申込レコードを作成
    const request = await prisma.mentorRequest.create({
        data: {
            profileId,
            type,
            preferredSlots: preferredSlots ?? null,
            message: message ?? null,
            price: finalPrice,
            stripeCustomerId,
            stripePaymentMethodId: paymentMethodId,
        },
    });

    return NextResponse.json({ id: request.id });
}
